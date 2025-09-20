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
import { ChangeUserPreferencesCommandHandler } from "@guitos/userPreferences/application/changePreferences/changeUserPreferencesCommandHandler";
import { UserPreferencesChanger } from "@guitos/userPreferences/application/changePreferences/userPreferencesChanger";
import { UserPreferencesQueryHandler } from "@guitos/userPreferences/application/changePreferences/userPreferencesQueryHandler";
import { UserPreferencesChangedDomainEventSubscriber } from "@guitos/userPreferences/domain/userPreferencesChangedDomainEventSubscriber";
import { localForageUserPreferencesRepository } from "@guitos/userPreferences/infrastructure/localForageUserPreferencesRepository";
import { CommandHandlersInformation } from "@shared/infrastructure/commandBus/commandHandlersInformation";
import { InMemoryCommandBus } from "@shared/infrastructure/commandBus/inMemoryCommandBus";
import { CurrentTimeClock } from "@shared/infrastructure/currentTimeClock";
import { InMemoryAsyncEventBus } from "@shared/infrastructure/eventBus/inMemoryAsyncEventBus";
import { InMemoryQueryBus } from "@shared/infrastructure/queryBus/inMemoryQueryBus";
import { QueryHandlersInformation } from "@shared/infrastructure/queryBus/queryHandlersInformation";

const commandBus = new InMemoryCommandBus();
const eventBus = new InMemoryAsyncEventBus();
const queryBus = new InMemoryQueryBus();

export function App() {
  const changeUserPreferencesCommandHandler =
    new ChangeUserPreferencesCommandHandler(
      new UserPreferencesChanger(
        new CurrentTimeClock(),
        new localForageUserPreferencesRepository(),
        eventBus,
      ),
    );
  const userPreferencesChangedSubscriber =
    new UserPreferencesChangedDomainEventSubscriber();
  const userPreferencesQueryHandler = new UserPreferencesQueryHandler();
  commandBus.registerHandlers(
    new CommandHandlersInformation([changeUserPreferencesCommandHandler]),
  );
  eventBus.registerSubscribers([userPreferencesChangedSubscriber]);
  queryBus.registerHandlers(
    new QueryHandlersInformation([userPreferencesQueryHandler]),
  );

  return (
    <BusesProvider
      commandBus={commandBus}
      eventBus={eventBus}
      queryBus={queryBus}
    >
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
    </BusesProvider>
  );
}
