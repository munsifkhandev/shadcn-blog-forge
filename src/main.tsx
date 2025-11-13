import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeMockData } from "./lib/mockData";

// Initialize mock data in localStorage
initializeMockData();

createRoot(document.getElementById("root")!).render(<App />);
