import type { CommandBus } from "@shared/domain/commandBus/commandBus";
import type { EventBus } from "@shared/domain/eventBus/eventBus";
import type { QueryBus } from "@shared/domain/queryBus/queryBus";
import type { PropsWithChildren } from "react";
import { createContext, useContext, useMemo } from "react";

interface BusesContextInterface {
  commandBus: CommandBus;
  eventBus: EventBus;
  queryBus: QueryBus;
}

interface BusesProviderProps extends PropsWithChildren {
  commandBus: CommandBus;
  eventBus: EventBus;
  queryBus: QueryBus;
}

const BusesContext = createContext<BusesContextInterface | null>(null);

export function useBusesContext() {
  const context = useContext(BusesContext);
  if (!context) {
    throw new Error("useBusesContext must be used within a BusesProvider");
  }
  return context;
}

export function BusesProvider({
  children,
  commandBus,
  eventBus,
  queryBus,
}: BusesProviderProps) {
  const value = useMemo(
    () => ({ commandBus, eventBus, queryBus }),
    [commandBus, eventBus, queryBus],
  );

  return (
    <BusesContext.Provider value={value}>{children}</BusesContext.Provider>
  );
}
