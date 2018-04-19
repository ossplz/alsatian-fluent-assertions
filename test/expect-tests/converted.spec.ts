import {
    Test,
    TestCase,
    Any,
    MatchError
  } from "alsatian";
  import { Assert } from "../../src/assert";

  export class ConvertedTests {
      @Test()
      public returnsTransformedValue(val: any[], throws: boolean) {
          const result = Assert("007").converted(a => +a).lastContextualValue;
          Assert(result).equals(7);
      }

      @Test()
      public throwsWhenNotAFunction() {
          const lambda = () => Assert("007").converted(<((a: string) => number)><any>7);
          Assert(lambda).throws().that.has({ message: /Given value is not a function, but a number./});
      }
  }