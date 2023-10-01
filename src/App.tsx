import "bootstrap/dist/css/bootstrap.min.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import "./colors.css";
import BudgetPage from "./components/Budget/BudgetPage";
import { BudgetProvider } from "./context/BudgetContext";
import { ConfigProvider } from "./context/ConfigContext";

export default function App() {
  return (
    <ConfigProvider>
      <BudgetProvider>
        <Router>
          <Routes>
            <Route path="/" element={<BudgetPage />} />
            <Route path="/:name" element={<BudgetPage />} />
          </Routes>
        </Router>
      </BudgetProvider>
    </ConfigProvider>
  );
}
