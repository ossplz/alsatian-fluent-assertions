import { Test, TestCase, Any, MatchError, SpyOn, Expect } from "alsatian";
import { Assert } from "../../src/assert";
import { MatchMode } from "../../src/types";

export class HasTests {
  @TestCase({ prop: 3 }, (a: any) => a.prop, false)
  @TestCase({ prop: 3 }, (a: any) => a.missing, true)
  public Has_GivenFn_DelegatesHasProperty(
    obj: any,
    selector: () => any,
    throws: boolean
  ) {
    const expect = Assert(obj);

    Assert(() => expect.has(selector))
      .maybe(throws)
      .throws();
  }

  @TestCase({ prop: 3 }, (a: any) => a.prop, 3)
  @TestCase({ prop: 314 }, (a: any) => a.prop, 314)
  public Has_GivenFn_ReturnsNarrowable(
    obj: any,
    selector: <T, R>(v: T) => R,
    final: number
  ) {
    Assert(obj)
      .has(selector)
      .that.equals(final);
  }

  @TestCase(MatchMode.asserts)
  @TestCase(MatchMode.literal)
  public has_GivenDict_shouldPassOptions(m: MatchMode) {
    const dict = { prop: "someval"};
    const a = Assert(dict);
    const spy = SpyOn(a, "hasProperties");
    const lambda = () => {
      a.has(dict, <any>m);
    };
    
    Assert(lambda).not.throws();

    Expect(spy).toHaveBeenCalledWith(dict, m);
  }
}
