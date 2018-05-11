import { Test, TestCase, Any } from "alsatian";
import { Assert } from "../../src/assert";
import { SpecError } from "../../src/errors";

export class DefinedTests {
  @TestCase(null)
  @TestCase("asdf")
  @TestCase(123)
  @TestCase({})
  public isDefined_passesWhenNotUndefined(instance: any) {
    const assert = Assert(instance);

    Assert(() => assert.isDefined()).not.throws();
  }

  @TestCase(null, "null")
  @TestCase("asdf", "asdf")
  @TestCase(123, "123")
  @TestCase({}, "[object Object]")
  public not_isDefined_failsWhenDefined(instance: any, actual: string) {
    const assert = Assert(instance);

    Assert(() => assert.not.isDefined())
      .throws(SpecError)
      .that.has({
        message: /should not be defined/,
        expected: " not defined",
        actual: actual
      });
  }

  @TestCase(undefined)
  public not_isDefined_passesWhenNotDefined(instance: any) {
    const assert = Assert(instance);

    Assert(() => assert.not.isDefined())
      .not.throws();      
  }

  @TestCase(undefined)
  public isDefined_failsWhenUndefined(instance: any) {
    const assert = Assert(instance);

    Assert(() => assert.isDefined())
      .throws(SpecError)
      .that.has({
        message: /should be defined/,
        expected: " defined",
        actual: "undefined",
      });
  }
}
