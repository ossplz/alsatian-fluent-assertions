import { IOperators } from "./i-operators";
import { FluentMatcherBase } from "./fluent-matcher-base";
import { IFluentCore } from "./i-fluent-core";
import { INarrowableFluentCore, PropertiesMatcher } from ".";
import { INarrowableOperators } from "./i-narrowable-operators";
import { FluentNode } from "../types/fluent-node";

export class Operators<T, TNext>
  extends FluentMatcherBase
  implements IOperators<T, TNext>, INarrowableOperators<TNext>
   {
  constructor(
    protected actualValue: T,
    protected nextValue: TNext,
    protected invert: boolean
  ) {
    super(actualValue, null, invert);
  }

  /** @inheritDoc */
  public get not(): IFluentCore<T> {
    this.currentNode = new FluentNode("not", null, this.lastNode);
    this.setFluentState(this.actualValue, this.nextValue, !this.invert);
    return <any>this;
  }

  /** @inheritDoc */
  public maybe(yayNay: boolean): IFluentCore<T> {
    this.currentNode = new FluentNode(this.maybe.name, `${yayNay}`, this.lastNode);
    this.setFluentState(this.actualValue, this.nextValue, !yayNay);
    return <any>this;
  }

  /** @inheritDoc */
  public get lastContextualValue(): TNext {
    return this.nextValue;
  }

  /** @inheritDoc */
  public get that(): IFluentCore<TNext> {
    this.currentNode = new FluentNode("that", null, this.lastNode);
    this.setFluentState(this.nextValue, null, false);
    return <any>this;
  }
}