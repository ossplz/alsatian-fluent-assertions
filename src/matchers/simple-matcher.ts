import deepEqual = require("deep-equal");
import { MatchError } from "alsatian";

import { SpecError } from "../errors";
import { ISimpleMatcher } from "./i-simple-matcher";
import { EqType } from "../types/eq-types";
import { IFluentCore } from "./i-fluent-core";
import { INarrowableFluentCore } from "./i-narrowable-fluent-core";
import { Operators } from "./operators";
import { PropertiesMatcher } from "./properties-matcher";

/** @inheritDoc */
export class SimpleMatcher<T>
  extends Operators<T, any>
  implements ISimpleMatcher<T> {

  constructor(
    actualValue: any,
    nextValue: any,
    initial: boolean
  ) {
    super(actualValue, nextValue, initial);
  }

  /** @inheritDoc */
  public equals(
    expected: T,
    eqType: EqType = EqType.strictly
  ): IFluentCore<T> {
    this.setCurrentNode(this.equals.name, typeof (expected) + ", " + eqType);
    switch (eqType) {
      case EqType.strictly:
        return this.strictlyEquals(expected);
      case EqType.loosely:
        return this.looselyEquals(expected);
      case EqType.deepLoosely:
        return this.deepLooselyEquals(expected);
      case EqType.deepStrictly:
        return this.deepStrictlyEquals(expected);
      default:
        this.specError(`Unrecognized EqType: ${eqType}.`, undefined, undefined);
    }
  }

  /** @inheritDoc */
  public strictlyEquals(expected: T): IFluentCore<T> {
    this.setCurrentNode(this.strictlyEquals.name, typeof (expected));
    if (this.maybeInvert(this.actualValue !== expected)) {
      this.specError("should strictly (===) equal", expected, this.actualValue);
    }

    return this.setFluentState(this.actualValue, null, false);
  }

  /** @inheritDoc */
  public looselyEquals(expected: T): IFluentCore<T> {
    this.setCurrentNode(this.looselyEquals.name, typeof (expected));
    /*tslint:disable:triple-equals*/
    if (this.maybeInvert(this.actualValue != expected)) {
      /*tslint:enable:triple-equals*/
      this.specError("should loosely (==) equal", expected, this.actualValue);
    }

    return this.setFluentState(this.actualValue, null, false);
  }

  /** @inheritDoc */
  public deeplyEquals(
    expected: T,
    eqType: EqType.strictly | EqType.loosely = EqType.strictly
  ): IFluentCore<T> {
    this.setCurrentNode(this.deeplyEquals.name, typeof (expected) + ", " + eqType);
    const equal = this._deeplyEquals(this.actualValue, expected, eqType);
    if (this.maybeInvert(!equal)) {
      this.specError(`should${this.negation}deeply equal (${eqType})`, expected, this.actualValue);
    }

    return this.setFluentState(this.actualValue, null, false);
  }

  /** @inheritDoc */
  public deepStrictlyEquals(expected: T): IFluentCore<T> {
    this.setCurrentNode(this.deepStrictlyEquals.name, typeof (expected));
    return this.deeplyEquals(expected, EqType.strictly);
  }

  /** @inheritDoc */
  public deepLooselyEquals(expected: T): IFluentCore<T> {
    this.setCurrentNode(this.deepLooselyEquals.name, typeof (expected));
    return this.deeplyEquals(expected, EqType.loosely);
  }

  /** @inheritDoc */
  public isDefined(): IFluentCore<T> {
    this.setCurrentNode(this.isDefined.name, null);
    if (this.maybeInvert(typeof this.actualValue === "undefined")) {
      this.specError(`should${this.negation}be defined`, undefined, undefined);
    }

    return this.setFluentState(this.actualValue, null, false);

  }

  /** @inheritDoc */
  public matches(matcher: RegExp): IFluentCore<string> {
    this.setCurrentNode(this.matches.name, matcher.toString());
    this._match(matcher);

    return this.setFluentState(this.actualValue, null, false);

  }

  /** @inheritDoc */
  public hasMatch(
    matcher: RegExp
  ): INarrowableFluentCore<T, Array<string>> {
    this._match(matcher);
    this.setCurrentNode(this.hasMatch.name, matcher.toString());
    const matches = this.actualValue.match(matcher);
    return this.setFluentState(this.actualValue, matches, false);

  }

  /** @inheritDoc */
  public throws(): INarrowableFluentCore<T, Error>;
  /** @inheritDoc */
  public throws<TError extends Error>(errorType?: {
    new(...args: Array<any>): TError;
  }): INarrowableFluentCore<T, TError> {
    this.setCurrentNode(this.throws.name, errorType ? typeof errorType : null);
    let threw: TError = null;
    try {
      this.actualValue();
    } catch (err) {
      threw = err;
    }
    this._assertThrew(threw, errorType);
    return this.setFluentState(this.actualValue, threw, false);
  }

  public async throwsAsync(): Promise<INarrowableFluentCore<T, Error>>;
  public async throwsAsync<TError extends Error>(errorType?: {
    new(...args: Array<any>): TError;
  }): Promise<INarrowableFluentCore<T, TError>> {
    this.setCurrentNode(this.throwsAsync.name, errorType ? typeof errorType : null);
    let threw: TError = null;
    try {
      // make sure its a promise and wait.
      await Promise.resolve(this.actualValue());
    } catch (err) {
      threw = err;
    }
    this._assertThrew(threw, errorType);
    return this.setFluentState(this.actualValue, threw, false);
  }

  /** @inheritDoc */
  public satisfies(predicate: (t: T) => boolean): IFluentCore<T> {
    this.setCurrentNode(this.satisfies.name, null);
    if (this.maybeInvert(!predicate(this.actualValue))) {
      this.specError(`should${this.negation}match lambda`, this.getFnString(predicate), this.actualValue);
    }

    return this.setFluentState(this.actualValue, null, false);
  }

  /** @inheritDoc */
  public is(expectedType: {
    new(...args: any[]): any;
  }): IFluentCore<T> {
    let eActualName = (expectedType || <any>{}).name;
    this.setCurrentNode(this.is.name, eActualName);
    if (typeof expectedType !== "function") {
      throw new TypeError(`Expected type 'function' for instance check, but got type '${typeof expectedType}'.`);
    }

    if (this.maybeInvert(!(this.actualValue instanceof expectedType))) {
      let ename = eActualName || `(Unnamed type; JS type: ${typeof expectedType})`;
      let aname = this.actualValue.name || `(Unnamed type; JS type: ${typeof this.actualValue})`;
      this.specError(`should${this.negation}be of type`, ename, aname);
    }

    return this.setFluentState(this.actualValue, null, false);
  }

  /** @inheritDoc */
  public hasProperty<R>(selector: (t: T) => R): INarrowableFluentCore<T, R> {
    this.setCurrentNode(this.hasProperty.name, null);
    if (!(selector instanceof Function)) {
      this.specError("Provided selector was not a function.", undefined, undefined);
    }

    const selected = selector(this.actualValue);

    if (this.maybeInvert(typeof selected === "undefined")) {
      let fn = this.getFnString(selector);
      this.specError(`should${this.negation}be defined`, fn, this.actualValue);
    }

    return this.setFluentState(this.actualValue, selected, false);
  }

  /** @inheritDoc */
  public hasSingle(): T extends any[] ? INarrowableFluentCore<T, T[0]> : void {
    this.setCurrentNode(this.hasSingle.name, null);
    if (!(this.actualValue instanceof Array || typeof this.actualValue === "string")) {
      throw new TypeError("Expected type is not an array or string.");
    }
    if (this.maybeInvert(this.actualValue.length !== 1)) {
      this.specError(`should${this.negation}have single element or character`, "single element", this.actualValue);
    }

    return <any>this.setFluentState(this.actualValue, this.actualValue[0], false);
  }

  /** @inheritDoc */
  public isEmpty(): IFluentCore<T> {
    this.setCurrentNode(this.isEmpty.name, null);
    if (!(typeof this.actualValue === "object" || typeof this.actualValue === "string")) {
      throw new TypeError("Expected type is not an array, string, or object.");
    }

    const isObject = !(typeof this.actualValue === "string" || this.actualValue instanceof Array);
    let length: number;
    if (isObject) {
      length = Object.keys(this.actualValue).length;
    } else {
      length = this.actualValue.length;
    }

    if (this.maybeInvert(length !== 0)) {
      this.specError(`should${this.negation}be empty`, "[an empty array, string, or object]", this.actualValue);
    }

    return this.setFluentState(this.actualValue, null, false);
  }

  /** @inheritDoc */
  public isTruthy(): IFluentCore<T> {
    return this._assertBooly(!this.actualValue, this.isTruthy.name, "truthy")
  }

  /** @inheritDoc */
  public isFalsy(): IFluentCore<T> {
    return this._assertBooly(!!this.actualValue, this.isFalsy.name, "falsy")
  }

  /** @inheritDoc */
  public converted<R>(lambda: (v: T) => R): IFluentCore<R> {
    this.setCurrentNode(this.converted.name, `${!!this.actualValue}`);
    if (typeof lambda !== "function") {
      throw new TypeError(`Given value is not a function, but a ${typeof lambda}.`);
    }

    let r = lambda(this.actualValue);
    return this.setFluentState(r, null, false);
  }

  private _assertBooly(val: boolean, name: string, expVal: string): IFluentCore<T> {
    this.setCurrentNode(this.isFalsy.name, `${!!this.actualValue}`);
    if (this.maybeInvert(val)) {
      this.specError(`should${this.negation}be ${expVal}`, `[any ${expVal} value]`, this.actualValue);
    }

    return this.setFluentState(this.actualValue, null, false);
  }

  protected _assertThrew<TError extends Error>(
    threw: Error,
    errorType?: {
      new(...args: Array<any>): TError;
    }) {
    if (this.maybeInvert(!threw)) {
      const expMsg = this.maybeInvert(false) ? "[no error thrown]" : (errorType || Error).name;
      this.specError(`should${this.negation}throw`, expMsg, this.formatShortError(threw));
    } else if (
      typeof errorType !== "undefined" &&
      this.maybeInvert(!(threw instanceof errorType))
    ) {
      this.specError(`should${this.negation}throw type ${errorType} but threw ${threw}`, errorType.name, this.formatShortError(threw));
    }
  }

  /** Convert to lib's deep equals. */
  protected _deeplyEquals(
    actual: T,
    expected: T,
    eqType: EqType.strictly | EqType.loosely
  ): boolean {
    return deepEqual(expected, actual, {
      strict: eqType === EqType.strictly
    });
  }

  private _match(matcher: RegExp): void {
    if (typeof this.actualValue !== "string") {
      throw new MatchError("actual value type was not a string");
    }

    if (this.maybeInvert(!matcher.test(this.actualValue))) {
      this.specError(`should${this.negation}match`, matcher.toString(), this.actualValue);
    }
  }
}
