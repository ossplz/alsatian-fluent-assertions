import { Test, TestCase, Any, MatchError, AsyncTest } from "alsatian";
import { Assert } from "../../src/assert";
import { SpecError } from "../../src/errors";

export class SimpleNegationsIntegrationTests {
  @Test()
  public notEquals() {
    Assert(3).not.equals(4);
  }

  @Test()
  public notDeeplyEquals() {
      const val = { one: { two: [3] }};
      const val2 = { one: { two: [4] }};
      Assert(val).not.deeplyEquals(val2);
  }

  @Test()
  public notIsDefined() {
      Assert(undefined).not.isDefined();
  }

  @Test()
  public notMatches() {
      Assert("asdf").not.matches(/123/);
  }

  @Test()
  public notHasMatch() {
      Assert("asdf").not.hasMatch(/123/);
  }

  @Test()
  public notThrows() {
      Assert(() => {}).not.throws();
  }

  @AsyncTest()
  public async notThrowsAsync() {
      await Assert(() => {}).not.throwsAsync();
  }

  @Test()
  public notSatisfies() {
      Assert(314).not.satisfies(x => x === 512);
  }

  @Test()
  public notIs() {
      class MyTestClass {}
      Assert(new Date()).not.is(MyTestClass);
  }

  @TestCase({})
  @TestCase({ two: 321 })
  @TestCase(undefined)
  @TestCase(null)
  @TestCase(3)
  @Test()
  public notHasProperty(obj: any) {
      Assert(obj).not.hasProperty(o => (<any>o).prop);
  }

  @Test()
  public notHasSingle() {
      Assert([]).not.hasSingle();
  }

  @Test()
  public notIsEmpty() {
      Assert([1]).not.isEmpty();
  }

  @Test()
  public notIsTruthy() {
      Assert(false).not.isTruthy();
  }

  @Test()
  public notIsFalsy() {
      Assert(true).not.isFalsy();
  }
}
