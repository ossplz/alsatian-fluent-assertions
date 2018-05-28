import { IOperators } from "./i-operators";
import { FluentMatcherBase } from "./fluent-matcher-base";
import { IFluentCore } from "./i-fluent-core";
import { INarrowableFluentCore, PropertiesMatcher } from ".";
import { INarrowableOperators } from "./i-narrowable-operators";

export class Operators<T, TNext> extends FluentMatcherBase
  implements IOperators<T, TNext>, INarrowableOperators<TNext> {
  constructor(actualValue: T, nextValue: TNext, initial: boolean = false) {
    super(actualValue, null, initial);
  }

  public get not(): IFluentCore<T> {
    this.setCurrentNode("not", null);
    return this.generateFluentState(
      this.actualValue,
      this.nextValue,
      !this.invert,
      this.hasNext
    );
  }

  public maybe(verbatim: boolean): IFluentCore<T> {
    this.setCurrentNode(this.maybe.name, `${verbatim}`);
    // invert = !verbatim
    return this.generateFluentState(
      this.actualValue,
      this.nextValue,
      this.invert === verbatim,
      this.hasNext
    );
    /**
     * invert | verbatim | result (invert)
     * false  | false    | true
     * false  | true     | false
     * true   | false    | false
     * true   | true     | true
     */
  }

  public get lastContextualValue(): T {
    return this.actualValue;
  }

  public get that(): IFluentCore<TNext> {
    this.setCurrentNode("that", null);
    if (!this.hasNext) {
      throw new Error("Fluent scope cannot narrow when narrowable value not defined by previous assertions.");
    }

    return this.generateFluentState(this.nextValue, null, false);
  }
}
