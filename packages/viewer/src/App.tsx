import { Routes, Route } from "react-router-dom";
import StoryList from "./pages/StoryList";
import StoryDetail from "./pages/StoryDetail";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StoryList />} />
      <Route path="/story/:id" element={<StoryDetail />} />
    </Routes>
  );
}