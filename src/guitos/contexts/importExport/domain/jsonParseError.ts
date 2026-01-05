export class JsonParseError extends Error {
  constructor(message: string) {
    super(`Imported file is not valid json: ${message}`);
  }
}
