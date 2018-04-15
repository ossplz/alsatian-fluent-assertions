import {
  Test,
  TestCase,
  Any,
  MatchError
} from "alsatian";
import { Assert } from "../../src/assert";

export class HasPropertyTests {
  @Test()
  public hasProperty_ThrowsWhenNotProvidedFunc() {
    const lambda = () => Assert({ one: 2 }).hasProperty(3 as any);
    Assert(lambda)
      .throws<Error>()
      .that.hasProperty(p => p.message)
      .that.matches(/not a function/);
  }

  @Test()
  public hasProperty_NoMatchWhenPropertyMissing() {
    const lambda = () =>
      Assert({ hi: "there" }).hasProperty((p: any) => p.something);
    Assert(lambda)
      .throws<MatchError>()
      .that.hasProperty(p => p.message)
      .that.matches(/should be defined/);
  }

  @Test()
  public hasProperty_MatchesWhenPropertyPresent() {
    const lambda = () => Assert({ hi: "there" }).hasProperty(p => p.hi);
    Assert(lambda).not.throws<MatchError>();
  }
}
