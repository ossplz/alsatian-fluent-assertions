import { Assert } from "../../src/assert";
import { Test } from "alsatian";

export class KThxTests {
  @Test()
  public kThx_ReturnsPreviousScope() {
    const scope = Assert({ a: "b" });
    const next = scope.has(o => o.a).that.equals("b");
    const beginning = next.kThx;
    Assert(beginning).strictlyEquals(scope);
  }

  @Test()
  public kThx_previousScopeNullWhenNotExist() {
    const scope = Assert("something").kThx;
    Assert(scope).isNull();
  }
}
