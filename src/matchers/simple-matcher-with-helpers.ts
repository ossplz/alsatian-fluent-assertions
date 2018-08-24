import { SimpleMatcher } from "./simple-matcher";
import { IFluentCore } from "./i-fluent-core";
import { EqType, AssertionContext } from "../types";
import { ISimpleMatcherWithHelpers } from "./i-simple-matcher-with-helpers";

export class SimpleMatcherWithHelpers<T, TNext, TPrev> extends SimpleMatcher<T, TNext, TPrev>
  implements ISimpleMatcherWithHelpers<T, TNext, TPrev> {
    constructor(actualValue: any,
      nextValue: any,
      initial: boolean,
      prevCore?: IFluentCore<any, any, any>,
      ctxt?: AssertionContext
    ) {
      super(actualValue, nextValue, initial, prevCore, ctxt);
    }
  

  public equals(expected: T, eqType: EqType = EqType.strictly): IFluentCore<T, TNext, TPrev> {
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
