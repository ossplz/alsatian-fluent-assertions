import { Test, TestCase, Any } from "alsatian";
import { Assert } from "../../src/assert";
import { SpecError } from "../../src/errors";

export class IsNullTests {
  @TestCase(null)
  public isNull_passesWhenNull(instance: any) {
    const assert = Assert(instance);

    Assert(() => assert.isNull()).not.throws();
  }

  @TestCase(null)
  public not_isNull_failsWhenNull(instance: any) {
    const assert = Assert(instance);

    Assert(() => assert.not.isNull())
        .throws(SpecError)
        .that.has({
            message: /should not be null/,
            expected: " not null",
            actual: "null"
        })
  }

  @TestCase(undefined)
  @TestCase("asdf")
  @TestCase(123)
  @TestCase({})
  public not_isNull_passesWhenNotNull(instance: any) {
    const assert = Assert(instance);

    Assert(() => assert.not.isNull())
        .not.throws();
  }

  @TestCase(undefined, "undefined")
  @TestCase("asdf", "asdf")
  @TestCase(123, "123")
  @TestCase({}, "[object Object]")
  public isNull_failsWhenNotNull(instance: any, actual: string) {
    const assert = Assert(instance);

    Assert(() => assert.isNull())
      .throws(SpecError)
      .that.has({
          message: /should be null/,
          actual: actual
      });
  }
}
