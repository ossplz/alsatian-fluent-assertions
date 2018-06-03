import { MatchError } from "alsatian";

import {
  IFluentCore,
  INarrowableFluentCore,
  PropertiesMatcherWithHelpers
} from "./matchers";
import { IAssert } from "./assert.i";

function Assert<T, TNext>(value?: T): IFluentCore<T, TNext, void> {
  return new PropertiesMatcherWithHelpers<T, TNext, void>(value, undefined, true);
}

// human: lol, this is to ensure fail exists statically on Assert ^^^.
// istanbul ignore next
// tslint:disable-next-line
namespace Assert {
  export function fail(message: string) {
    throw new MatchError(message);
  }
}

export { Assert };
