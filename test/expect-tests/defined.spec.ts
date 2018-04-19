import {
  Test,
  TestCase,
  Any
} from "alsatian";
import { Assert } from "../../src/assert";

export class DefinedTests {
  @TestCase(null)
  @TestCase("asdf")
  @TestCase(123)
  @TestCase({})
  public definedPasses(instance: any) {
    const assert = Assert(instance);

    Assert(() => assert.isDefined()).not.throws();
  }

  @TestCase(null)
  @TestCase("asdf")
  @TestCase(123)
  @TestCase({})
  public notDefinedPasses(instance: any) {
    const assert = Assert(instance);

    Assert(() => assert.not.isDefined()).throws();
  }

  @TestCase(undefined)
  public definedFails(instance: any) {
    const assert = Assert(instance);

    Assert(() => assert.isDefined())
      .throws()
      .that.has({ message: /should be defined/ });
  }
}
