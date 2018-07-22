import { MatchError } from "alsatian";

import {
  IFluentCore,
  INarrowableFluentCore,
  PropertiesMatcherWithHelpers
} from "./matchers";
import { AssertionContext, ConfiguredAssert } from "./types";

function Assert<T, TNext>(value?: T, ctxt?: AssertionContext): IFluentCore<T, TNext, void> {
  return new PropertiesMatcherWithHelpers(value, undefined, true, null, ctxt);
}

// human reader: this is all just a way to ensure fail exists statically on Assert ^^^.
// istanbul ignore next
// tslint:disable-next-line
namespace Assert {
  let container: any;

  /**
   * Fails the test with the given message
   * @param message - the message that will be shown in the failure
   */
  export function fail(message: string) {
    throw new MatchError(message);
  }

  /**
   * Configures an Assert factory for spec-aware assertions. For example,
   * it allows the test framework to alert you when you forgot to complete
   * an assertion (i.e., this.assert(something) and forgetting .equals(...)).
   * @param container The specification container instance.
   */
  export function configure(ctxt: AssertionContext): ConfiguredAssert {
    return <T, TNext>(value?: any): IFluentCore<T, TNext, void> => {
      return Assert(value, container);
    };
  }

  /**
   * Validates any assertions within the current context. Intended to be used
   * in conjuction with Assert.configure (in @Setup/@AsyncSetup) inside of a
   * @Teardown or @AsyncTeardown method. If a specification class extends BaseSpec,
   * then configuration and validation will be called automatically.
   */
  export function validateAssertions(ctxt: AssertionContext) {
    
  }
}

export { Assert };
