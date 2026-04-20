#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const app = (0, express_1.default)();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5777;
const STORIES_DIR = path.resolve(process.cwd(), ".bug-storyboard", "stories");
app.use((0, cors_1.default)());
app.use(express_1.default.json());
function ensureStoriesDir() {
    if (!fs.existsSync(STORIES_DIR)) {
        fs.mkdirSync(STORIES_DIR, { recursive: true });
    }
}
function listStories() {
    ensureStoriesDir();
    const files = fs.readdirSync(STORIES_DIR).filter((f) => f.endsWith(".json"));
    const summaries = [];
    for (const file of files) {
        try {
            const content = fs.readFileSync(path.join(STORIES_DIR, file), "utf-8");
            const story = JSON.parse(content);
            summaries.push({
                id: story.id,
                label: story.label,
                createdAt: story.createdAt,
                eventCount: story.events.length,
            });
        }
        catch (err) {
            console.error(`[Collector] Failed to read story ${file}:`, err);
        }
    }
    return summaries.sort((a, b) => b.createdAt - a.createdAt);
}
function getStoryById(id) {
    ensureStoriesDir();
    const files = fs.readdirSync(STORIES_DIR).filter((f) => f.endsWith(".json"));
    for (const file of files) {
        try {
            const content = fs.readFileSync(path.join(STORIES_DIR, file), "utf-8");
            const story = JSON.parse(content);
            if (story.id === id) {
                return story;
            }
        }
        catch {
            // Continue to next file
        }
    }
    return null;
}
app.post("/stories", (req, res) => {
    try {
        const story = req.body;
        if (!story.id || !story.label || !story.createdAt || !Array.isArray(story.events)) {
            return res.status(400).json({ error: "Invalid BugStory format" });
        }
        ensureStoriesDir();
        const filename = `${story.createdAt}-${story.id}.json`;
        fs.writeFileSync(path.join(STORIES_DIR, filename), JSON.stringify(story, null, 2));
        console.log(`[Collector] Saved story: ${story.label} (${story.events.length} events)`);
        res.json({ ok: true, id: story.id });
    }
    catch (err) {
        console.error("[Collector] Failed to save story:", err);
        res.status(500).json({ error: "Failed to save story" });
    }
});
app.get("/stories", (_req, res) => {
    try {
        const summaries = listStories();
        res.json(summaries);
    }
    catch (err) {
        console.error("[Collector] Failed to list stories:", err);
        res.status(500).json({ error: "Failed to list stories" });
    }
});
app.get("/stories/:id", (req, res) => {
    try {
        const story = getStoryById(req.params.id);
        if (!story) {
            return res.status(404).json({ error: "Story not found" });
        }
        res.json(story);
    }
    catch (err) {
        console.error("[Collector] Failed to get story:", err);
        res.status(500).json({ error: "Failed to get story" });
    }
});
app.listen(PORT, () => {
    console.log(`[Collector] Running on http://localhost:${PORT}`);
    console.log(`[Collector] Stories directory: ${STORIES_DIR}`);
});
//# sourceMappingURL=index.js.map