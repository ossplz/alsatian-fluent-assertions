import {
    Test,
    TestCase,
    Any,
    MatchError
  } from "alsatian";
  import { Assert } from "../../src/assert";

  export class HasAssertsTests {
      @Test()
      public lambdasWrappedInAssertions() {
        const lambda = () => Assert({ prop: 3, str: "whoa 123" })
            .hasAsserts({
                prop: p => p.equals(3),
                str: p => p.hasMatch(/\d+/).that.hasSingle().that.equals("123")
            });
        Assert(lambda).not.throws();
      }
  }