import { MatchError } from "alsatian";

import {
  IFluentCore,
  INarrowableFluentCore,
  PropertiesMatcherWithHelpers
} from "./matchers";
import { IAssert } from "./assert.i";

function Assert<T, TNext>(value?: T): IFluentCore<T> {
  return new PropertiesMatcherWithHelpers<T>(value, undefined, true);
}
/* istanbul ignore next */
namespace Assert {
  export function fail(message: string) {
    throw new MatchError(message);
  }
}

export { Assert };