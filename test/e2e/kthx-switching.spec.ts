import { Assert } from "../../src/assert";
import { Test } from "alsatian";

export class KThxSwitchingTests {
  @Test()
  public kThx_multipleSameLevelAssertions() {
      Assert({ a: "b", c: "d", 3: 1415 })
        .has(o => o.a).that.equals("b").kThx
        .has(o => o.c).that.equals("d").kThx
        .has(o => o[3]).that.equals(1415);
  }

  @Test()
  public kThx_multipleLevelSwitchedAssertions() {
      Assert({ a: { b: "c", d: "e" }, 5: { 16: 2, 17: 3}})
        .has(o => o.a).that
            .has(o => o.b).that.equals("c").kThx
            .has(o => o.d).that.equals("e").kThx
            .kThx
        .has(o => o[5]).that
            .has(o => o[16]).that.equals(2).kThx
            .has(o => o[17]).that.equals(3);
  }
}
