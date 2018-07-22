import { Test, TestCase, Any, MatchError } from "alsatian";
import { Assert } from "../../src/assert";
import { FluentMatcherBase } from "../../src/matchers";

export class ForReasonTests {
  @Test()
  public forReason_shouldAddReasonAndReturnContext() {
    const reason = "whatever, man.";
    const bonus = { bonus: "info" };
    const result = Assert(1).forReason(reason, bonus);
    Assert(result)
        .not.isNull()
        .is(FluentMatcherBase)
        .has(a => a["reason"]).that.equals(reason).kThx
        .has(a => a["reasonData"]).that.equals(bonus);
  }

  @Test()
  public forReason_canOmitSecondParam() {
    const reason = "whatever, man.";
    const result = Assert(1).forReason(reason);
    Assert(result)
        .not.isNull()
        .is(FluentMatcherBase)
        .has(a => a["reason"]).that.equals(reason).kThx
        .has(a => a["reasonData"]).that.isNull();
  }
}
