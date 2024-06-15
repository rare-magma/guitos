import { registerSW } from "virtual:pwa-register";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const updateSW = registerSW({
  onNeedRefresh() {
    // biome-ignore lint/style/noRestrictedGlobals: <explanation>
    if (confirm("A new version of guitos is available. Update?")) {
      updateSW(true);
    }
  },
});

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
