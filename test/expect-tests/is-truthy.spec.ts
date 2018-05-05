import { Test, TestCase, Any, MatchError } from "alsatian";
import { Assert } from "../../src/assert";

export class IsTruthyTests {
  @TestCase(false, true)
  @TestCase([], false)
  @TestCase("", true)
  @TestCase(0, true)
  @TestCase(null, true)
  @TestCase(undefined, true)
  @TestCase({ one: 1 }, false)
  @TestCase("asdfa", false)
  @TestCase(1, false)
  @TestCase(true, false)
  public failsOnlyWhenNotTruthy(val: Array<any>, throws: boolean) {
    const lambda = () => Assert(val).isTruthy();
    Assert(lambda)
      .maybe(throws)
      .throws();
  }

  @TestCase([0], false, /should not be truthy/)
  @TestCase(0, true, /should be truthy/)
  public messageAccurate(val: Array<any>, not: boolean, msgPattern: RegExp) {
    const lambda = () =>
      Assert(val)
        .maybe(not)
        .isTruthy();
    Assert(lambda)
      .throws()
      .that.has({ message: msgPattern });
  }

  @Test()
  public providesRightAssertName() {
    const fn = () => Assert(false).isTruthy();
    Assert(fn).throws().that.has({ message: /Assert(.*)\.isTruthy/ })
  }
}
