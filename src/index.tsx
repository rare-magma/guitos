import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("A new version of guitos is available. Update?")) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      updateSW(true);
    }
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
