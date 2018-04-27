import { Test, TestCase, Any, MatchError } from "alsatian";
import { Assert } from "../../src/assert";

export class HasAssertsTests {
  @Test()
  public lambdasWrappedInAssertions() {
    const lambda = () =>
      Assert({ prop: 3, str: "whoa 123" }).hasAsserts({
        prop: p => p.equals(3),
        str: p =>
          p
            .hasMatch(/\d+/)
            .that.hasSingle()
            .that.equals("123")
      });
    Assert(lambda).not.throws();
  }

  @Test()
  public iffReturnValueOfPassingStrictlyBool_PassFailbyBool() {
    const lambda = () =>
      Assert({ prop: 3, str: "whoa 123" }).hasAsserts({
        prop: p => true,
        str: p => true
      });
    Assert(lambda).not.throws();

    const lambdaFail = () =>
      Assert({ prop: 3, str: "whoa 123" }).hasAsserts({
        prop: p => true,
        str: p => false
      });
    Assert(lambdaFail)
      .throws(Error)
      .that.has(e => e.message)
      .that.matches(/should satisfy lambda assertion/);
  }

  @Test()
  public whenArray_delegatesToHasElements() {
    const lambda = () => Assert([1, 2, 3]).hasAsserts([1, 2, 3]);
    Assert(lambda).not.throws();
  }
}
