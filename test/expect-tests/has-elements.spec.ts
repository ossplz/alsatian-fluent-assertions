import {
  Test,
  TestCase,
  Any,
  MatchError,
  ContainerMatcher
} from "alsatian";
import { Assert } from "../../src/assert";
import { E, LocationMode, MatchMode } from "../../src/types";
import { SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG } from "constants";
import { SpecError } from "../../src/errors";

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
      .that.has({ message: /should contain all/ });
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
  @TestCase([1,2], [1,2], LocationMode.contains, false)
  @TestCase([[1,2]], [[1,2]], LocationMode.contains, false)
  public matchesArrayPatterns(value: any[], pattern: any[], location: LocationMode, throws: boolean) {
    const expect = Assert(value);

    Assert(() => expect.hasElements(pattern, location))
      .maybe(throws).throws(SpecError);
  }
}
