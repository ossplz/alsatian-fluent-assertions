import { Test, TestCase, Any, MatchError } from "alsatian";
import { Assert } from "../../src/assert";

export class HasLastTests {
  @TestCase([1], 1, false)
  @TestCase([], 1, true)
  @TestCase([123, "asdf"], "asdf", false)
  @TestCase([], "fdsa", true)
  @TestCase("a", "a", false)
  @TestCase("asdf", "a", true)
  @TestCase("asdf", "f", false)
  public failsWhenNoFirst(array: Array<any>, expected: any, throws: boolean) {
    const lambda = () =>
      Assert(array)
        .hasLast()
        .that.equals(expected);
    Assert(lambda)
      .maybe(throws)
      .throws();
  }

  @TestCase([], true, /should have one or more elements/)
  @TestCase([1], false, /should not have one or more elements/)
  @TestCase(123, false, /should be an array or string type/)
  public messageAccurate(array: Array<any>, not: boolean, msgPattern: RegExp) {
    const lambda = () =>
      Assert(array)
        .maybe(not)
        .hasLast();
    Assert(lambda)
      .throws()
      .that.has({ message: msgPattern });
  }
}
