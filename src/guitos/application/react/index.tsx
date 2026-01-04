import { registerSW } from "virtual:pwa-register";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { registerHandlersSubscribers } from "@guitos/application/react/registerHandlersSubscribers";
import { App } from "./App";

const updateSW = registerSW({
  onNeedRefresh() {
    updateSW(true);
  },
});

const rootElement = document.getElementById("root");
const root = rootElement && ReactDOM.createRoot(rootElement);
registerHandlersSubscribers();

root?.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
