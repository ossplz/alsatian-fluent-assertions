import { Test, TestCase, Any, MatchError, SpyOn, Expect } from "alsatian";
import { Assert } from "../../src/assert";
import { MatchMode as MM } from "../../src/types";

export class HasPropertiesTests {
  @TestCase(undefined)
  @TestCase(null)
  public propertylessTypesThrow(value: any) {
    const expect = Assert(value);

    Assert(() => expect.has({ one: 2 }))
      .throws(MatchError)
      .that.has({ message: /should be defined/ });
  }

  @TestCase({ honey: "sugar" })
  @TestCase({ 123: 653, depth: { deeper: 321 } })
  public propertiesMatchSelves(value: any) {
    const expect = Assert(value);

    Assert(() => expect.has(value)).not.throws();
  }

  @TestCase(
    { honey: "sugar" },
    { honey: /ginger/ },
    /regular expression at path.*should match/
  )
  @TestCase(
    { 123: 653, depth: { deeper: 321 } },
    { 123: 653, depth: { deeper: "wrong" } },
    /property deeper at path '\$.depth.deeper' should equal/
  )
  public propertiesDontMatchThrows(
    value: any,
    expected: any,
    expectedMessage: RegExp
  ) {
    const expect = Assert(value);

    Assert(() => expect.has(expected))
      .throws(MatchError)
      .that.has({ message: expectedMessage });
  }

  @TestCase(
    { honey: "sugar" },
    { honey: (a: string) => Assert(a).equals("sugar") }
  )
  @TestCase({ honey: "sugar" }, { honey: (a: string) => a === "sugar" })
  public propertyLambdasMatchNoThrows(value: any, expected: any) {
    const expect = Assert(value);

    Assert(() => expect.has(expected)).not.throws();
  }

  @TestCase(
    { honey: "sugar" },
    { honey: (a: string) => Assert(a).equals("cane") }
  )
  @TestCase({ honey: "sugar" }, { honey: (a: string) => a === "cane" })
  public propertyLambdasDontMatchThrows(value: any, expected: any) {
    const expect = Assert(value);

    Assert(() => expect.has(expected)).throws();
  }

  @Test()
  public allPropertiesWrapsProperties() {
    const thing = { one: "two" };
    const actualValue = { one: "two" };
    const expect = Assert(actualValue);
    SpyOn(expect, "_properties");
    expect.hasAll(thing);
    // FIXME gross:
    Expect((expect as any)._properties as () => any).toHaveBeenCalledWith(
      actualValue,
      thing,
      Any(Array),
      MM.normal
    );
  }

  @Test()
  public failsWhenActualIsRegexpAndRegexpsDontMatch() {
    const expect = Assert({ one: /123/ });
    Assert(() => expect.has({ one: /321/ }))
      .throws(MatchError)
      .that.has({
        message: /regular expressions at path.*should be equal/
      });
  }

  @Test()
  public succeedsWhenRegexpsMatch() {
    const expect = Assert({ one: /123/ });
    Assert(() => expect.has({ one: /123/ })).not.throws(MatchError);
  }

  @Test()
  public failsWhenRegexpTargetNotString() {
    const expect = Assert({ one: { complex: "type" } });
    Assert(() => expect.has({ one: /123/ }))
      .throws(MatchError)
      .that.has({ message: /expected type 'string' for regexp match/ });
  }

  @Test()
  public notProperties_nestedUndefinedPasses() {
    const props = {
      first: {
        a: "b"
      }
    };
    Assert(() => Assert({}).not.has(props)).not.throws();
  }

  @TestCase(
    { one: "321" },
    { one: /321/ },
    /regular expression at path.*should not match/
  )
  @TestCase({ one: 321 }, { two: 742, one: 321 }, /should not equal/)
  public notWithPropertiesNegates(
    object: any,
    notAsserted: any,
    expectedRegexp: RegExp
  ) {
    const expect = Assert(object);
    Assert(() => expect.not.has(notAsserted))
      .throws(MatchError)
      .that.has({ message: expectedRegexp });
  }

  @TestCase(
    { one: { two: { three: 321 } } },
    { one: { two: { three: 0 } } },
    /\$.one.two.three/
  )
  @TestCase(
    { four: [0, 1, { five: 321 }] },
    { four: [0, 1, { five: 0 }] },
    /\$.four.2.five/
  )
  @TestCase(
    { one: [] },
    { one: [{ prop: "not there" }] },
    /property '0' should be defined at path '\$.one.0'/
  )
  public errorMessageRevealsNesting(
    object: any,
    expectAttempt: any,
    expectedPath: RegExp
  ) {
    const expect = Assert(object);
    Assert(() => expect.has(expectAttempt))
      .throws(MatchError)
      .that.has({ message: expectedPath });
  }

  @Test()
  public booleanLambdaInvertsMessageWhenInverted() {
    const expect = Assert({ one: "two" });
    Assert(() => expect.not.has({ one: () => true }))
      .throws(MatchError)
      .that.has({
        message: /should not satisfy lambda assertion/
      });
  }

  @Test()
  public nestedAssertFailsCaughtAndWrapped() {
    const expect = Assert({ one: "two" });
    const lambda = () => expect.has({ one: o => Assert(o).equals("three") });
    Assert(lambda)
      .throws(MatchError)
      .that.has({
        message: /Property at path '\$.one' failed nested expectation./
      });
  }

  @Test()
  public nestedAssertThrowsCaughtAndWrapped() {
    const expect = Assert({ one: "two" });
    const lambda = () =>
      expect.has({
        one: o => {
          throw new Error();
        }
      });
    Assert(lambda)
      .throws(MatchError)
      .that.has({
        message: /Property at path '\$.one' threw unexpected error./
      });
  }

  @Test()
  public nestedAssertPassNoError() {
    const expect = Assert({ one: "two" });
    const lambda = () => expect.has({ one: o => Assert(o).equals("two") });
    Assert(lambda).not.throws(MatchError);
  }

  @TestCase({ one: (o: any) => Assert(o).equals("two") })
  @TestCase({
    one: (o: any) => {
      /* no op */
    }
  })
  @TestCase({ one: (o: any) => true })
  public negatedNestedAssertNoErrorFails() {
    const expect = Assert({ one: "two" });
    const lambda = () => expect.not.has({ one: o => Assert(o).equals("two") });
    Assert(lambda)
      .throws(MatchError)
      .that.has({
        message: /expected lambda to return false, or yield a failed nested expectation or error/
      });
  }

  @Test()
  public elaborateNestedAssert_Error_Passes() {
    const expect = Assert({
      one: "two",
      three: { four: [5, 6] }
    });
    const lambda = () =>
      expect.has({
        one: o => Assert(o).equals("two"), // should pass
        three: { four: [5, (n: any) => Assert(n).equals(7) /* fail */] }
      });
    Assert(lambda)
      .throws(MatchError)
      .that.has({
        message: /Property at path '\$.three.four.1' failed nested expectation./
      });
  }

  @Test()
  public elaborateNegatedNestedAssert_Error_Passes() {
    const expect = Assert({
      one: "two",
      three: { four: [5, 6] }
    });
    const lambda = () =>
      expect.not.has({
        one: o => Assert(o).equals("two"), // should pass
        three: { four: [5, (n: any) => Assert(n).equals(6) /* fail */] }
      });
    Assert(lambda).throws(MatchError);
  }
}
