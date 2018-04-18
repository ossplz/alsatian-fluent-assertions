import {
    Test,
    TestCase,
    Any,
    MatchError
  } from "alsatian";
  import { Assert } from "../../src/assert";
  
  export class AssertFailTests {
      @Test()
      public fail_shouldFail() {
          Assert(() => Assert.fail("whatever, man."))
            .throws(MatchError)
            .that.has({ message: /whatever, man./});
      }
  }