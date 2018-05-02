import { Test, TestCase, Any, MatchError, AsyncTest } from "alsatian";
import { Assert } from "../../src/assert";

export class PropertyNegationsIntegrationTests {
  @TestCase({}, { one: 123})
  @TestCase({ two: 321 }, { missing: 123 })
  @TestCase(undefined, { missing: "because we're human, undefined validly doesn't have missing values, right?" })
  @TestCase(null, { missing: "to check null/undefined, a human would explicitly do that, right? tbh, idk. let's hope."})
  @TestCase(3, { missing: "something" })
  @Test()
  public notHasProperties(val: any, expected: any) {
    Assert(val).not.hasProperties(expected);
  }

  @TestCase({}, { one: 123})
  @TestCase({ two: 321 }, { missing: 123 })
  @TestCase(undefined, { missing: "wot" })
  @TestCase(null, { missing: "this one"})
  @TestCase(3, { missing: "something" })
  @Test()
  public notHasAll(val: any, expected: any) {
      Assert(val).not.hasAll(expected);
  }

  @TestCase({}, ["one"])
  @TestCase({ two: 321 }, ["missing"])
  @TestCase(undefined, ["missing"])
  @TestCase(null, ["missing"])
  @TestCase(3, ["missing"])
  @Test()
  public notHasKeys(val: any, expected: any) {
      Assert(val).not.hasKeys(expected);
  }
}