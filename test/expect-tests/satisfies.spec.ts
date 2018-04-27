import {
  Test,
  TestCase,
  Any
} from "alsatian";
import { Assert } from "../../src/assert";

export class SatifiesTests {
  @TestCase((t: any) => true)
  @TestCase((t: any) => "truthy")
  public shouldMatchPredicate(predicate: (t: any) => boolean) {
    const expect = Assert(123);

    Assert(() => expect.satisfies(predicate)).not.throws();
  }

  @TestCase(123)
  @TestCase("123")
  @TestCase(/423/)
  @TestCase(false)
  @TestCase(true)
  @TestCase(undefined)
  @TestCase(null)
  public satisfies_nonLambdaShouldThrow(v: any) {
    const fn = () => Assert("123").satisfies(v);
    Assert(fn)
      .throws()
      .that.has({ message: /should be a function/});
  }

  @TestCase((t: any) => false)
  @TestCase((t: any) => "" /* falsy */)
  public shouldNotMatchPredicate(predicate: (t: any) => boolean) {
    const expect = Assert(123);

    Assert(() => expect.satisfies(predicate))
      .throws()
      .that.has({
        message: /should match lambda/
      });
  }
}
