import {
  Test,
  TestCase,
  Any,
  MatchError
} from "alsatian";
import { Assert } from "../../src/assert";

export class MaybeTests {
  @TestCase(1, false, 2)
  @TestCase(1, true, 1)
  @TestCase("a", true, "a")
  @TestCase("a", false, undefined)
  public Maybe_NegatesWhenFalse(a: any, not: boolean, b: any) {
    Assert(a)
      .maybe(not)
      .equals(b);
  }

  @TestCase(1, true, 2)
  @TestCase(1, false, 1)
  @TestCase("a", false, "a")
  @TestCase("a", true, undefined)
  public Maybe_UnnegatesWhenTrue(a: any, not: boolean, b: any) {
    const lambda = () =>
      Assert(a)
        .maybe(not)
        .equals(b);
    Assert(lambda).throws<MatchError>();
  }
}
