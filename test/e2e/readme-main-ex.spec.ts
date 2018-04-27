import { Test, TestCase, Any } from "alsatian";
import { Assert } from "../../src/assert";

class SomeType {
  public prop: string = "user 007";
  public other: string = "...";
}

export class ReadmeMainExample {
  @Test()
  public MainExample_CanPass() {
    const obj = new SomeType();
    const expected = obj;
    Assert(obj)
      .is(SomeType)
      .has(o => o.prop)
      .that.hasMatch(/(\d+)/) // alt 'matches' that returns match result scope
      .that.has(matchParts => +matchParts[0])
      .that.equals(7);
    Assert(obj).equals(expected);
    Assert(obj).has({
      prop: "user 007",
      other: p => Assert(p).matches(/.../)
    });
  }
}
