import { MatchError } from "alsatian";

import { IPropertiesMatcher } from "./i-properties-matcher";
import { PropertiesMatchError } from "../errors/properties-match-error";
import { NestedPropertiesMatchError } from "../errors/nested-properties-match-error";
import { SubsetPropertyAssertsDict, AllPropertyAssertsDict, ArrayMatchMode, ElementMode, PropertyLambda } from "../types";
import { Assert } from '../assert';
import { EntityMatcher } from "./entity-matcher";
import { IFluentCore } from "./i-fluent-core";
import { INarrowableFluentCore } from "./i-narrowable-fluent-core";
import { FluentMatcherBase } from "./fluent-matcher-base";

/** @inheritDoc */
export class PropertiesMatcher<T>
  extends EntityMatcher<T>
  implements IPropertiesMatcher<T>
{
  constructor(
    protected actualValue: any,
    protected nextValue: any,
    protected invert: boolean
  ) {
    super(actualValue, nextValue, invert);
  }

  /** @inheritDoc */
  public has<K extends keyof T>(selector: (o: T) => T[K]): INarrowableFluentCore<T, T[K]>;
  public has(keys: string[]): IFluentCore<T>;
  public has(subsetDict: SubsetPropertyAssertsDict<T>): IFluentCore<T>;
  public has(
    something: any
  ): IFluentCore<T>
  {
    if (something instanceof Function) {
      return this.hasProperty(something);
    } else if (typeof something === "string") {
      return this.hasProperty(o => o[something]);
    } else {
      this._properties(this.actualValue, <any>something, []);
    }

    this.setFluentState(this.actualValue, null, false);
    return <any>this;
  }

  /** @inheritDoc */
  public hasProperties(
    dict: SubsetPropertyAssertsDict<T>
  ): IFluentCore<T> {
    this._properties(this.actualValue, dict, []);

    this.setFluentState(this.actualValue, null, false);
    return <any>this;
  }

  /** @inheritDoc */
  public hasAll(
    dict: AllPropertyAssertsDict<T>
  ): IFluentCore<T> {
    this._properties(this.actualValue, dict, []);

    this.setFluentState(this.actualValue, null, false);
    return <any>this;
  }

  /** @inheritDoc */
  public hasKeys<K extends keyof T>(
    expectedKeys: Array<K>
  ): IFluentCore<T> {
    if (!this.actualValue) {
      throw new MatchError("should be defined.");
    }

    if (!expectedKeys.every(k => typeof this.actualValue[k] !== "undefined")) {
      throw new MatchError(
        "does not contain all",
        expectedKeys,
        this.actualValue
      );
    }

    this.setFluentState(this.actualValue, null, false);
    return <any>this;
  }

  /** @inheritDoc */
  public hasElements(
    expected: Array<any>,
    matchMode: ArrayMatchMode = ArrayMatchMode.contains,
    elMode: ElementMode = ElementMode.interpretive
  ): IFluentCore<Array<any>> {
    if (!(this.actualValue instanceof Array)) {
      throw new MatchError("not an array type", expected, this.actualValue);
    }

    if (!expected.every(e => this.actualValue.indexOf(e) > -1)) {
      throw new MatchError("does not contain all", expected, this.actualValue);
    }

    this.setFluentState(this.actualValue, null, false);
    return <any>this;
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
    this.assertNestedPropertiesDefined(actualObject, expectedObject, path);
    const keys = Object.keys(expectedObject);
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
  ) {
    if (typeof actualObject === "undefined" || actualObject === null) {
      if (path.length > 0) {
        throw new MatchError(
          `property '${
            path[path.length - 1]
          }' should be defined at path '${this.formatKeyPath(path)}'`
        );
      } else {
        throw new MatchError("should be defined.");
      }
    }
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
      Object.keys(expected as any).length > 0
    ) {
      this._properties(actual, expected, curPath);
    } else if (this.checkInvert(expected !== actual)) {
      throw new MatchError(
        `property ${k} at path '${this.formatKeyPath(curPath)}' should${
          this.negation
        }equal`,
        expected,
        actual
      );
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
        "failed nested expectation",
        this.formatKeyPath(path),
        err
      );
    } else {
      throw new NestedPropertiesMatchError(
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
    if (typeof check === "boolean" && this.checkInvert(!check)) {
      throw new PropertiesMatchError(
        `failed ${this.invert ? "(inverted) " : " "}boolean lambda assertion`,
        this.formatKeyPath(path),
        this.getFnString(assertion),
        actual
      );
    } else if (this.invert) {
      throw new PropertiesMatchError(
        "expected lambda to return false, or yield a failed nested expectation or error",
        this.formatKeyPath(path),
        this.getFnString(assertion),
        actual
      );
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
      if (this.checkInvert(actual.toString() !== regexp.toString())) {
        throw new MatchError(
          `regular expressions at path '${kpath}' should${this.negation}match`,
          regexp,
          actual
        );
      }
    } else if (typeof actual !== "string") {
      throw new MatchError(
        `expected type 'string' for regexp match at path '${kpath}'`,
        "string",
        typeof actual
      );
    } else if (this.checkInvert(!regexp.test(actual))) {
      throw new MatchError(
        `regular expression at path '${kpath}' should${this.negation}match`,
        regexp.toString(),
        actual
      );
    }
  }
}
