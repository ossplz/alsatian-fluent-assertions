import {
  Test,
  TestCase,
  Any
} from "alsatian";
import { Assert } from "../../src/assert";

// See: https://github.com/Microsoft/TypeScript/issues/13965
class MyError extends Error {
  // tslint:disable-next-line
  public __proto__: Error;
  constructor(message?: string) {
    const trueProto = new.target.prototype;
    super(message);

    // Alternatively use Object.setPrototypeOf if you have an ES6 environment.
    this.__proto__ = trueProto;
  }
}

class SomeError extends MyError {}

export class ToThrowTests {
  @TestCase((t: any) => {
    throw new Error();
  }, Error)
  @TestCase((t: any) => {
    throw new SomeError();
  }, MyError)
  public shouldMatchThrowable<TError extends Error>(
    lambda: (t: any) => void,
    type: { new (...args: Array<any>): TError }
  ) {
    const assert = Assert(lambda);

    Assert(() => assert.throws(type)).not.throws();
  }

  @TestCase((t: any) => {
    throw new Error();
  }, MyError)
  @TestCase((t: any) => {
    throw new SomeError();
  }, String)
  public shouldNotMatchThrowable<TError extends Error>(
    lambda: (t: any) => void,
    type: { new (): TError }
  ) {
    const assert = Assert(123);

    Assert(() => assert.throws(type))
      .throws()
      .that.has({
        message: /should throw type/
      });
  }

  @Test()
  public throwShouldResetNegationContext() {
    const assert = Assert(() => {}).not.throws();
    Assert((assert as any).invert).equals(false);
  }

  @Test()
  public noThrowShouldFail() {
    const assert = Assert(() => {});

    Assert(() => assert.throws()).throws();
  }
}
