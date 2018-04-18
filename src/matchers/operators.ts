import { IOperators } from "./i-operators";
import { FluentMatcherBase } from "./fluent-matcher-base";
import { IFluentCore } from "./i-fluent-core";
import { INarrowableFluentCore, PropertiesMatcher } from ".";
import { INarrowableOperators } from "./i-narrowable-operators";

export class Operators<T, TNext>
  extends FluentMatcherBase
  implements IOperators<T, TNext>, INarrowableOperators<TNext>
   {
  constructor(
    actualValue: T,
    nextValue: TNext,
    initial: boolean = false
  ) {
    super(actualValue, null, initial);
  }

  /** @inheritDoc */
  public get not(): IFluentCore<T> {
    this.setCurrentNode("not", null);
    return this.setFluentState(this.actualValue, this.nextValue, !this.invert);
  }

  /** @inheritDoc */
  public maybe(yayNay: boolean): IFluentCore<T> {
    this.setCurrentNode(this.maybe.name, `${yayNay}`);
    return this.setFluentState(this.actualValue, this.nextValue, !yayNay);
  }

  /** @inheritDoc */
  public get lastContextualValue(): TNext {
    return this.nextValue;
  }

  /** @inheritDoc */
  public get that(): IFluentCore<TNext> {
    this.setCurrentNode("that", null);
    return this.setFluentState(this.nextValue, null, false);
  }
}