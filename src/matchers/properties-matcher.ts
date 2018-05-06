import { MatchError } from "alsatian";

import { IPropertiesMatcher } from "./i-properties-matcher";
import { NestedPropertiesMatchError } from "../errors/nested-properties-match-error";
import {
  SubsetPropertyAssertsDict,
  AllPropertyAssertsDict,
  PropertyLambda,
  LocationMode,
  MatchMode,
  SubsetPropertyDict,
  SubsetPropertyLiteralsDict,
  AllPropertyDict,
  AllPropertyLiteralsDict
} from "../types";
import { IFluentCore } from "./i-fluent-core";
import { INarrowableFluentCore } from "./i-narrowable-fluent-core";
import { FluentMatcherBase } from "./fluent-matcher-base";
import { PropertyAssertsLambda } from "../types/property-asserts-lambda";
import { ElementsMatcher } from "./elements-matcher";

export class PropertiesMatcher<T> extends ElementsMatcher<T>
  implements IPropertiesMatcher<T> {
  constructor(actualValue: any, nextValue: any, initial: boolean) {
    super(actualValue, nextValue, initial);
  }

  public hasProperties(
    expected: SubsetPropertyDict<T>,
    matchMode?: MatchMode.normal
  ): IFluentCore<T>;

  public hasProperties(
    expected: SubsetPropertyLiteralsDict<T>,
    matchMode: MatchMode.literal
  ): IFluentCore<T>;

  public hasProperties(
    expected: SubsetPropertyAssertsDict<T>,
    matchMode: MatchMode.asserts
  ): IFluentCore<T>;
  public hasProperties(
    expected: any,
    mode: MatchMode = MatchMode.normal
  ): IFluentCore<T> {
    this.setCurrentNode(this.hasProperties.name, null);
    this._properties(this.actualValue, expected, [], mode);

    return this.generateFluentState(this.actualValue, null, false);
  }

  public hasAll(
    expected: AllPropertyDict<T>,
    matchMode?: MatchMode.normal
  ): IFluentCore<T>;

  public hasAll(
    expected: AllPropertyLiteralsDict<T>,
    matchMode: MatchMode.literal
  ): IFluentCore<T>;

  public hasAll(
    expected: AllPropertyAssertsDict<T>,
    matchMode: MatchMode.asserts
  ): IFluentCore<T>;
  public hasAll(
    expected: any,
    mode: MatchMode = MatchMode.normal
  ): IFluentCore<T> {
    this.setCurrentNode(this.hasAll.name, null);
    this._properties(this.actualValue, expected, [], mode);

    return this.generateFluentState(this.actualValue, null, false);
  }

  public hasKeys<K extends keyof T>(expectedKeys: Array<K>): IFluentCore<T> {
    this.setCurrentNode(this.hasKeys.name, null);
    if (this.nullOrUndefined(this.actualValue)) {
      if ( !this.invertedContext ) {
        this.specError(`should be defined`, undefined, undefined);
      }

      return; // .not.hasKeys always passes when target not defined.
    }

    if (!(expectedKeys instanceof Array)) {
      this.specError(
        `param expectedKeys should be an array type`,
        "[an array type]",
        this.id(expectedKeys)
      );
    }

    if (this.maybeInvert(!expectedKeys.every(k => typeof this.actualValue[k] !== "undefined"))) {
      this.specError(
        `should${this.negation}contain all`,
        expectedKeys,
        this.actualValue
      );
    }

    return this.generateFluentState(this.actualValue, null, false);
  }

  // tslint:disable-next-line
  /** Asserts that the actual has the expected properties (recursive). */
  protected _properties(
    actualObject: any,
    expectedObject: any,
    path: Array<string>,
    mode: MatchMode
  ): void {
    const notDefined = !this._assertNestedPropertiesDefined(
      actualObject,
      expectedObject,
      path
    );
    if (this.invertedContext && notDefined) {
      // notDefined when inverted is the same as saying, "it doesn't have these properties,"
      // so return without error.
      return;
    }

    const keys = Object.keys(expectedObject);
    /*tslint:disable:forin*/
    for (const i in keys) {
      /*tslint:enable:forin*/
      const k: keyof T = keys[i] as any;
      const curPath = path.slice(0); // clone
      curPath.push(k);
      const expected = expectedObject[k];
      const actual = actualObject[k];
      this._assertPropertyByType(k, actual, expected, curPath, mode);
    }
  }

  protected _assertNestedPropertiesDefined(
    actualObject: any,
    expectedObject: any,
    path: Array<string>
  ): boolean {
    if (this.nullOrUndefined(actualObject)) {
      this._throwIfUnnecessarilyUndefined(actualObject, expectedObject, path);
      return false;
    }

    return true;
  }

  // tslint:disable-next-line
  /** Only throws if undefined props/obj isn't warranted. */
  protected _throwIfUnnecessarilyUndefined(
    actualObject: any,
    expectedObject: any,
    path: Array<string>
  ): void {
    // throw iff an undefined property isn't simply satisfying a prior negation (e.g., not.has()).
    if (!this.invertedContext) {
      if (path.length > 0) {
        const prop = path[path.length - 1];
        const fpath = this.formatKeyPath(path);
        const msg = `property '${prop}' should be defined at path '${fpath}'`;
        this.specError(msg, undefined, undefined);
      } else {
        this.specError("expected object should be defined", undefined, undefined);        
      }
    }
  }

  protected _assertPropertyByType(
    k: any,
    actual: any,
    expected: any,
    curPath: Array<string>,
    mode: MatchMode
  ) {
    if (typeof expected === "function") {
      this._assertFnProperty(
        k,
        expected as PropertyLambda<T[keyof T]>,
        actual,
        curPath,
        mode
      );
    } else if (expected instanceof RegExp) {
      this._assertRegExpProperty(k, expected, actual, curPath);
    } else if (
      typeof expected === "object" &&
      Object.keys(expected as any).length > 0 // not a no-op
    ) {
      this._properties(actual, expected, curPath, mode);
    } else if (this.maybeInvert(expected !== actual)) {
      const fpath = this.formatKeyPath(curPath);
      const msg = `property ${k} at path '${fpath}' should${
        this.negation
      }equal`;
      this.specError(msg, expected, actual);
    }
  }

  protected formatKeyPath(path: Array<string>): string {
    path.unshift("$");
    return path.join(".");
  }

  // tslint:disable-next-line
  /**
   * A properties assertion function can fail by falsy return value, or by
   * throwing an error (perhaps from nested assertions).
   */
  protected _assertFnProperty<TKey extends keyof T>(
    key: TKey,
    assertion: PropertyLambda<T[TKey]> | PropertyAssertsLambda<T[TKey]>,
    actual: T[TKey],
    path: Array<string>,
    matchMode: MatchMode
  ): void {
    let check = null;
    try {
      if (matchMode === MatchMode.asserts) {
        check = (assertion as PropertyAssertsLambda<T[TKey]>)(
          this.wrap(actual)
        );
        if (typeof check === "boolean") {
          this._assertFnBoolean(check, assertion, actual, path);
        }
      } else {
        check = (assertion as PropertyLambda<T[TKey]>)(actual);
        this._assertFnBoolean(check, assertion, actual, path);
      }
    } catch (err) {
      this._failFnError(err, path);
    }
  }

  protected _failFnError(err: Error, path: Array<string>) {
    if (err instanceof MatchError) {
      throw new NestedPropertiesMatchError(
        this,
        "failed nested expectation",
        this.formatKeyPath(path),
        err
      );
    } else {
      throw new NestedPropertiesMatchError(
        this,
        "threw unexpected error",
        this.formatKeyPath(path),
        err
      );
    }
  }

  protected _assertFnBoolean<TKey extends keyof T>(
    check: any,
    assertion: PropertyLambda<T[TKey]> | PropertyAssertsLambda<T[TKey]>,
    actual: T[TKey],
    path: Array<string>
  ) {
    const fpath = this.formatKeyPath(path);
    let msg = `Property at path '${fpath}': `;
    if (typeof check === "boolean" && this.maybeInvert(!check)) {
      (msg = msg + `should${this.negation}satisfy lambda assertion`),
        this.specError(msg, this.getFnString(assertion), actual);
    } else if (this.invert) {
      (msg =
        msg +
        "expected lambda to return false, or yield a failed nested expectation or error"),
        this.specError(msg, this.getFnString(assertion), actual);
    }
  }

  protected _assertRegExpProperty<TProp>(
    key: keyof T,
    regexp: RegExp,
    actual: TProp,
    path: Array<string>
  ): void {
    const kpath: string = this.formatKeyPath(path);
    if (actual instanceof RegExp) {
      if (this.maybeInvert(actual.toString() !== regexp.toString())) {
        const msg = `regular expressions at path '${kpath}' should${
          this.negation
        }be equal`;
        this.specError(msg, this.id(regexp), this.id(actual));
      }
    } else if (typeof actual !== "string") {
      const msg = `expected type 'string' for regexp match at path '${kpath}'`;
      this.specError(msg, "string", typeof actual);
    } else if (this.maybeInvert(!regexp.test(actual))) {
      const msg = `regular expression at path '${kpath}' should${
        this.negation
      }match`;
      this.specError(msg, this.id(regexp), actual);
    }
  }
}
