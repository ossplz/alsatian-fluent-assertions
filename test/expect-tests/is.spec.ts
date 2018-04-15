import {
  Test,
  TestCase,
  Any
} from "alsatian";
import { Assert } from "../../src/assert";

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
  public instancesOfFails(instance: any, type: { new (): any }) {
    const assert = Assert(instance);

    Assert(() => assert.is(type)).throws();
  }
}
