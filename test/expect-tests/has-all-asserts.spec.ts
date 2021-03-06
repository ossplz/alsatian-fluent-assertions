import { Test, TestCase, Any, MatchError } from "alsatian";
import { Assert } from "../../src/assert";

export class HasAssertsTests {
  @Test()
  public lambdasWrappedInAssertions_CompilesAndPasses() {
    const lambda = () =>
      Assert({ prop: 3, str: "whoa 123" }).hasAllAsserts({
        prop: p => p.equals(3),
        str: p =>
          p
            .hasMatch(/\d+/)
            .that.hasSingle()
            .that.equals("123")
      });
    Assert(lambda).not.throws();
  }
}
