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
  public notHasElements_fails(a: any[], b: any[], mode: LocationMode, ptrn?: RegExp) {
    const fn = () => Assert(a).not.hasElements(b, mode);
    Assert(fn)
        .throws(SpecError)
        .that.has({ message: ptrn || /not an array type/ });
  }

  @Test()
  public notAllSatisfy() {
      Assert([1,2,3]).not.allSatisfy(x => x >= 2);
  }

  @Test()
  public notAnySatisfy() {
      Assert([1,2,3]).not.anySatisfy(x => x > 5);
  }

  @Test()
  public notHasFirstLast() {
      Assert([]).not.hasFirst();
      Assert([]).not.hasLast();
  }

  @Test()
  public notHasNth() {
      Assert([]).not.hasNth(5);
  }
}