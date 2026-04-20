import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const API_URL = "/stories";
export default function StoryList() {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetch(API_URL)
            .then((res) => res.json())
            .then(setStories)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);
    if (loading)
        return _jsx("div", { className: "container", children: "Loading..." });
    if (error)
        return _jsxs("div", { className: "container", children: ["Error: ", error] });
    return (_jsxs("div", { className: "container", children: [_jsxs("header", { className: "header", children: [_jsx("h1", { children: "Bug Storyboard" }), _jsxs("p", { style: { color: "var(--text-muted)" }, children: [stories.length, " bug ", stories.length === 1 ? "story" : "stories", " captured"] })] }), stories.length === 0 ? (_jsx("p", { style: { color: "var(--text-muted)" }, children: "No bug stories yet. Use the SDK to capture bugs in your app." })) : (_jsx("ul", { className: "story-list", children: stories.map((story) => (_jsx("li", { className: "story-item", children: _jsxs(Link, { to: `/story/${story.id}`, children: [_jsx("div", { style: { fontWeight: 600 }, children: story.label }), _jsxs("div", { className: "story-meta", children: [new Date(story.createdAt).toLocaleString(), " \u00B7 ", story.eventCount, " events"] })] }) }, story.id))) }))] }));
}
//# sourceMappingURL=StoryList.js.map