import {
    Test,
    TestCase,
    Any,
    MatchError
  } from "alsatian";
  import { Assert } from "../../src/assert";

  export class HasNthTests {
      @TestCase([1], 0, 1, false)
      @TestCase([], 0, 1, true)
      @TestCase([123, "asdf", "abc"], 1, "asdf", false)
      @TestCase([], 0, "fdsa", true)
      @TestCase("a", 0, "a", false)
      @TestCase("asdf", 0, "a", false)
      @TestCase("asdf", 2, "d", false)
      @TestCase("asdf", 3, "f", false)
      @TestCase("asdf", 4, "", true)
      public failsWhenNoNth(array: any[], n: number, expected: any, throws: boolean) {
          const lambda = () => Assert(array).hasNth(n).that.equals(expected);
          Assert(lambda).maybe(throws).throws();
      }

      @TestCase([], 0, true, /should have 1 or more elements/)
      @TestCase([], 2, true, /should have 3 or more elements/)
      @TestCase([1], 0, false, /should not have 1 or more elements/)
      @TestCase(123, 0, false, /should be an array or string type/)
      public messageAccurate(array: any[], n: number, not: boolean, msgPattern: RegExp) {
        const lambda = () => Assert(array).maybe(not).hasNth(n);
        Assert(lambda).throws()
            .that.has({ message: msgPattern });
      }

      @Test()
      public throwsIfNonNumber() {
        const lambda = () => Assert([1,2,3]).hasNth(<any>"1");
        Assert(lambda).throws()
            .that.has({ message: /parameter should be a number/ });
      }
  }