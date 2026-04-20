import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { BugStorySummary } from "@neurall/bug-storyboard-shared";

const API_URL = "/stories";

export default function StoryList() {
  const [stories, setStories] = useState<BugStorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(setStories)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container">Error: {error}</div>;

  return (
    <div className="container">
      <header className="header">
        <h1>Bug Storyboard</h1>
        <p style={{ color: "var(--text-muted)" }}>
          {stories.length} bug {stories.length === 1 ? "story" : "stories"} captured
        </p>
      </header>

      {stories.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>
          No bug stories yet. Use the SDK to capture bugs in your app.
        </p>
      ) : (
        <ul className="story-list">
          {stories.map((story) => (
            <li key={story.id} className="story-item">
              <Link to={`/story/${story.id}`}>
                <div style={{ fontWeight: 600 }}>{story.label}</div>
                <div className="story-meta">
                  {new Date(story.createdAt).toLocaleString()} · {story.eventCount} events
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}