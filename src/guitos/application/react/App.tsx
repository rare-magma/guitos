import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Router } from "wouter";
import "./App.css";
import "./colors.css";
import { BudgetProvider } from "@guitos/application/react/context/BudgetContext";
import { ConfigProvider } from "@guitos/application/react/context/ConfigContext";
import { ErrorProvider } from "@guitos/application/react/context/ErrorContext";
import { LoadingProvider } from "@guitos/application/react/context/LoadingContext";
import { NotificationProvider } from "@guitos/application/react/context/NotificationContext";
import { BudgetPage } from "@guitos/application/react/sections/Budget/BudgetPage";
import { LastOpenedBudgetQuery } from "@guitos/contexts/budget/application/findLastOpenedBudget/lastOpenedBudgetQuery";
import type { LastOpenedBudgetResponse } from "@guitos/contexts/budget/application/findLastOpenedBudget/lastOpenedBudgetResponse";
import { queryBus } from "@shared/infrastructure/buses";
import { useEffect } from "react";

export function App() {
  useEffect(() => {
    async function getLastOpenedBudget() {
      if (window.location.pathname === "/") {
        const { name: lastOpenedBudget } =
          await queryBus.ask<LastOpenedBudgetResponse>(
            new LastOpenedBudgetQuery(),
          );
        if (lastOpenedBudget) {
          window.location.pathname = `/${lastOpenedBudget}`;
        }
      }
    }
    getLastOpenedBudget();
  }, []);

  return (
    <ErrorProvider>
      <LoadingProvider>
        <NotificationProvider>
          <ConfigProvider queryBus={queryBus}>
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
