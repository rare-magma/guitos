import { registerSW } from "virtual:pwa-register";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";

const updateSW = registerSW({
  onNeedRefresh() {
    // biome-ignore lint/style/noRestrictedGlobals: <explanation>
    if (confirm("A new version of guitos is available. Update?")) {
      updateSW(true);
    }
  },
});
const rootElement = document.getElementById("root");
const root = rootElement && ReactDOM.createRoot(rootElement);

root?.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
