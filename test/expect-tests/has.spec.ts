import {
    Test,
    TestCase,
    Any,
    MatchError
  } from "alsatian";
  import { Assert } from "../../src/assert";

  export class HasTests {

      @TestCase({ prop: 3 }, (a: any) => a.prop, false)
      @TestCase({ prop: 3 }, (a: any) => a.missing, true)
      public Has_GivenFn_DelegatesHasProperty(obj: any, selector: Function, will: boolean) {
        const expect = Assert(obj);

        Assert(() => expect.has(selector))
          .maybe(will).throws();
      }

      @TestCase({ prop: 3 }, (a: any) => a.prop, 3)
      @TestCase({ prop: 314 }, (a: any) => a.prop, 314)
      public Has_GivenFn_ReturnsNarrowable(obj: any, selector: <T, R>(v: T) => R, final: number) {
          Assert(obj).has(selector).that.equals(final);
      }
  }