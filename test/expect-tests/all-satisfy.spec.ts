import { Test, TestCase, Any, MatchError } from "alsatian";
import { Assert } from "../../src/assert";
import { SpecError } from "../../src/errors";

export class AllSatisfyTests {
  @TestCase([1, 2, 3], (e: number) => e < 5, false)
  @TestCase([1, 2, 3, 6], (e: number) => e < 5, true)
  public allSatisfy_passesIffAll(
    array: Array<any>,
    predicate: (a: any) => boolean,
    throws: boolean
  ) {
    const fn = () => Assert(array).allSatisfy(predicate);

    Assert(fn)
      .maybe(throws)
      .throws(SpecError);
  }

  @TestCase(123)
  @TestCase(false)
  @TestCase(undefined)
  @TestCase(null)
  @TestCase({})
  @TestCase("asdf")
  public allSatisfy_notArrayType_throws(input: any) {
    const expect = Assert(input);
    Assert(() => expect.allSatisfy(() => true))
      .throws(SpecError)
      .that.has({ message: /should be an array type/ });
  }

  @TestCase(123)
  @TestCase(false)
  @TestCase(undefined)
  @TestCase(null)
  @TestCase({})
  @TestCase("asdf")
  public allSatisfy_predicateNotAFunc_throws(input: any) {
    const expect = Assert([]);
    Assert(() => expect.allSatisfy(input))
      .throws(SpecError)
      .that.has({ message: /expectation should be a function/ });
  }

  @Test("allSatisfy() should identify non-satisfying items.")
  public allSatisfy_identifiesNonSatisfyingItems() {
    const lambda = () => Assert([1,2,3]).allSatisfy(e => e < 2);
    Assert(lambda)
      .throws().that
        .has(l => l["actual"]).that
          .deeplyEquals([2,3]);
  }
}
