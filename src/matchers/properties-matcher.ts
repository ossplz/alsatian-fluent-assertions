import { MatchError } from "alsatian";

import { IPropertiesMatcher } from "./i-properties-matcher";
import { NestedPropertiesMatchError } from "../errors/nested-properties-match-error";
import { SubsetPropertyAssertsDict, AllPropertyAssertsDict, PropertyLambda, LocationMode, MatchMode, SubsetPropertyDict, SubsetPropertyLiteralsDict, AllPropertyDict, AllPropertyLiteralsDict } from "../types";
import { SimpleMatcher } from "./simple-matcher";
import { IFluentCore } from "./i-fluent-core";
import { INarrowableFluentCore } from "./i-narrowable-fluent-core";
import { FluentMatcherBase } from "./fluent-matcher-base";
import { PropertyAssertsLambda } from "../types/property-asserts-lambda";

/** @inheritDoc */
export class PropertiesMatcher<T>
  extends SimpleMatcher<T>
  implements IPropertiesMatcher<T>
{
  constructor(
    actualValue: any,
    nextValue: any,
    initial: boolean
  ) {
    super(actualValue, nextValue, initial);
  }

  /** @inheritDoc */
  public has<K extends keyof T>(selector: (o: T) => T[K]): INarrowableFluentCore<T, T[K]>;
  /** @inheritDoc */
  public has<K extends keyof T>(key: K): INarrowableFluentCore<T, T[K]>;
  /** @inheritDoc */
  public has<T2 extends any[]>(expected: T2, location?: LocationMode, match?: MatchMode): IFluentCore<T>;
  /** @inheritDoc */
  public has(subsetDict: SubsetPropertyDict<T>, matchMode?: MatchMode.normal): IFluentCore<T>;
  /** @inheritDoc */
  public has(subsetDict: SubsetPropertyLiteralsDict<T>, matchMode: MatchMode.literal): IFluentCore<T>;
  /** @inheritDoc */
  public has(subsetDict: SubsetPropertyAssertsDict<T>, matchMode: MatchMode.asserts): IFluentCore<T>;
  public has(
    expected: any,
    option1?: LocationMode | MatchMode,
    option2?: MatchMode
  ): IFluentCore<T>
  {
    this.setCurrentNode(this.has.name, typeof(expected));
    if (expected instanceof Array) {
      return this.hasElements(expected, <LocationMode> option1, option2);
    } else if (expected instanceof Function) {
      return this.hasProperty(expected);
    } else if (typeof expected === "string") {
      return this.hasProperty(o => o[expected]);
    } else {
      this.hasProperties(expected);
    }

    return this.setFluentState(this.actualValue, null, false);
  }

  /** @inheritDoc */
  public hasProperties(expected: SubsetPropertyDict<T>, matchMode?: MatchMode.normal): IFluentCore<T>;
  /** @inheritDoc */
  public hasProperties(expected: SubsetPropertyLiteralsDict<T>, matchMode: MatchMode.literal): IFluentCore<T>;
  /** @inheritDoc */
  public hasProperties(expected: SubsetPropertyAssertsDict<T>, matchMode: MatchMode.asserts): IFluentCore<T>;
  public hasProperties(
    expected: any,
    mode: MatchMode = MatchMode.normal
  ): IFluentCore<T> {
    this.setCurrentNode(this.hasProperties.name, null);
    this._properties(this.actualValue, expected, [], mode);

    return this.setFluentState(this.actualValue, null, false);
  }

  /** @inheritDoc */
  public hasAll(expected: AllPropertyDict<T>, matchMode?: MatchMode.normal): IFluentCore<T>;
  /** @inheritDoc */
  public hasAll(expected: AllPropertyLiteralsDict<T>, matchMode: MatchMode.literal): IFluentCore<T>;
  /** @inheritDoc */
  public hasAll(expected: AllPropertyAssertsDict<T>, matchMode: MatchMode.asserts): IFluentCore<T>;
  public hasAll(
    expected: any,
    mode: MatchMode = MatchMode.normal
  ): IFluentCore<T> {
    this.setCurrentNode(this.hasAll.name, null);
    this._properties(this.actualValue, expected, [], mode);

    return this.setFluentState(this.actualValue, null, false);
  }

  /** @inheritDoc */
  public hasAsserts<T2 extends any[]>(expected: T2, location?: LocationMode): IFluentCore<T>;
  /** @inheritDoc */
  public hasAsserts(expected: SubsetPropertyAssertsDict<T>): IFluentCore<T>;
  public hasAsserts(
    expected: any,
    location?: LocationMode
  ): IFluentCore<T> {
    this.setCurrentNode(this.hasAsserts.name, typeof expected);
    if (expected instanceof Array) {
      return this.hasElements(expected, location, MatchMode.asserts);
    }

    this._properties(this.actualValue, expected, [], MatchMode.asserts);
    return this.setFluentState(this.actualValue, null, false);
  }


  /** @inheritDoc */
  public hasAllAsserts(expected: AllPropertyAssertsDict<T>): IFluentCore<T> {
    this.setCurrentNode(this.hasAllAsserts.name, null);
    return this.hasAsserts(expected);
  }

  /** @inheritDoc */
  public hasKeys<K extends keyof T>(
    expectedKeys: Array<K>
  ): IFluentCore<T> {
    this.setCurrentNode(this.hasKeys.name, null);
    if (!this.actualValue) {
      this.specError(`should be defined`, undefined, undefined);
    }

    if (!expectedKeys.every(k => typeof this.actualValue[k] !== "undefined")) {
      this.specError(`should${this.negation}contain all`, expectedKeys, this.actualValue);
    }

    return this.setFluentState(this.actualValue, null, false);
  }

  /** @inheritDoc */
  public hasElements(
    expected: Array<any>,
    matchMode: LocationMode = LocationMode.contains,
    elMode: MatchMode = MatchMode.normal
  ): IFluentCore<T> {
    this.setCurrentNode(this.hasElements.name, `${matchMode}, ${elMode}`);
    if (!(this.actualValue instanceof Array)) {
      this.specError("not an array type", expected, this.actualValue);
    }

    if (!expected.every(e => this.actualValue.indexOf(e) > -1)) {
      this.specError(`should${this.negation}contain all`, expected, this.actualValue);
    }

    return this.setFluentState(this.actualValue, null, false);
  }

  /*  public allPairs<K extends keyof T>(
    predicate: (k: K, v: T[K], i?: number) => boolean
  ): FluentPropertiesMatcherNext<T, TParent> {
    return new FluentPropertiesMatcherNext(this.actualValue, this.parent);
  }

  public all<T2 extends Array<any>>(
    predicate: (el: T2, i?: number) => boolean
  ): FluentPropertiesMatcherNext<T, TParent> {
    return new FluentPropertiesMatcherNext(this.actualValue, this.parent);
  }

  public anyPairs<K extends keyof T>(
    predicate: (k: K, v: T[K], i?: number) => boolean
  ): FluentPropertiesMatcherNext<T, TParent> {
    return new FluentPropertiesMatcherNext(this.actualValue, this.parent);
  }

  public any(
    predicate: (t: T) => boolean
  ): FluentPropertiesMatcherNext<T, TParent> {
    return new FluentPropertiesMatcherNext(this.actualValue, this.parent);
  } */

  /** Asserts that the actual has the expected properties (recursive). */
  protected _properties(
    actualObject: any,
    expectedObject: any,
    path: Array<string>,
    mode: MatchMode
  ): void {
    let notDefined = !this.assertNestedPropertiesDefined(actualObject, expectedObject, path);
    if (this.maybeInvert(false) && notDefined) {
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
      this.assertPropertyByType(k, actual, expected, curPath, mode);
    }
  }

  protected assertNestedPropertiesDefined(
    actualObject: any,
    expectedObject: any,
    path: Array<string>
  ): boolean {
    if (typeof actualObject === "undefined" || actualObject === null) {
      this.throwIfUnnecessarilyUndefined(actualObject, expectedObject, path);
      return false;
    }

    return true;
  }

  /** Only throws if undefined props/obj isn't warranted. */
  protected throwIfUnnecessarilyUndefined(
    actualObject: any,
    expectedObject: any,
    path: Array<string>
  ): void {
    // throw iff an undefined property isn't simply satisfying a prior negation (e.g., not.has()).
    if (this.maybeInvert(true) && path.length > 0) {
      let prop = path[path.length - 1];
      let fpath = this.formatKeyPath(path);
      let msg = `property '${prop}' should be defined at path '${fpath}'`
      this.specError(msg, undefined, undefined);
    }

    if (path.length === 0) {
      this.specError("expected object should be defined", undefined, undefined);
    }
  }

  protected assertPropertyByType(
    k: any,
    actual: any,
    expected: any,
    curPath: Array<string>,
    mode: MatchMode
  ) {
    if (typeof expected === "function") {
      this.assertFnProperty(
        k,
        expected as PropertyLambda<T[keyof T]>,
        actual,
        curPath,
        mode
      );
    } else if (expected instanceof RegExp) {
      this.assertRegExpProperty(k, expected, actual, curPath);
    } else if (
      typeof expected === "object" &&
      Object.keys(expected as any).length > 0 // not a no-op
    ) {
      this._properties(actual, expected, curPath, mode);
    } else if (this.maybeInvert(expected !== actual)) {
      let fpath = this.formatKeyPath(curPath);
      let msg = `property ${k} at path '${fpath}' should${this.negation}equal`
      this.specError(msg, expected, actual);
    }
  }

  protected formatKeyPath(path: Array<string>): string {
    path.unshift("$");
    return path.join(".");
  }

  /**
   * A properties assertion function can fail by falsy return value, or by
   * throwing an error (perhaps from nested assertions).
   */
  protected assertFnProperty<TKey extends keyof T>(
    key: TKey,
    assertion: PropertyLambda<T[TKey]> | PropertyAssertsLambda<T[TKey]>,
    actual: T[TKey],
    path: Array<string>,
    matchMode: MatchMode
  ): void {
    let check = null;
    try {
      if (matchMode === MatchMode.asserts) {
        check = (<PropertyAssertsLambda<T[TKey]>>assertion)(this.wrap(actual));
        if (typeof check === "boolean") {
          this.assertFnBoolean(check, assertion, actual, path);
        }
      } else {
        check = (<PropertyLambda<T[TKey]>>assertion)(actual);
        this.assertFnBoolean(check, assertion, actual, path);
      }
    } catch (err) {
      this.failFnError(err, path);
    }
  }

  protected failFnError(err: Error, path: Array<string>) {
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

  protected assertFnBoolean<TKey extends keyof T>(
    check: any,
    assertion: PropertyLambda<T[TKey]> | PropertyAssertsLambda<T[TKey]>,
    actual: T[TKey],
    path: Array<string>
  ) {
    let fpath = this.formatKeyPath(path);
    let msg = `Property at path '${fpath}': `;
    if (typeof check === "boolean" && this.maybeInvert(!check)) {
      msg = msg + `should${this.negation}satisfy lambda assertion`, 
      this.specError(msg, this.getFnString(assertion), actual);
    } else if (this.invert) {
      msg = msg + "expected lambda to return false, or yield a failed nested expectation or error", 
      this.specError(msg, this.getFnString(assertion), actual);
    }
  }

  protected assertRegExpProperty<TProp>(
    key: keyof T,
    regexp: RegExp,
    actual: TProp,
    path: Array<string>
  ): void {
    const kpath: string = this.formatKeyPath(path);
    if (actual instanceof RegExp) {
      if (this.maybeInvert(actual.toString() !== regexp.toString())) {
        let msg = `regular expressions at path '${kpath}' should${this.negation}be equal`;
        this.specError(msg, regexp, actual);
      }
    } else if (typeof actual !== "string") {
      let msg = `expected type 'string' for regexp match at path '${kpath}'`;
      this.specError(msg, "string", typeof actual);
    } else if (this.maybeInvert(!regexp.test(actual))) {
      let msg = `regular expression at path '${kpath}' should${this.negation}match`;
      this.specError(msg, regexp, actual);
    }
  }
}
