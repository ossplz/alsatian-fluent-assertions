import { Test, TestCase, Any, MatchError, AsyncTest } from "alsatian";
import { Assert } from "../../src/assert";
import { LocationMode } from "../../src/types";

export class PropertyNegationsIntegrationTests {
  @TestCase([1,2,3], [4,5,6])
  @TestCase([1,2,3], [1,2], LocationMode.endsWith)
  @TestCase([1,2,3], [2, 3], LocationMode.startsWith)
  @TestCase([1,2,3,4], [2, 4], LocationMode.sequentialContains)
  public notHasElements(a: any[], b: any[], mode: LocationMode) {
    Assert(a).not.hasElements(b, mode);
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