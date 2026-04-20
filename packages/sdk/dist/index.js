import { useState, useCallback, useRef } from "react";
import { generateId, DEFAULT_CONFIG, } from "@neurall/bug-storyboard-shared";
let buffer = [];
let config = { ...DEFAULT_CONFIG };
let initialized = false;
function pruneBuffer() {
    const cutoff = Date.now() - config.bufferDurationMs;
    buffer = buffer.filter((e) => e.timestamp >= cutoff);
}
function addEvent(event) {
    pruneBuffer();
    buffer.push(event);
}
function initBugStoryboard(userConfig) {
    if (initialized)
        return;
    initialized = true;
    config = {
        appId: userConfig?.appId ?? DEFAULT_CONFIG.appId,
        bufferDurationMs: userConfig?.bufferDurationMs ?? DEFAULT_CONFIG.bufferDurationMs,
        collectorUrl: userConfig?.collectorUrl ?? DEFAULT_CONFIG.collectorUrl,
    };
    if (typeof window !== "undefined") {
        const handleError = (event) => {
            let message;
            let stack;
            const context = {};
            if (event instanceof ErrorEvent) {
                message = event.message;
                stack = event.error?.stack;
                context.filename = event.filename;
                context.lineno = event.lineno;
                context.colno = event.colno;
            }
            else {
                // PromiseRejectionEvent
                const reason = event.reason;
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
            });
        };
        window.addEventListener("error", handleError);
        window.addEventListener("unhandledrejection", handleError);
    }
}
function getCaller() {
    const stack = new Error().stack;
    if (!stack)
        return undefined;
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
function useTrackedState(label, initial) {
    const [state, setState] = useState(initial);
    const prevRef = useRef(initial);
    const trackedSetState = useCallback((next) => {
        const oldValue = prevRef.current;
        const newValue = typeof next === "function" ? next(oldValue) : next;
        if (oldValue !== newValue) {
            addEvent({
                id: generateId(),
                type: "state-change",
                timestamp: Date.now(),
                label,
                oldValue,
                newValue,
                caller: getCaller(),
            });
        }
        prevRef.current = newValue;
        setState(newValue);
    }, [label]);
    return [state, trackedSetState];
}
function trackAction(label, meta) {
    addEvent({
        id: generateId(),
        type: "action",
        timestamp: Date.now(),
        label,
        meta,
    });
}
async function captureBug(label, meta) {
    pruneBuffer();
    const story = {
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
    }
    catch (err) {
        console.error("[BugStoryboard] Failed to send bug story:", err);
    }
}
export { initBugStoryboard, useTrackedState, trackAction, captureBug };
//# sourceMappingURL=index.js.map