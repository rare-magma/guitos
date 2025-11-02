import { useBusesContext } from "@guitos/context/BusesContext";
import type { DomainEvent } from "@shared/domain/eventBus/domainEvent";
import type { DomainEventSubscriber } from "@shared/domain/eventBus/domainEventSubscriber";
import { useEffect, useState } from "react";

export function useReactToEvents<T extends DomainEvent>(
  eventNames: string[],
): T | undefined {
  const { eventBus } = useBusesContext();
  const [event, setEvent] = useState<T>();

  useEffect(() => {
    const subscriber: DomainEventSubscriber<T> = {
      name: () => eventNames[0],
      subscribedTo: () => eventNames.map((name) => ({ eventName: name })),
      on: (event: T) => {
        setEvent(event);
        return Promise.resolve();
      },
    };

    eventBus.subscribe(subscriber);

    return () => {
      eventBus.unsubscribe(subscriber);
    };
  }, [eventBus, eventNames]);

  return event;
}
