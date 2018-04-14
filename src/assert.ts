import { Expect, MatchError } from "alsatian";

import {
  IFluentCore,
  INarrowableFluentCore,
  PropertiesMatcher
} from "./matchers";
import { IAssert } from "./assert.i";

function Assert<T, TNext>(value?: T, nextValue?: TNext, invert: boolean = false): IFluentCore<T> {
  return new PropertiesMatcher<T>(value, nextValue, invert);
}
namespace Assert {
  export function fail(message: string) {
    throw new MatchError(message);
  }
}

export { Assert };