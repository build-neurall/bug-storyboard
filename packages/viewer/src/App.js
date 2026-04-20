import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from "react-router-dom";
import StoryList from "./pages/StoryList";
import StoryDetail from "./pages/StoryDetail";
export default function App() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(StoryList, {}) }), _jsx(Route, { path: "/story/:id", element: _jsx(StoryDetail, {}) })] }));
}
//# sourceMappingURL=App.js.map