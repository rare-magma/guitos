import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Router } from "wouter";
import "./App.css";
import "./colors.css";
import { BudgetProvider } from "@guitos/context/BudgetContext";
import { BusesProvider } from "@guitos/context/BusesContext";
import { ConfigProvider } from "@guitos/context/ConfigContext";
import { ErrorProvider } from "@guitos/context/ErrorContext";
import { LoadingProvider } from "@guitos/context/LoadingContext";
import { NotificationProvider } from "@guitos/context/NotificationContext";
import { BudgetPage } from "@guitos/sections/Budget/BudgetPage";
import { InMemoryCommandBus } from "@shared/infrastructure/commandBus/inMemoryCommandBus";
import { InMemorySyncEventBus } from "@shared/infrastructure/eventBus/inMemorySyncEventBus";
import { InMemoryQueryBus } from "@shared/infrastructure/queryBus/inMemoryQueryBus";
import { Layout } from "./Layout";

export function App() {
  const commandBus = new InMemoryCommandBus();
  const eventBus = new InMemorySyncEventBus();
  const queryBus = new InMemoryQueryBus();

  return (
    <BusesProvider
      commandBus={commandBus}
      eventBus={eventBus}
      queryBus={queryBus}
    >
      <Layout>
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
      </Layout>
    </BusesProvider>
  );
}
