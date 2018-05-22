import { Assert } from "../../src/assert";
import { Test } from "alsatian";

export class ThatTests {
  @Test()
  public That_NarrowableScopeSelects() {
    const selected = Assert({ a: "b" })
      .has(o => o.a)
      .that.lastContextualValue;
    Assert(selected).equals("b");
  }

  @Test()
  public That_NonNarrowableContextThrows() {
    const lambda = () => (<any>Assert("something")).that;

    Assert(lambda)
        .throws();
  }
}
