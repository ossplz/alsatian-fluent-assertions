import {
  Test,
  TestCase,
  Any
} from "alsatian";
import { Assert } from "../../src/assert";

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
}
