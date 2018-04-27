import { Test, TestCase, Any } from "alsatian";
import { Assert } from "../../src/assert";
import { SpecError } from "../../src/errors";

export class HasMatchesTests {
  @TestCase("123-321", /(\d+)-(\d+)/)
  public matchesAndReturnsStrings(target: string, regexp: RegExp) {
    const lambda = () =>
      Assert(target)
        .hasMatch(regexp)
        .that.hasProperty(parts => +parts[2])
        .that.equals(321);

    Assert(lambda).not.throws();
  }

  @TestCase(undefined)
  @TestCase(null)
  public hasMatch__handlesFalsyParams(v: any) {
    const fn = () => Assert("aaa").hasMatch(v);
    Assert(fn)
      .throws(SpecError)
      .that.has({ message: /should be a regular expression/ });
  }
}
