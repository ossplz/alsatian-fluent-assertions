import { Test, TestCase, Any, MatchError, AsyncTest } from "alsatian";
import { Assert } from "../../src/assert";
import { LocationMode } from "../../src/types";
import { SpecError } from "../../src/errors";

export class PropertyNegationsIntegrationTests {
  @TestCase([1,2,3], [4,5,6])
  @TestCase([1,2,3], [1,2], LocationMode.endsWith)
  @TestCase([1,2,3], [2, 3], LocationMode.startsWith)
  @TestCase([1,2,3,4], [2, 4], LocationMode.sequentialContains)
  @TestCase([], [1, 2])
  public notHasElements(a: any[], b: any[], mode: LocationMode) {
    Assert(a).not.hasElements(b, mode);
  }

  @TestCase([1], [1], LocationMode.contains, /should not contain/)
  @TestCase([1], [1], LocationMode.endsWith, /should not match asserted element/)
  @TestCase([1], [1], LocationMode.startsWith, /should not match asserted element/)
  @TestCase([1], [1], LocationMode.sequentialContains, /should not find sequence in array/)  
  @TestCase(undefined, [])
  @TestCase(null, [])
  @TestCase(undefined, [1, 2])
  @TestCase(null, [1, 2])
  @TestCase(undefined, [], LocationMode.startsWith)
  @TestCase(null, [], LocationMode.startsWith)
  @TestCase(undefined, [1, 2], LocationMode.startsWith)
  @TestCase(null, [1,2], LocationMode.startsWith)
  @TestCase(undefined, [], LocationMode.endsWith)
  @TestCase(null, [], LocationMode.endsWith)
  @TestCase(undefined, [1, 2], LocationMode.endsWith)
  @TestCase(null, [1,2], LocationMode.endsWith)
  @TestCase(undefined, [], LocationMode.sequentialContains)
  @TestCase(null, [], LocationMode.sequentialContains)
  @TestCase(undefined, [1, 2], LocationMode.sequentialContains)
  @TestCase(null, [1,2], LocationMode.sequentialContains)
  public notHasElements_canFail(a: any[], b: any[], mode: LocationMode, ptrn?: RegExp) {
    const fn = () => Assert(a).not.hasElements(b, mode);
    Assert(fn)
        .throws(SpecError)
        .that.has({ message: ptrn || /not an array type/ });
  }

  @TestCase([1,2,3], (x: any) => x >= 2)
  @TestCase([], (x: any) => x >= 2)
  @Test()
  public notAllSatisfy(a: any, b: (e: any) => boolean) {
      Assert(a).not.allSatisfy(b);
  }

  @TestCase([1,2,3], (x: any) => x > 0)
  @Test()
  public notAllSatisfy_canFail(a: any, b: (e: any) => boolean) {
      const fn = () => Assert(a).not.allSatisfy(b);
      Assert(fn)
        .throws(SpecError)
        .that.has({ message: /should all not satisfy/})
  }

  @TestCase([1,2,3], (x: any) => x >= 4)
  @TestCase([], (x: any) => x >= 4)
  @Test()
  public notAnySatisfy(a: any, b: (e: any) => boolean) {
      Assert(a).not.anySatisfy(b);
  }

  @TestCase([1,2,3], (x: any) => x >= 2)
  @Test()
  public notAnySatisfy_canFail(a: any, b: (e: any) => boolean) {
      const fn = () => Assert(a).not.anySatisfy(b);
      Assert(fn)
        .throws(SpecError)
        .that.has({ message: /some should not satisfy/ });
  }

  @Test()
  public notHasFirstLast() {
      Assert([]).not.hasFirst();
      Assert([]).not.hasLast();
  }

  @Test()
  public notHasFirst_canFail() {
      const fn = () => Assert([1]).not.hasFirst();
      Assert(fn)
        .throws(SpecError)
        .that.has({ message: /should not have one or more elements/ });
  }

  @Test()
  public notHasLast_canFail() {
      const fn = () => Assert([1]).not.hasLast();
      Assert(fn)
        .throws(SpecError)
        .that.has({ message: /should not have one or more elements/ });
  }

  @TestCase([], 5)
  @TestCase([1,2,3,4], 4)
  @Test()
  public notHasNth(arr: any[], n: number) {
      Assert(arr).not.hasNth(n);
  }

  @TestCase([], -1)
  @TestCase([1,2,3,4,5], 4)
  @Test()
  public notHasNth_canFail(arr: any[], n: number) {
      const fn = () => Assert(arr).not.hasNth(n);
      Assert(fn)
        .throws(SpecError)
        .that.has({ message: RegExp(`should not have ${n+1} or more elements`)});
  }  
}