import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import BudgetPage from "./components/BudgetPage";
import GNavBar from "./components/GNavBar";

export default function App() {
  return (
    <>
      <GNavBar />
      <Router>
        <Routes>
          <Route path="/" element={<BudgetPage />} />
          <Route path="/:name" element={<BudgetPage />} />
        </Routes>
      </Router>
    </>
  );
}
