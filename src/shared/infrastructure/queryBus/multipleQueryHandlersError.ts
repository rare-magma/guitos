export class MultipleQueryHandlersError extends Error {
  constructor(queryName: string) {
    super(
      `Multiple handlers registered for query ${queryName}. Each query can only have one handler.`,
    );
  }
}
