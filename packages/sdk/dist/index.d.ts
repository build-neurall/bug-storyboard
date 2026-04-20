import { InitConfig } from "@neurall/bug-storyboard-shared";
declare function initBugStoryboard(userConfig?: InitConfig): void;
declare function useTrackedState<T>(label: string, initial: T): [T, (next: T | ((prev: T) => T)) => void];
declare function trackAction(label: string, meta?: Record<string, unknown>): void;
declare function captureBug(label: string, meta?: Record<string, unknown>): Promise<void>;
export { initBugStoryboard, useTrackedState, trackAction, captureBug };
//# sourceMappingURL=index.d.ts.map