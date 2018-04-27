import { SimpleMatcher } from "./simple-matcher";
import { IFluentCore } from "./i-fluent-core";
import { EqType } from "../types";
import { ISimpleMatcherWithHelpers } from "./i-simple-matcher-with-helpers";

export class SimpleMatcherWithHelpers<T> extends SimpleMatcher<T>
  implements ISimpleMatcherWithHelpers<T> {
  constructor(actualValue: any, nextValue: any, initial: boolean) {
    super(actualValue, nextValue, initial);
  }

  public equals(expected: T, eqType: EqType = EqType.strictly): IFluentCore<T> {
    this.setCurrentNode(this.equals.name, typeof expected + ", " + eqType);
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
