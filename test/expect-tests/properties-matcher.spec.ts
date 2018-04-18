import {
    Test,
    TestCase,
    Any,
    MatchError
  } from "alsatian";
  import { Assert } from "../../src/assert";
import { PropertiesMatcher } from "../../src/matchers";
  
  export class PropertiesMatcherTests {
      @TestCase(true)
      @TestCase(false)
      public setsRootWhenInitial(setsParent: boolean) {
        let p = new PropertiesMatcher({}, null, setsParent);
        Assert(p).maybe(setsParent).has( {
            parent: {
                name: "Assert",
                details: "object"
            }
        } );
      }
  }