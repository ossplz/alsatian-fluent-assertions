import { MatchError } from "alsatian";

import { IPropertiesMatcher } from "./i-properties-matcher";
import { NestedPropertiesMatchError } from "../errors/nested-properties-match-error";
import { SubsetPropertyAssertsDict, AllPropertyAssertsDict, ArrayMatchMode, ElementMode, PropertyLambda } from "../types";
import { SimpleMatcher } from "./simple-matcher";
import { IFluentCore } from "./i-fluent-core";
import { INarrowableFluentCore } from "./i-narrowable-fluent-core";
import { FluentMatcherBase } from "./fluent-matcher-base";

/** @inheritDoc */
export class PropertiesMatcher<T>
  extends SimpleMatcher<T>
  implements IPropertiesMatcher<T>
{
  constructor(
    actualValue: any,
    nextValue: any,
    initial: boolean = false
  ) {
    super(actualValue, nextValue, initial);
  }

  /** @inheritDoc */
  public has<K extends keyof T>(selector: (o: T) => T[K]): INarrowableFluentCore<T, T[K]>;
  public has(keys: string[]): IFluentCore<T>;
  public has(subsetDict: SubsetPropertyAssertsDict<T>): IFluentCore<T>;
  public has(
    something: any
  ): IFluentCore<T>
  {
    this.setCurrentNode(this.has.name, typeof(something));
    if (something instanceof Function) {
      return this.hasProperty(something);
    } else if (typeof something === "string") {
      return this.hasProperty(o => o[something]);
    } else {
      this._properties(this.actualValue, <any>something, []);
    }

    return this.setFluentState(this.actualValue, null, false);
  }

  /** @inheritDoc */
  public hasProperties(
    dict: SubsetPropertyAssertsDict<T>
  ): IFluentCore<T> {
    this.setCurrentNode(this.hasProperties.name, null);
    this._properties(this.actualValue, dict, []);

    return this.setFluentState(this.actualValue, null, false);
  }

  /** @inheritDoc */
  public hasAll(
    dict: AllPropertyAssertsDict<T>
  ): IFluentCore<T> {
    this.setCurrentNode(this.hasAll.name, null);
    this._properties(this.actualValue, dict, []);

    return this.setFluentState(this.actualValue, null, false);
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
    matchMode: ArrayMatchMode = ArrayMatchMode.contains,
    elMode: ElementMode = ElementMode.interpretive
  ): IFluentCore<Array<any>> {
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

  protected _properties(
    actualObject: any,
    expectedObject: any,
    path: Array<string>
  ): void {
    let notDefined = !this.assertNestedPropertiesDefined(actualObject, expectedObject, path);
    const keys = Object.keys(expectedObject);
    if (this.maybeInvert(false) && notDefined) {
      return;
    }

    /*tslint:disable:forin*/
    for (const i in keys) {
      /*tslint:enable:forin*/
      const k: keyof T = keys[i] as any;
      const curPath = path.slice(0); // clone
      curPath.push(k);
      const expected = expectedObject[k];
      const actual = actualObject[k];
      this.assertPropertyByType(k, actual, expected, curPath);
    }
  }

  protected assertNestedPropertiesDefined(
    actualObject: any,
    expectedObject: any,
    path: Array<string>
  ): boolean {
    if (typeof actualObject === "undefined" || actualObject === null) {
      if (this.maybeInvert(true) && path.length > 0) {
        let prop = path[path.length - 1];
        let fpath = this.formatKeyPath(path);
        let msg = `property '${prop}' should be defined at path '${fpath}'`
        this.specError(msg, undefined, undefined);
      }

      if (path.length === 0) {
        this.specError("expected object should be defined", undefined, undefined);
      }

      return false;
    }

    return true;
  }

  protected assertPropertyByType(
    k: any,
    actual: any,
    expected: any,
    curPath: Array<string>
  ) {
    if (typeof expected === "function") {
      this.assertFnProperty(
        k,
        expected as PropertyLambda<T[keyof T]>,
        actual,
        curPath
      );
    } else if (expected instanceof RegExp) {
      this.assertRegExpProperty(k, expected, actual, curPath);
    } else if (
      typeof expected === "object" &&
      Object.keys(expected as any).length > 0 // not a no-op
    ) {
      this._properties(actual, expected, curPath);
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
    assertion: PropertyLambda<T[TKey]>,
    actual: T[TKey],
    path: Array<string>
  ): void {
    let check = null;
    try {
      check = assertion(actual);
    } catch (err) {
      this.failFnError(err, path);
    }

    this.assertFnBoolean(check, assertion, actual, path);
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
    assertion: PropertyLambda<T[TKey]>,
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
