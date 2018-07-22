import { Assert } from "../../src/assert";
import { Test } from "alsatian";
import { PropertiesMatcherWithHelpers } from "../../src/matchers";

export class NamingConventionsTests {
  @Test("Public API should be camel case beginning with a lower case letter.")
  public publicApiAllCamelCase() {
    const assertObject = Assert(1);
    let proto = Object.getPrototypeOf(assertObject);
    const omittedNames: string[] = ["constructor", "that"];
    const names: string[] = [];
    do {
        Object
            .getOwnPropertyNames(proto)
            .filter(n => ! n.startsWith("_"))
            .filter(n => ! (omittedNames.indexOf(n) > -1))
            .filter(n => proto[n] instanceof Function)
            .map(n => names.push(n));
        proto = Object.getPrototypeOf(proto);
    } while(proto);

    Assert(names)
        .allSatisfy(n => /[a-z][a-zA-Z0-9_]*/.test(n));
  }
}
