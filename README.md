# Bug Storyboard

Frontend debugging tool that records a timeline of state changes, user actions, and errors before a bug occurs.

## Quick Start

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start collector (port 5777)
pnpm dev:collector

# Start viewer (port 3000)
pnpm dev:viewer
```

## Packages

- **`@neurall/bug-storyboard-sdk`** - React SDK for tracking events
- **`@neurall/bug-storyboard-collector`** - Node server for storing Bug Stories
- **`@neurall/bug-storyboard-viewer`** - React app for viewing Bug Stories

## Usage in React App

```tsx
import {
  initBugStoryboard,
  useTrackedState,
  trackAction,
  captureBug,
} from "@neurall/bug-storyboard-sdk";

initBugStoryboard({
  appId: "my-app",
  collectorUrl: "http://localhost:5777",
});

function Cart() {
  const [items, setItems] = useTrackedState("cart.items", []);

  return (
    <div>
      <button
        onClick={() => {
          trackAction("cart.add", { item: "test" });
          setItems([...items, "test"]);
        }}
      >
        Add Item
      </button>
      <button onClick={() => captureBug("weird-bug")}>
        Capture Bug
      </button>
    </div>
  );
}
```

## License

MIT