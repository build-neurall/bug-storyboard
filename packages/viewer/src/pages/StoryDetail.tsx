import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { BugStory, EventRecord } from "@neurall/bug-storyboard-shared";

const API_URL = "/stories";

function formatOffset(timestamp: number, lastTimestamp: number): string {
  const diff = lastTimestamp - timestamp;
  if (diff < 1000) return `T-${diff}ms`;
  if (diff < 60000) return `T-${Math.round(diff / 1000)}s`;
  return `T-${Math.round(diff / 60000)}m`;
}

function formatValue(value: unknown): string {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export default function StoryDetail() {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<BugStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Story not found");
        return res.json();
      })
      .then(setStory)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container">Error: {error}</div>;
  if (!story) return <div className="container">Story not found</div>;

  const lastTimestamp = story.events[story.events.length - 1]?.timestamp ?? Date.now();
  const sortedEvents = [...story.events].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="container" style={{ paddingRight: selectedEvent ? 432 : undefined }}>
      <Link to="/" className="back-link">
        ← Back to stories
      </Link>

      <header className="header">
        <h1>{story.label}</h1>
        <p style={{ color: "var(--text-muted)" }}>
          {new Date(story.createdAt).toLocaleString()} · {story.events.length} events
          {story.appId && ` · ${story.appId}`}
        </p>
      </header>

      <div className="timeline">
        {sortedEvents.map((event) => (
          <div
            key={event.id}
            className={`timeline-item ${event.type}`}
            onClick={() => setSelectedEvent(event)}
          >
            <div className="time-offset">{formatOffset(event.timestamp, lastTimestamp)}</div>
            <div className="event-label">
              <span className={`badge ${event.type}`}>{event.type}</span>{" "}
              {event.label}
            </div>
            {event.type === "state-change" && (
              <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                {formatValue(event.oldValue)} → {formatValue(event.newValue)}
              </div>
            )}
            {event.type === "error" && (
              <div style={{ color: "var(--error)", fontSize: "0.875rem" }}>
                {event.message}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedEvent && (
        <div className="detail-panel">
          <button className="close-btn" onClick={() => setSelectedEvent(null)}>
            ✕
          </button>
          <h2 style={{ marginBottom: "1rem" }}>Event Details</h2>
          <div style={{ marginBottom: "1rem" }}>
            <span className={`badge ${selectedEvent.type}`}>{selectedEvent.type}</span>{" "}
            <strong>{selectedEvent.label}</strong>
          </div>
          <pre>{JSON.stringify(selectedEvent, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}