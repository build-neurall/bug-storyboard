export function generateId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
export const DEFAULT_CONFIG = {
    appId: "unknown",
    bufferDurationMs: 30000,
    collectorUrl: "http://localhost:5777",
};
//# sourceMappingURL=index.js.map