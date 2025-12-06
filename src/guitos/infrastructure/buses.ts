import { InMemoryCommandBus } from "@shared/infrastructure/commandBus/inMemoryCommandBus";
import { InMemorySyncEventBus } from "@shared/infrastructure/eventBus/inMemorySyncEventBus";
import { InMemoryQueryBus } from "@shared/infrastructure/queryBus/inMemoryQueryBus";

export const commandBus = new InMemoryCommandBus();
export const eventBus = new InMemorySyncEventBus();
export const queryBus = new InMemoryQueryBus();
