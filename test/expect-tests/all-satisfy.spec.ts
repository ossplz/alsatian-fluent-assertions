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

      @TestCase(123)
      @TestCase(false)
      @TestCase(undefined)
      @TestCase(null)
      @TestCase({})
      @TestCase("asdf")
      public allSatisfy_notArrayType_throws(input: any) {
        const expect = Assert(input);
        Assert(() => expect.allSatisfy(() => true))
            .throws(SpecError)
            .that.has({ message: /should be an array type/});
      }

      @TestCase(123)
      @TestCase(false)
      @TestCase(undefined)
      @TestCase(null)
      @TestCase({})
      @TestCase("asdf")
      public allSatisfy__throws(input: any) {
        const expect = Assert([]);
        Assert(() => expect.allSatisfy(input))
            .throws(SpecError)
            .that.has({ message: /expectation should be a function/});
      }
  }