import { useState, useCallback, useRef } from "react";
import {
  EventRecord,
  InitConfig,
  StateChangeEvent,
  ActionEvent,
  ErrorEvent,
  BugStory,
  generateId,
  DEFAULT_CONFIG,
} from "@neurall/bug-storyboard-shared";

type EventBuffer = EventRecord[];
type Config = Required<InitConfig>;

let buffer: EventBuffer = [];
let config: Config = { ...DEFAULT_CONFIG };
let initialized = false;

function pruneBuffer(): void {
  const cutoff = Date.now() - config.bufferDurationMs;
  buffer = buffer.filter((e) => e.timestamp >= cutoff);
}

function addEvent(event: EventRecord): void {
  pruneBuffer();
  buffer.push(event);
}

function initBugStoryboard(userConfig?: InitConfig): void {
  if (initialized) return;
  initialized = true;

  config = {
    appId: userConfig?.appId ?? DEFAULT_CONFIG.appId,
    bufferDurationMs: userConfig?.bufferDurationMs ?? DEFAULT_CONFIG.bufferDurationMs,
    collectorUrl: userConfig?.collectorUrl ?? DEFAULT_CONFIG.collectorUrl,
  };

  if (typeof window !== "undefined") {
    const handleError = (event: ErrorEvent | PromiseRejectionEvent) => {
      let message: string;
      let stack: string | undefined;
      const context: Record<string, unknown> = {};

      if (event instanceof ErrorEvent) {
        message = event.message;
        stack = event.error?.stack;
        context.filename = event.filename;
        context.lineno = event.lineno;
        context.colno = event.colno;
      } else {
        // PromiseRejectionEvent
        const reason = (event as PromiseRejectionEvent).reason;
        message = reason?.message ?? String(reason);
        stack = reason?.stack;
        context.type = "unhandledrejection";
      }

      addEvent({
        id: generateId(),
        type: "error",
        timestamp: Date.now(),
        label: "uncaught-error",
        message,
        stack,
        context,
      } as ErrorEvent);
    };

    window.addEventListener("error", handleError as EventListener);
    window.addEventListener("unhandledrejection", handleError as EventListener);
  }
}

function getCaller(): string | undefined {
  const stack = new Error().stack;
  if (!stack) return undefined;
  const lines = stack.split("\n");
  for (const line of lines) {
    if (line.includes("useTrackedState") || line.includes("trackAction") || line.includes("captureBug")) {
      continue;
    }
    const match = line.match(/at\s+(.+):(\d+):(\d+)/);
    if (match) {
      return `${match[1]}:${match[2]}`;
    }
  }
  return undefined;
}

function useTrackedState<T>(
  label: string,
  initial: T
): [T, (next: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initial);
  const prevRef = useRef<T>(initial);

  const trackedSetState = useCallback(
    (next: T | ((prev: T) => T)) => {
      const oldValue = prevRef.current;
      const newValue = typeof next === "function" ? (next as (prev: T) => T)(oldValue) : next;

      if (oldValue !== newValue) {
        addEvent({
          id: generateId(),
          type: "state-change",
          timestamp: Date.now(),
          label,
          oldValue,
          newValue,
          caller: getCaller(),
        } as StateChangeEvent);
      }

      prevRef.current = newValue;
      setState(newValue);
    },
    [label]
  );

  return [state, trackedSetState];
}

function trackAction(label: string, meta?: Record<string, unknown>): void {
  addEvent({
    id: generateId(),
    type: "action",
    timestamp: Date.now(),
    label,
    meta,
  } as ActionEvent);
}

async function captureBug(label: string, meta?: Record<string, unknown>): Promise<void> {
  pruneBuffer();

  const story: BugStory = {
    id: generateId(),
    label,
    appId: config.appId,
    createdAt: Date.now(),
    meta,
    events: [...buffer],
  };

  try {
    const response = await fetch(`${config.collectorUrl}/stories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(story),
    });

    if (!response.ok) {
      console.error("[BugStoryboard] Failed to capture bug story:", response.statusText);
    }
  } catch (err) {
    console.error("[BugStoryboard] Failed to send bug story:", err);
  }
}

export { initBugStoryboard, useTrackedState, trackAction, captureBug };