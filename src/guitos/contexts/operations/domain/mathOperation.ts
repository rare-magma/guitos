import type { Primitives } from "@shared/domain/primitives";

export class MathOperation {
  readonly name: string;
  static Add = new MathOperation("add");
  static Subtract = new MathOperation("subtract");
  static Multiply = new MathOperation("multiply");
  static Divide = new MathOperation("divide");

  constructor(name: string) {
    this.name = name;
  }

  toPrimitives(): Primitives<MathOperation> {
    return {
      name: this.name,
    };
  }
}
