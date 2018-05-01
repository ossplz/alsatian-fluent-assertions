import { Test, TestCase, Any, MatchError, AsyncTest } from "alsatian";
import { Assert } from "../../src/assert";

export class PropertyNegationsIntegrationTests {
  @TestCase({}, { one: 123})
  @TestCase({ two: 321 }, { missing: 123 })
  @TestCase(undefined, { missing: "because we're human, undefined validly doesn't have missing values, right?" })
  @TestCase(null, { missing: "to check null/undefined, a human would explicitly do that, right? tbh, idk. let's hope."})
  @Test()
  public notHasProperties(val: any, expected: any) {
    Assert(val).not.hasProperties(expected);
  }

  @Test()
  public notHasAll() {
      Assert({}).not.hasAll({one: 123});
  }

  @Test()
  public notHasKeys() {
      Assert({}).not.hasKeys(<any>["one"]);
  }
}