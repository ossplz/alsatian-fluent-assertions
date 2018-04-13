import { Expect } from "alsatian";

import { IFluentCore } from "./matchers";
import { IAssert } from "./assert.i";

export declare type MatcherConstructor = new (actualValue: any, nextValue?: any, invert?: boolean) => IFluentCore<any>;
export declare type MatcherFunction = (actualValue: any, nextValue?: any, invert?: boolean) => IFluentCore<any>;

export function buildAssert<ExpectType extends IAssert>(
  expectFunction: MatcherFunction | MatcherConstructor
): ExpectType {
  const ASSERT = ((actualValue: any) =>
    new (expectFunction as MatcherConstructor)(actualValue)) as ExpectType;
    ASSERT.fail = Expect.fail;
  return ASSERT;
}
