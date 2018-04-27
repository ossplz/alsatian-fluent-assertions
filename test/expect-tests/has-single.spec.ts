import { Test, TestCase, Any, MatchError } from "alsatian";
import { Assert } from "../../src/assert";

export class HasSingleTests {
  @TestCase([1], 1, false)
  @TestCase([1, 2], 1, true)
  @TestCase(["asdf"], "asdf", false)
  @TestCase(["asdf"], "fdsa", true)
  @TestCase("a", "a", false)
  @TestCase("asdf", "a", true)
  @TestCase("asdf", "f", true)
  public failsWhenNotSingle(array: Array<any>, expected: any, throws: boolean) {
    const lambda = () =>
      Assert(array)
        .hasSingle()
        .that.equals(expected);
    Assert(lambda)
      .maybe(throws)
      .throws();
  }

  @TestCase([1, 2], true, /should have single element/)
  @TestCase([1], false, /should not have single element/)
  @TestCase(123, false, /Expected type is not an array./)
  public messageAccurate(array: Array<any>, not: boolean, msgPattern: RegExp) {
    const lambda = () =>
      Assert(array)
        .maybe(not)
        .hasSingle();
    Assert(lambda)
      .throws()
      .that.has({ message: msgPattern });
  }
}
