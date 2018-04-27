import { Test, TestCase, Any, MatchError, ContainerMatcher } from "alsatian";
import { Assert } from "../../src/assert";
import { LocationMode, MatchMode } from "../../src/types";
import { SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG } from "constants";
import { SpecError } from "../../src/errors";
import { IFluentCore } from "../../src/matchers";

export class HasElementsTests {
  @TestCase(undefined)
  @TestCase(null)
  public nonArrayTypesThrow(value: any) {
    const expect = Assert(value);

    Assert(() => expect.hasElements(["something"]))
      .throws(SpecError)
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
      .throws(SpecError)
      .that.has({ message: /should contain expected elements/ });
  }

  @TestCase([1, 2, 3], [2, 3], LocationMode.startsWith, true)
  @TestCase([1, 2, 3], [2, 3], LocationMode.endsWith, false)
  @TestCase([1, 2, 3], [2, 3], LocationMode.contains, false)
  @TestCase([1, [2, 3], 4], [[2, 3]], LocationMode.contains, false)
  @TestCase([1, [2, 3], 4], [2, 3], LocationMode.contains, true)
  @TestCase([], [], LocationMode.contains, false)
  @TestCase([1], [], LocationMode.contains, false)
  @TestCase([], [1], LocationMode.contains, true)
  @TestCase([1], [1], LocationMode.contains, false)
  @TestCase([1, 2], [1, 2], LocationMode.contains, false)
  @TestCase([[1, 2]], [[1, 2]], LocationMode.contains, false)
  @TestCase(
    ["one", "two", 3, "four", "five", 6],
    [3, "four", "five"],
    LocationMode.sequentialContains,
    false
  )
  @TestCase(
    ["one", "two", 3, "four", "five", 6],
    [3, "five"],
    LocationMode.sequentialContains,
    true
  )
  @TestCase(["one", "two"], [/two/], LocationMode.contains, false)
  @TestCase(["one", "two"], [/owt/], LocationMode.contains, true)
  @TestCase(["one", /owt/], [/owt/], LocationMode.contains, false)
  @TestCase(["one", 123], [/owt/], LocationMode.contains, true)
  @TestCase(
    ["one", /owt/],
    [(v: any) => v.toString() === "/owt/"],
    LocationMode.contains,
    false
  )
  @TestCase(
    ["one"],
    [
      (v: any) => {
        throw new Error();
      }
    ],
    LocationMode.contains,
    true
  )
  @TestCase(
    ["one"],
    [(v: IFluentCore<any>) => v.equals("one")],
    LocationMode.contains,
    false,
    MatchMode.asserts
  )
  @TestCase(
    ["one"],
    [(v: IFluentCore<any>) => v.equals("two")],
    LocationMode.contains,
    true,
    MatchMode.asserts
  )
  @TestCase(["one"], [/one/], LocationMode.contains, false, MatchMode.normal)
  @TestCase(["one"], [/one/], LocationMode.contains, true, MatchMode.literal)
  public matchesArrayPatterns(
    value: Array<any>,
    pattern: Array<any>,
    location: LocationMode,
    throws: boolean,
    mmode: MatchMode = MatchMode.normal
  ) {
    const expect = Assert(value);

    Assert(() => expect.hasElements(pattern, location, mmode))
      .maybe(throws)
      .throws(SpecError);
  }
}
