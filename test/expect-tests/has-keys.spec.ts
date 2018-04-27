import { Test, TestCase, Any, MatchError } from "alsatian";
import { Assert } from "../../src/assert";
import { SpecError } from "../../src/errors";

export class HasKeysTests {
  @TestCase(undefined)
  @TestCase(null)
  public propertylessTypesThrow(value: any) {
    const expect = Assert(value);

    Assert(() => expect.hasKeys(["something"]))
      .throws(MatchError)
      .that.has({ message: /should be defined/ });
  }

  @TestCase({})
  @TestCase(123)
  @TestCase("asdfa")
  public hasKeys_expectedNotArray_throws(v: any) {
    const fn = () => Assert({}).hasKeys(v);
    Assert(fn)
      .throws(SpecError)
      .that.has({ message: /should be an array type/ });
  }

  @TestCase({ something: 123 })
  @TestCase({ 123: 456, something: false })
  public hasKeysNoThrow(value: any) {
    const expect = Assert(value);

    Assert(() => expect.hasKeys(["something"])).not.throws();
  }

  @TestCase({ something: 123 })
  @TestCase({ 123: 456, something: false })
  public missingKeysThrows(value: any) {
    const expect = Assert(value);

    Assert(() => expect.hasKeys(["somethingElse"]))
      .throws(MatchError)
      .that.has({ message: /should contain all/ });
  }
}
