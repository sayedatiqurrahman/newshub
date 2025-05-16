import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./components/ui/theme-provider";
import { initializeLocalStorage } from "./data.ts";

initializeLocalStorage();

createRoot(document.getElementById("root")).render(
  <ThemeProvider defaultTheme="light" storageKey="newshub-theme">
    <App />
  </ThemeProvider>
);
