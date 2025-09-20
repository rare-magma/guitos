export interface EventBusConsumer {
  start(): Promise<void>;
}
