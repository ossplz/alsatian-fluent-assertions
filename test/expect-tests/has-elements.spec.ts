import {
  Test,
  TestCase,
  Any,
  MatchError
} from "alsatian";
import { Assert } from "../../src/assert";

export class HasElementsTests {
  @TestCase(undefined)
  @TestCase(null)
  public nonArrayTypesThrow(value: any) {
    const expect = Assert(value);

    Assert(() => expect.hasElements(["something"]))
      .throws(MatchError)
      .that.has({ message: /not an array type/ });
  }

  @TestCase(["something"])
  @TestCase(["123", 456, "something"])
  public hasElementsNoThrow(value: any) {
    const expect = Assert(value);

    Assert(() => expect.hasElements(["something"])).not.throws();
  }

  @TestCase(["something"])
  @TestCase(["123", 456, "something"])
  public missingElementsThrows(value: any) {
    const expect = Assert(value);

    Assert(() => expect.hasElements(["somethingElse"]))
      .throws(MatchError)
      .that.has({ message: /does not contain all/ });
  }

  /*@TestCase([1, 2, 3], [Element.oneOrMore(e => e >= 1), 3], true)
  @TestCase([1], [Element.oneOrMore(e => e > 1), 3], false)
  @TestCase([1, 2, 3], [Element.zeroOrMore(e => e > 1), 3], false)
  public matchesArrayPatterns(value: any[], pattern: any[], ok: boolean) {
    const expect = Assert(value);

    Assert(() => expect.hasElements(pattern))
      .maybe(ok).throws(MatchError);
  }

  @Test()
  public matchesComplexPattern(mode: "fromStart" | "toEnd" | "contains" ) {
    const expect = Assert([1, 2, 3, [4, [5, 6]]])
    .hasElements([
      Element.range(0, 5, a => a < 4),
      Element.zeroOrMore,
      Element.one(e => Assert(e).hasElements([4, [5, 6]]))
    ], mode);

    Assert().contains([
      Element.one(el => el == ((e: number) => e < 4)),
      Element.zeroOrMore,

    ], ArrayMatchMode.contains, ElementMode.interpretive);
  }*/
}
