import { Expect, MatchError } from "alsatian";

import {
  IFluentCore,
  INarrowableFluentCore,
  PropertiesMatcher
} from "./matchers";
import { IAssert } from "./assert.i";

function Assert<T, TNext>(value?: T): IFluentCore<T> {
  return new PropertiesMatcher<T>(value, undefined, true);
}
/* istanbul ignore next */
namespace Assert {
  export function fail(message: string) {
    throw new MatchError(message);
  }
}

export { Assert };