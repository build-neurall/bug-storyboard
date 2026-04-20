export type EventType = "state-change" | "action" | "error";

export interface BaseEvent {
  id: string;
  type: EventType;
  timestamp: number;
}

export interface StateChangeEvent extends BaseEvent {
  type: "state-change";
  label: string;
  oldValue: unknown;
  newValue: unknown;
  caller?: string;
}

export interface ActionEvent extends BaseEvent {
  type: "action";
  label: string;
  meta?: Record<string, unknown>;
}

export interface ErrorEvent extends BaseEvent {
  type: "error";
  label: string;
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
}

export type EventRecord = StateChangeEvent | ActionEvent | ErrorEvent;

export interface BugStory {
  id: string;
  label: string;
  appId?: string;
  createdAt: number;
  meta?: Record<string, unknown>;
  events: EventRecord[];
}

export interface BugStorySummary {
  id: string;
  label: string;
  createdAt: number;
  eventCount: number;
}

export interface InitConfig {
  appId?: string;
  bufferDurationMs?: number;
  collectorUrl?: string;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export const DEFAULT_CONFIG: Required<InitConfig> = {
  appId: "unknown",
  bufferDurationMs: 30000,
  collectorUrl: "http://localhost:5777",
};