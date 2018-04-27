import { Test, TestCase, Any } from "alsatian";
import { Assert } from "../../src/assert";

export class DeeplyEqualTests {
  // This helper (and the others) are mostly covered under the equals() tests.
  @TestCase(0, 0)
  public DefaultsToStrictlyEqual_True(a: any, b: any) {
    Assert(a).deeplyEquals(b);
  }

  @TestCase(false, 0)
  public DefaultsToStrictlyEqual_False(a: any, b: any) {
    Assert(a).not.deeplyEquals(b);
  }
}
