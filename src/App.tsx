import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import BudgetPage from "./components/BudgetPage";
import localforage from "localforage";

export default function App() {
  localforage.config({
    name: "guitos",
    storeName: "budgets",
  });

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
