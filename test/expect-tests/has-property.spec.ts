import { Test, TestCase, Any, MatchError } from "alsatian";
import { Assert } from "../../src/assert";

export class HasPropertyTests {
  @Test()
  public hasProperty_ThrowsWhenNotProvidedFuncOrKey() {
    const lambda = () => Assert({ one: 2 }).hasProperty(<any>new Date());
    Assert(lambda)
      .throws<Error>()
      .that.hasProperty(p => p.message)
      .that.matches(/not a function or key type/);
  }

  @TestCase({ 1: 1}, "1")
  @TestCase({ "one": 1}, "one")
  @Test()
  public hasProperty_PassesWithKeyTypes(dict: any, key: string) {
    const fn = () => Assert(dict).hasProperty(key).that.equals(1);
    Assert(fn).not.throws();
  }

  @TestCase({ 1: 1}, "2")
  @TestCase({ "one": 1}, "2")
  @Test()
  public hasProperty_failsWithMissingKeyTypes(dict: any, key: string) {
    const fn = () => Assert(dict).hasProperty(key);
    Assert(fn)
      .throws()
      .that.has({ message: /should be defined/ });
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
