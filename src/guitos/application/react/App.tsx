import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Router } from "wouter";
import "./App.css";
import "./colors.css";
import { BudgetProvider } from "@guitos/application/react/context/BudgetContext";
import { ConfigProvider } from "@guitos/application/react/context/ConfigContext";
import { ErrorProvider } from "@guitos/application/react/context/ErrorContext";
import { LoadingProvider } from "@guitos/application/react/context/LoadingContext";
import { NotificationProvider } from "@guitos/application/react/context/NotificationContext";
import { BudgetPage } from "@guitos/sections/Budget/BudgetPage";

export function App() {
  return (
    <ErrorProvider>
      <LoadingProvider>
        <NotificationProvider>
          <ConfigProvider>
            <BudgetProvider>
              <Router>
                <Route path="/" component={BudgetPage} />
                <Route path="/:name" component={BudgetPage} />
              </Router>
            </BudgetProvider>
          </ConfigProvider>
        </NotificationProvider>
      </LoadingProvider>
    </ErrorProvider>
  );
}
