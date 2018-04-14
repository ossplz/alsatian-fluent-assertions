import {
  Test,
  TestCase,
  Any,
  MatchError
} from "alsatian";
import { Assert } from "../../src/assert";

export class WithKeysTests {
  @TestCase(undefined)
  @TestCase(null)
  public propertylessTypesThrow(value: any) {
    const expect = Assert(value);

    Assert(() => expect.hasKeys(["something"]))
      .throws(MatchError)
      .that.has({ message: /should be defined/ });
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
      .that.has({ message: /does not contain all/ });
  }
}
