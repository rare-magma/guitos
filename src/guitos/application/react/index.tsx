import { registerSW } from "virtual:pwa-register";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { registerHandlers } from "@guitos/application/react/registerHandlers";
import { App } from "./App";

const updateSW = registerSW({
  onNeedRefresh() {
    updateSW(true);
  },
});

const rootElement = document.getElementById("root");
const root = rootElement && ReactDOM.createRoot(rootElement);
registerHandlers();

root?.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
