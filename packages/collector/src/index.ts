#!/usr/bin/env node
import express from "express";
import cors from "cors";
import * as fs from "fs";
import * as path from "path";
import { BugStory, BugStorySummary } from "@neurall/bug-storyboard-shared";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5777;
const STORIES_DIR = path.resolve(process.cwd(), ".bug-storyboard", "stories");

app.use(cors());
app.use(express.json());

function ensureStoriesDir(): void {
  if (!fs.existsSync(STORIES_DIR)) {
    fs.mkdirSync(STORIES_DIR, { recursive: true });
  }
}

function listStories(): BugStorySummary[] {
  ensureStoriesDir();
  const files = fs.readdirSync(STORIES_DIR).filter((f) => f.endsWith(".json"));
  const summaries: BugStorySummary[] = [];

  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(STORIES_DIR, file), "utf-8");
      const story: BugStory = JSON.parse(content);
      summaries.push({
        id: story.id,
        label: story.label,
        createdAt: story.createdAt,
        eventCount: story.events.length,
      });
    } catch (err) {
      console.error(`[Collector] Failed to read story ${file}:`, err);
    }
  }

  return summaries.sort((a, b) => b.createdAt - a.createdAt);
}

function getStoryById(id: string): BugStory | null {
  ensureStoriesDir();
  const files = fs.readdirSync(STORIES_DIR).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(STORIES_DIR, file), "utf-8");
      const story: BugStory = JSON.parse(content);
      if (story.id === id) {
        return story;
      }
    } catch {
      // Continue to next file
    }
  }

  return null;
}

app.post("/stories", (req, res) => {
  try {
    const story: BugStory = req.body;
    
    if (!story.id || !story.label || !story.createdAt || !Array.isArray(story.events)) {
      return res.status(400).json({ error: "Invalid BugStory format" });
    }

    ensureStoriesDir();
    const filename = `${story.createdAt}-${story.id}.json`;
    fs.writeFileSync(path.join(STORIES_DIR, filename), JSON.stringify(story, null, 2));

    console.log(`[Collector] Saved story: ${story.label} (${story.events.length} events)`);
    res.json({ ok: true, id: story.id });
  } catch (err) {
    console.error("[Collector] Failed to save story:", err);
    res.status(500).json({ error: "Failed to save story" });
  }
});

app.get("/stories", (_req, res) => {
  try {
    const summaries = listStories();
    res.json(summaries);
  } catch (err) {
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
  } catch (err) {
    console.error("[Collector] Failed to get story:", err);
    res.status(500).json({ error: "Failed to get story" });
  }
});

app.listen(PORT, () => {
  console.log(`[Collector] Running on http://localhost:${PORT}`);
  console.log(`[Collector] Stories directory: ${STORIES_DIR}`);
});