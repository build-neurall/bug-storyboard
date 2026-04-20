import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
const API_URL = "/stories";
function formatOffset(timestamp, lastTimestamp) {
    const diff = lastTimestamp - timestamp;
    if (diff < 1000)
        return `T-${diff}ms`;
    if (diff < 60000)
        return `T-${Math.round(diff / 1000)}s`;
    return `T-${Math.round(diff / 60000)}m`;
}
function formatValue(value) {
    if (value === undefined)
        return "undefined";
    if (value === null)
        return "null";
    try {
        return JSON.stringify(value, null, 2);
    }
    catch {
        return String(value);
    }
}
export default function StoryDetail() {
    const { id } = useParams();
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    useEffect(() => {
        fetch(`${API_URL}/${id}`)
            .then((res) => {
            if (!res.ok)
                throw new Error("Story not found");
            return res.json();
        })
            .then(setStory)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);
    if (loading)
        return _jsx("div", { className: "container", children: "Loading..." });
    if (error)
        return _jsxs("div", { className: "container", children: ["Error: ", error] });
    if (!story)
        return _jsx("div", { className: "container", children: "Story not found" });
    const lastTimestamp = story.events[story.events.length - 1]?.timestamp ?? Date.now();
    const sortedEvents = [...story.events].sort((a, b) => a.timestamp - b.timestamp);
    return (_jsxs("div", { className: "container", style: { paddingRight: selectedEvent ? 432 : undefined }, children: [_jsx(Link, { to: "/", className: "back-link", children: "\u2190 Back to stories" }), _jsxs("header", { className: "header", children: [_jsx("h1", { children: story.label }), _jsxs("p", { style: { color: "var(--text-muted)" }, children: [new Date(story.createdAt).toLocaleString(), " \u00B7 ", story.events.length, " events", story.appId && ` · ${story.appId}`] })] }), _jsx("div", { className: "timeline", children: sortedEvents.map((event) => (_jsxs("div", { className: `timeline-item ${event.type}`, onClick: () => setSelectedEvent(event), children: [_jsx("div", { className: "time-offset", children: formatOffset(event.timestamp, lastTimestamp) }), _jsxs("div", { className: "event-label", children: [_jsx("span", { className: `badge ${event.type}`, children: event.type }), " ", event.label] }), event.type === "state-change" && (_jsxs("div", { style: { color: "var(--text-muted)", fontSize: "0.875rem" }, children: [formatValue(event.oldValue), " \u2192 ", formatValue(event.newValue)] })), event.type === "error" && (_jsx("div", { style: { color: "var(--error)", fontSize: "0.875rem" }, children: event.message }))] }, event.id))) }), selectedEvent && (_jsxs("div", { className: "detail-panel", children: [_jsx("button", { className: "close-btn", onClick: () => setSelectedEvent(null), children: "\u2715" }), _jsx("h2", { style: { marginBottom: "1rem" }, children: "Event Details" }), _jsxs("div", { style: { marginBottom: "1rem" }, children: [_jsx("span", { className: `badge ${selectedEvent.type}`, children: selectedEvent.type }), " ", _jsx("strong", { children: selectedEvent.label })] }), _jsx("pre", { children: JSON.stringify(selectedEvent, null, 2) })] }))] }));
}
//# sourceMappingURL=StoryDetail.js.map