import { IOperators } from "./i-operators";
import { FluentMatcherBase } from "./fluent-matcher-base";
import { IFluentCore } from "./i-fluent-core";
import { INarrowableFluentCore, PropertiesMatcher } from ".";
import { INarrowableOperators } from "./i-narrowable-operators";

export class Operators<T, TNext, TPrev> extends FluentMatcherBase
  implements IOperators<T, TNext, TPrev>, INarrowableOperators<TNext, T, TPrev> {
  constructor(actualValue: T, nextValue: TNext, initial: boolean = false, prevCore: IFluentCore<TPrev, T, void> = null) {
    super(actualValue, null, initial, prevCore);
  }

  public get not(): IFluentCore<T, TNext, TPrev> {
    this.setCurrentNode("not", null);
    return this.generateFluentState(
      this.actualValue,
      this.nextValue,
      !this.invert,
      this.hasNext
    );
  }

  public maybe(verbatim: boolean): IFluentCore<T, TNext, TPrev> {
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

  public get kThx(): IFluentCore<TPrev, T, void> {
    return this.prevCore;
  }

  public get that(): IFluentCore<TNext, void, T> {
    this.setCurrentNode("that", null);
    if (!this.hasNext) {
      throw new Error("Fluent scope cannot narrow when narrowable value not defined by previous assertions.");
    }

    return this.generateFluentState<TNext, void, T>(this.nextValue, null, false, false, <any>this.parent);
  }

  public forReason(reason: string, data?: any): IFluentCore<T, TNext, TPrev> {
    return this.generateFluentState(
      this.actualValue,
      this.nextValue,
      this.invert,
      this.hasNext,
      null,
      reason,
      data
    );
  }
}
