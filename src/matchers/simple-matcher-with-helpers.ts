import { SimpleMatcher } from "./simple-matcher";
import { ISimpleMatcher } from "./i-simple-matcher";
import { IFluentCore } from "./i-fluent-core";
import { EqType } from "../types";

export class SimpleMatcherWithHelpers<T>
  extends SimpleMatcher<T>
  implements ISimpleMatcher<T> {

  constructor(
    actualValue: any,
    nextValue: any,
    initial: boolean
  ) {
    super(actualValue, nextValue, initial);
  }

  /** @inheritDoc */
  public equals(
    expected: T,
    eqType: EqType = EqType.strictly
  ): IFluentCore<T> {
    this.setCurrentNode(this.equals.name, typeof (expected) + ", " + eqType);
    switch (eqType) {
      case EqType.strictly:
        return this.strictlyEquals(expected);
      case EqType.loosely:
        return this.looselyEquals(expected);
      case EqType.deepLoosely:
        return this.deepLooselyEquals(expected);
      case EqType.deepStrictly:
        return this.deepStrictlyEquals(expected);
      default:
        this.specError(`Unrecognized EqType: ${eqType}.`, undefined, undefined);
    }
  }
}