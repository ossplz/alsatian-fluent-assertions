import { Test, TestCase, Any, MatchError } from "alsatian";
import { Assert } from "../../src/assert";
import { BaseSpec } from "../../src/base-spec";

class SomeClass {
  public prop: string = "   3   ";
}

export class ConfigurationTests extends BaseSpec {
  @Test()
  public errorPaths_validForRealExample() {
    //const 
  }
}