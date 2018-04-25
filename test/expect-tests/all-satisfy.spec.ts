import {
    Test,
    TestCase,
    Any,
    MatchError
  } from "alsatian";
  import { Assert } from "../../src/assert";
import { SpecError } from "../../src/errors";

  export class AllSatisfyTests {
      @TestCase([1,2,3], (e: number) => e < 5, false)
      @TestCase([1,2,3,6], (e: number) => e < 5, true)
      public allSatisfy_passesIffAll(array: any[], predicate: (a: any) => boolean, throws: boolean) {
        const expect = Assert(array);

        Assert(() => expect.allSatisfy(predicate))
          .maybe(throws).throws(SpecError);
      }
  }