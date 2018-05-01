import { Test, TestCase, Any } from "alsatian";
import { Assert } from "../../src/assert";
import { SpecError } from "../../src/errors";

class MyError extends Error {}

export class IsTests {
  @TestCase(new Date(), Date)
  @TestCase(new IsTests(), IsTests)
  @TestCase(new Error(), Error)
  @TestCase(new MyError(), Error)
  public instancesOfPasses(instance: any, type: { new (): any }) {
    const assert = Assert(instance);

    Assert(() => assert.is(type)).not.throws();
  }

  @TestCase(3, Number)
  @TestCase("asdf", String)
  @TestCase(new Error(), String)
  @TestCase(null, String)
  @TestCase(undefined, String)
  public instancesOfFails(instance: any, type: { new (): any }) {
    const assert = Assert(instance);

    Assert(() => assert.is(type))
      .throws(SpecError)
      .that.has({ message: /should be of type/});
  }

  @Test()
  public mustTakeFnOrThrow() {
    const lambda = () => Assert("").is("" as any);
    Assert(lambda)
      .throws<TypeError>()
      .that.has({
        message: /Expected type 'function' for instance check, but got type 'string'./
      });
  }

  @Test()
  public nullName_usesDefault() {
    class MyTestClass {}
    Object.defineProperty(MyTestClass, "name", {
      get() {
        return undefined;
      }
    });
    const lambda = () => Assert("").is(MyTestClass);
    Assert(lambda)
      .throws<SpecError>()
      .that.has({ expected: /\(Unnamed type; JS type: function/ });
  }
}
