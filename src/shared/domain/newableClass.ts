// biome-ignore lint/complexity/noBannedTypes: needs function
export interface NewableClass<T> extends Function {
  new (...args: unknown[]): T;
}
