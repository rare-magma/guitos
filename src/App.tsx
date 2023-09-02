import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import BudgetPage from "./components/Budget/BudgetPage";
import { ConfigProvider } from "./context/ConfigContext";

export default function App() {
  return (
    <ConfigProvider>
      <Router>
        <Routes>
          <Route path="/" element={<BudgetPage />} />
          <Route path="/:name" element={<BudgetPage />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}
