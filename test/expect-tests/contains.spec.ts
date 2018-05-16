import { Test, TestCase, Any, MatchError } from "alsatian";
import { Assert } from "../../src/assert";
import { At } from "../../src/types";

export class ContainsTests {
  @TestCase("some string", "string", At.start, true, /should contain string \(position: start\)/)
  @TestCase("some string", "string", At.end, false)
  @TestCase("some string", "string", At.anywhere, false)
  @TestCase("some string", "string", undefined, false)
  @TestCase("some string", "string", "invalid", true, /Location parameter should be one of: start, end, anywhere./)
  @TestCase("some string", "missing", At.anywhere, true, /should contain string \(position: anywhere\)/)
  @TestCase("some string", "some", At.start, false)
  @TestCase(123, "some", undefined, true, /Actual value should be a string/)
  @TestCase(null, "some", undefined, true, /Actual value should be a string/)
  @TestCase(undefined, "some", undefined, true, /Actual value should be a string/)
  @TestCase("some", 123, undefined, true, /Parameter 'expected' should be a string/)
  @TestCase("some", null, undefined, true, /Parameter 'expected' should be a string/)
  @TestCase("some", undefined, undefined, true, /Parameter 'expected' should be a string/)
  public contains_passesOrFailsWhenAppropriate(actual: string, expected: string, location: At, throws: boolean, msg: RegExp) {
    const lambda = () =>
      Assert(actual)
        .contains(expected, location);
    Assert(lambda)
      .maybe(throws).throws()
        .that.maybe(throws).has({ message: msg });
  }

  @TestCase("some string", "string", At.start, false)
  @TestCase("some string", "string", At.end, true, /should not contain string/)
  @TestCase("some string", "string", At.anywhere, true, /should not contain string/)
  @TestCase("some string", "string", undefined, true, /should not contain string/)
  @TestCase("some string", "string", "invalid", true, /Location parameter should be one of: start, end, anywhere./)
  @TestCase("some string", "missing", At.anywhere, false)
  @TestCase("some string", "some", At.start, true, /should not contain string/)
  @TestCase(123, "some", undefined, true, /Actual value should be a string/)
  @TestCase(null, "some", undefined, true, /Actual value should be a string/)
  @TestCase(undefined, "some", undefined, true, /Actual value should be a string/)
  @TestCase("some", 123, undefined, true, /Parameter 'expected' should be a string/)
  @TestCase("some", null, undefined, true, /Parameter 'expected' should be a string/)
  @TestCase("some", undefined, undefined, true, /Parameter 'expected' should be a string/)
  public notContains_passesOrFailsWhenAppropriate(actual: string, expected: string, location: At, throws: boolean, msg: RegExp) {
    const lambda = () =>
      Assert(actual)
        .not.contains(expected, location);
    Assert(lambda)
      .maybe(throws).throws()
        .that.maybe(throws).has({ message: msg });
  }

  @Test()
  public contains_secondParamNotNeeded() {
    // more of a compiler test. If second param is not needed,
    // compiler should be okay with it missing.
    const lambda = () =>
        Assert("something")
            .contains("thing");
    Assert(lambda)
        .not.throws();
  }
}
