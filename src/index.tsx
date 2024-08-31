import { registerSW } from "virtual:pwa-register";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("A new version of guitos is available. Update?")) {
      updateSW(true);
    }
  },
});

if (window.location.pathname === "/") {
  const lastOpenedBudget = localStorage.getItem("guitos_lastOpenedBudget");
  if (lastOpenedBudget) {
    window.location.pathname = `/${lastOpenedBudget}`;
  }
}

const rootElement = document.getElementById("root");
const root = rootElement && ReactDOM.createRoot(rootElement);

root?.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
