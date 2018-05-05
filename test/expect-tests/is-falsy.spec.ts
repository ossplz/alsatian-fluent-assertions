import { Test, TestCase, Any, MatchError } from "alsatian";
import { Assert } from "../../src/assert";

export class IsFalsyTests {
  @TestCase(false, false)
  @TestCase([], true)
  @TestCase("", false)
  @TestCase(0, false)
  @TestCase(null, false)
  @TestCase(undefined, false)
  @TestCase({ one: 1 }, true)
  @TestCase("asdfa", true)
  @TestCase(1, true)
  @TestCase(true, true)
  public failsOnlyWhenNotFalsy(val: Array<any>, throws: boolean) {
    const lambda = () => Assert(val).isFalsy();
    Assert(lambda)
      .maybe(throws)
      .throws();
  }

  @TestCase([1, 2], true, /should be falsy/)
  @TestCase(0, false, /should not be falsy/)
  public messageAccurate(val: Array<any>, not: boolean, msgPattern: RegExp) {
    const lambda = () =>
      Assert(val)
        .maybe(not)
        .isFalsy();
    Assert(lambda)
      .throws()
      .that.has({ message: msgPattern });
  }

  @Test()
  public providesRightAssertName() {
    const fn = () => Assert(true).isFalsy();
    Assert(fn).throws().that.has({ message: /Assert(.*)\.isFalsy/ })
  }
}
