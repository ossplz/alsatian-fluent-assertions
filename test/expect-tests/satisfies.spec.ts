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
