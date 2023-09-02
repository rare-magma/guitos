import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import BudgetPage from "./components/Budget/BudgetPage";

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
