import { Test, TestCase, Any, MatchError } from "alsatian";
import { Assert } from "../../src/assert";

export class IsEmptyTests {
  @TestCase([0], true)
  @TestCase([], false)
  @TestCase("asdf", true)
  @TestCase("", false)
  @TestCase({}, false)
  @TestCase({ one: 1 }, true)
  public failsOnlyWhenNotEmpty(array: Array<any>, throws: boolean) {
    const lambda = () => Assert(array).isEmpty();
    Assert(lambda)
      .maybe(throws)
      .throws();
  }

  @TestCase([1, 2], true, /should be empty/)
  @TestCase(123, false, /Expected type is not an array, string, or object./)
  public messageAccurate(array: Array<any>, not: boolean, msgPattern: RegExp) {
    const lambda = () =>
      Assert(array)
        .maybe(not)
        .isEmpty();
    Assert(lambda)
      .throws()
      .that.has({ message: msgPattern });
  }
}
