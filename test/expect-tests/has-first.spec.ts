import {
    Test,
    TestCase,
    Any,
    MatchError
  } from "alsatian";
  import { Assert } from "../../src/assert";

  export class HasFirstTests {
      @TestCase([1], 1, false)
      @TestCase([], 1, true)
      @TestCase(["asdf"], "asdf", false)
      @TestCase([], "fdsa", true)
      @TestCase("a", "a", false)
      @TestCase("asdf", "a", false)
      @TestCase("asdf", "f", true)
      public failsWhenNoFirst(array: any[], expected: any, throws: boolean) {
          const lambda = () => Assert(array).hasFirst().that.equals(expected);
          Assert(lambda).maybe(throws).throws();
      }

      @TestCase([], true, /should have one or more elements/)
      @TestCase([1], false, /should not have one or more elements/)
      @TestCase(123, false, /should be an array or string type/)
      public messageAccurate(array: any[], not: boolean, msgPattern: RegExp) {
        const lambda = () => Assert(array).maybe(not).hasFirst();
        Assert(lambda).throws()
            .that.has({ message: msgPattern });
      }
  }