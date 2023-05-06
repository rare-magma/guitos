import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import BudgetPage from "./components/BudgetPage";
import localforage from "localforage";

export const budgetsDB = localforage.createInstance({
  name: "guitos",
  storeName: "budgets",
});

export const optionsDB = localforage.createInstance({
  name: "guitos",
  storeName: "options",
});

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<BudgetPage />} />
          <Route path="/:name" element={<BudgetPage />} />
        </Routes>
      </Router>
    </>
  );
}
