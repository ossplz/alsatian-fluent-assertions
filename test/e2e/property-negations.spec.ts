import { Test, TestCase, Any, MatchError, AsyncTest } from "alsatian";
import { Assert } from "../../src/assert";

export class PropertyNegationsIntegrationTests {
  @Test()
  public notHasProperties() {
    Assert({}).not.hasProperties({ one: 123 });
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