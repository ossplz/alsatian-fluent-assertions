import { Test, TestCase, Any } from "alsatian";
import { Assert } from "../../src/assert";

export class LastContextualValueTests {
  @Test()
  public LastContextualValue_ReturnsMostRecentActual() {
    const last = Assert({ one: 2 }).has(p => p.one).that.lastContextualValue;
    Assert(last).equals(2);
  }
}
