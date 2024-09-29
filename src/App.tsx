import "bootstrap/dist/css/bootstrap.min.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import "./colors.css";
import { BudgetPage } from "./guitos/sections/Budget/BudgetPage";
import { BudgetProvider } from "./guitos/context/BudgetContext";
import { ConfigProvider } from "./guitos/context/ConfigContext";
import { GeneralProvider } from "./guitos/context/GeneralContext";

export function App() {
  return (
    <GeneralProvider>
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
    </GeneralProvider>
  );
}
