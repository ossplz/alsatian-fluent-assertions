import { Test, TestCase, Any, MatchError } from "alsatian";
import { Assert } from "../../src/assert";
import { SpecError, NestedPropertiesMatchError } from "../../src/errors";

class SomeType {
  public prop: string = "user 007";
  public other: string = "...";
}

export class NestedAssertionsTests {
  @Test()
  public has_nestedAssertErrorMessagesSensible() {
      const val = {
          one: { 
              two: "wrong"
        }
      }
      const fn = () => Assert(val)
        .hasAsserts({
            one: a => a.hasAsserts({
                two: a => a.equals("right")
            })
        });

    Assert(fn)
        .throws(NestedPropertiesMatchError)
        .that.has({
            message: /should strictly \(===\) equal/,
            expected: "right",
            actual: "wrong"
        });
  }
}
