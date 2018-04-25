import {
    Test,
    TestCase,
    Any,
    MatchError
  } from "alsatian";
  import { Assert } from "../../src/assert";
import { SpecError } from "../../src/errors";

  export class AnySatisfyTests {
      @TestCase([1,2,3], (e: number) => e < 5, false)
      @TestCase([1,2,3,6], (e: number) => e < 5, false)
      @TestCase([5,6,7,8], (e: number) => e < 5, true)
      public anySatisfy_passesIffAny(array: any[], predicate: (a: any) => boolean, throws: boolean) {
        const expect = Assert(array);

        Assert(() => expect.anySatisfy(predicate))
          .maybe(throws).throws(SpecError);
      }

      @TestCase(123)
      @TestCase(false)
      @TestCase(undefined)
      @TestCase(null)
      @TestCase({})
      @TestCase("asdf")
      public anySatisfy_notArrayType_throws(input: any) {
        const expect = Assert(input);
        Assert(() => expect.anySatisfy(() => true))
            .throws(SpecError)
            .that.has({ message: /should be an array type/});
      }

      @TestCase(123)
      @TestCase(false)
      @TestCase(undefined)
      @TestCase(null)
      @TestCase({})
      @TestCase("asdf")
      public anySatisfy__throws(input: any) {
        const expect = Assert([]);
        Assert(() => expect.anySatisfy(input))
            .throws(SpecError)
            .that.has({ message: /expectation should be a function/});
      }
  }