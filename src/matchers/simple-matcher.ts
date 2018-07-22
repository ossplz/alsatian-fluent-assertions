import deepEqual = require("deep-equal");
import { MatchError } from "alsatian";

import { SpecError } from "../errors";
import { ISimpleMatcher } from "./i-simple-matcher";
import { EqType } from "../types/eq-types";
import { IFluentCore } from "./i-fluent-core";
import { INarrowableFluentCore } from "./i-narrowable-fluent-core";
import { Operators } from "./operators";
import { PropertiesMatcher } from "./properties-matcher";
import { At, AssertionContext } from "../types";

export class SimpleMatcher<T, TNext, TPrev> extends Operators<T, TNext, TPrev>
  implements ISimpleMatcher<T, TNext, TPrev> {
    constructor(actualValue: any,
      nextValue: any,
      initial: boolean,
      prevCore?: IFluentCore<any, any, any>,
      ctxt?: AssertionContext
    ) {
      super(actualValue, nextValue, initial, prevCore, ctxt);
    }
  

  public contains(expected: T, location: At = At.anywhere): IFluentCore<T, TNext, TPrev> {
    this.setCurrentNode(this.contains.name, location);
    if (typeof expected !== "string") {
      throw new TypeError(`Parameter 'expected' should be a string, but was a ${typeof expected}.`);
    }
    if (typeof this.actualValue !== "string") {
      throw new TypeError(`Actual value should be a string, but was a ${typeof this.actualValue}.`);
    }
    if ([At.anywhere, At.end, At.start].indexOf(location) < 0) {
      throw new TypeError(`Location parameter should be one of: start, end, anywhere. Was: ${location}.`);
    }

    const ops: any = {
      "start": (pos: number) => pos !== 0,
      "end": (pos: number) => pos !== this.actualValue.length - expected.length,
      "anywhere": (pos: number) => pos < 0
    };
    const pos = this.actualValue.indexOf(expected);
    if (this.maybeInvert(ops[location](pos))) {
      this.specError(`should${this.negation}contain string (position: ${location})`, expected, this.actualValue);
    }
    return this.generateFluentState(this.actualValue, null, false);    
  }

  public strictlyEquals(expected: T): IFluentCore<T, TNext, TPrev> {
    this.setCurrentNode(this.strictlyEquals.name, typeof expected);
    if (this.maybeInvert(this.actualValue !== expected)) {
      this.specError("should strictly (===) equal", expected, this.actualValue);
    }

    return this.generateFluentState(this.actualValue, null, false);
  }

  public looselyEquals(expected: T): IFluentCore<T, TNext, TPrev> {
    this.setCurrentNode(this.looselyEquals.name, typeof expected);
    /*tslint:disable:triple-equals*/
    if (this.maybeInvert(this.actualValue != expected)) {
      /*tslint:enable:triple-equals*/
      this.specError("should loosely (==) equal", expected, this.actualValue);
    }

    return this.generateFluentState(this.actualValue, null, false);
  }

  public deeplyEquals(
    expected: T,
    eqType: EqType.strictly | EqType.loosely = EqType.strictly
  ): IFluentCore<T, TNext, TPrev> {
    this.setCurrentNode(
      this.deeplyEquals.name,
      typeof expected + ", " + eqType
    );
    const equal = this._deeplyEquals(this.actualValue, expected, eqType);
    if (this.maybeInvert(!equal)) {
      this.specError(
        `should${this.negation}deeply equal (${eqType})`,
        expected,
        this.actualValue
      );
    }

    return this.generateFluentState(this.actualValue, null, false);
  }

  public deepStrictlyEquals(expected: T): IFluentCore<T, TNext, TPrev> {
    this.setCurrentNode(this.deepStrictlyEquals.name, typeof expected);
    return this.deeplyEquals(expected, EqType.strictly);
  }

  public deepLooselyEquals(expected: T): IFluentCore<T, TNext, TPrev> {
    this.setCurrentNode(this.deepLooselyEquals.name, typeof expected);
    return this.deeplyEquals(expected, EqType.loosely);
  }

  public isDefined(): IFluentCore<T, TNext, TPrev> {
    this.setCurrentNode(this.isDefined.name, null);
    if (this.maybeInvert(typeof this.actualValue === "undefined")) {
      this.specError(`should${this.negation}be defined`, `${this.negation}defined`, `${this.actualValue}`);
    }

    return this.generateFluentState(this.actualValue, null, false);
  }

  public isNull(): IFluentCore<T, TNext, TPrev> {
    this.setCurrentNode(this.isNull.name, null);
    if (this.maybeInvert(this.actualValue !== null)) {
      this.specError(`should${this.negation}be null`, `${this.negation}null`, `${this.actualValue}`);
    }

    return this.generateFluentState(this.actualValue, null, false);
  }

  public matches(matcher: RegExp): IFluentCore<string, TNext, TPrev> {
    this.setCurrentNode(this.matches.name, `${matcher}`);
    this._match(matcher);

    return this.generateFluentState(this.actualValue, null, false);
  }

  public hasMatch(matcher: RegExp): INarrowableFluentCore<T, Array<string>, TPrev> {
    this.setCurrentNode(this.hasMatch.name, `${matcher}`);
    this._match(matcher);
    const matches = this.actualValue.match(matcher);
    return this.generateFluentState(this.actualValue, matches, false, true);
  }

  public throws(): INarrowableFluentCore<T, Error, TPrev>;

  public throws<TError extends Error>(errorType?: {
    new (...args: Array<any>): TError;
  }): INarrowableFluentCore<T, TError, TPrev> {
    this.setCurrentNode(this.throws.name, errorType ? typeof errorType : null);
    let threw: TError = null;
    this._assertActualFunction();
    try {
      this.actualValue();
    } catch (err) {
      threw = err;
    }
    this._assertThrew(threw, errorType);
    return this.generateFluentState(this.actualValue, threw, false, true);
  }

  public async throwsAsync(): Promise<INarrowableFluentCore<T, Error, TPrev>>;

  public async throwsAsync<TError extends Error>(errorType?: {
    new (...args: Array<any>): TError;
  }): Promise<INarrowableFluentCore<T, TError, TPrev>> {
    this.setCurrentNode(
      this.throwsAsync.name,
      errorType ? typeof errorType : null
    );
    this._assertActualFunction();
    let threw: TError = null;
    try {
      // make sure its a promise and wait.
      await Promise.resolve(this.actualValue());
    } catch (err) {
      threw = err;
    }
    this._assertThrew(threw, errorType);
    return this.generateFluentState(this.actualValue, threw, false, true);
  }

  public satisfies(predicate: (t: T) => boolean): IFluentCore<T, TNext, TPrev> {
    this.setCurrentNode(this.satisfies.name, null);
    if (!(predicate instanceof Function)) {
      this.specError(
        "predicate in satisfies(predicate) should be a function",
        "[a function]",
        this.id(predicate)
      );
    }

    if (this.maybeInvert(!predicate(this.actualValue))) {
      this.specError(
        `should${this.negation}match lambda`,
        this.getFnString(predicate),
        this.actualValue
      );
    }

    return this.generateFluentState(this.actualValue, null, false);
  }

  public is(expectedType: { new (...args: Array<any>): any }): IFluentCore<T, TNext, TPrev> {
    const eActualName = (expectedType || ({} as any)).name;
    this.setCurrentNode(this.is.name, eActualName);
    if (typeof expectedType !== "function") {
      throw new TypeError(
        `Expected type 'function' for instance check, but got type '${typeof expectedType}'.`
      );
    }

    if (this.maybeInvert(!(this.actualValue instanceof expectedType))) {
      const ename =
        eActualName || `(Unnamed type; JS type: ${typeof expectedType})`;
      const aname =
        (this.actualValue || {}).name ||
        `(Unnamed type; JS type: ${typeof this.actualValue})`;
      this.specError(`should${this.negation}be of type`, ename, aname);
    }

    return this.generateFluentState(this.actualValue, null, false);
  }

  public hasProperty<R>(
    expected: ((o: T) => R) | keyof T
  ): INarrowableFluentCore<T, R, TPrev>
  {
    this.setCurrentNode(this.hasProperty.name, null);
    let selected: any;
    let expDescrip: string;
    if (this.nullOrUndefined(this.actualValue)) {
      if ( !this.invertedContext ) {
        this.specError(`contextual value should be defined`, "[an object]", "undefined");
      }

      return; // .not.hasProperty always passes when target not defined.
    }

    if (typeof expected === "string") {
      selected = this.actualValue[expected];
      expDescrip = expected;
    } else if (expected instanceof Function) {
      selected = expected(this.actualValue);
      expDescrip = this.getFnString(expected);
    } else {
      this.specError(
        "Provided selector was not a function or key type.",
        undefined,
        undefined
      );
    }

    if (this.maybeInvert(typeof selected === "undefined")) {
      this.specError(`property should${this.negation}be defined`, expDescrip, this.actualValue);
    }  

    return this.generateFluentState(this.actualValue, selected, false, true);
  }

  public hasSingle(): T extends Array<any>
    ? INarrowableFluentCore<T, T[0], TPrev>
    : void {
    this.setCurrentNode(this.hasSingle.name, null);
    if (
      !(
        this.actualValue instanceof Array ||
        typeof this.actualValue === "string"
      )
    ) {
      throw new TypeError("Expected type is not an array or string.");
    }
    if (this.maybeInvert(this.actualValue.length !== 1)) {
      this.specError(
        `should${this.negation}have single element or character`,
        "single element",
        this.actualValue
      );
    }

    return this.generateFluentState(
      this.actualValue,
      this.actualValue[0],
      false,
      true
    ) as any;
  }

  public isEmpty(): IFluentCore<T, TNext, TPrev> {
    this.setCurrentNode(this.isEmpty.name, null);
    if (
      !(
        typeof this.actualValue === "object" ||
        typeof this.actualValue === "string"
      )
    ) {
      throw new TypeError("Expected type is not an array, string, or object.");
    }

    const isObject = !(
      typeof this.actualValue === "string" || this.actualValue instanceof Array
    );
    let length: number;
    if (isObject) {
      length = Object.keys(this.actualValue).length;
    } else {
      length = this.actualValue.length;
    }

    if (this.maybeInvert(length !== 0)) {
      this.specError(
        `should${this.negation}be empty`,
        "[an empty array, string, or object]",
        this.actualValue
      );
    }

    return this.generateFluentState(this.actualValue, null, false);
  }

  public isTruthy(): IFluentCore<T, TNext, TPrev> {
    return this._assertBooly(!this.actualValue, this.isTruthy.name, "truthy");
  }

  public isFalsy(): IFluentCore<T, TNext, TPrev> {
    return this._assertBooly(!!this.actualValue, this.isFalsy.name, "falsy");
  }

  public converted<R>(lambda: (v: T) => R): IFluentCore<R, TNext, TPrev> {
    this.setCurrentNode(this.converted.name);
    if (typeof lambda !== "function") {
      throw new TypeError(
        `Given value is not a function, but a ${typeof lambda}.`
      );
    }

    const r = lambda(this.actualValue);
    return this.generateFluentState(r, null, false);
  }

  protected _assertActualFunction(): void {
    if (!(this.actualValue instanceof Function)) {
      this.specError(
        `should be a function`,
        "[a function]",
        this.id(this.actualValue)
      );
    }
  }

  protected _assertBooly(
    val: boolean,
    name: string,
    expVal: string
  ): IFluentCore<T, TNext, TPrev> {
    this.setCurrentNode(name, `${!!this.actualValue}`);
    if (this.maybeInvert(val)) {
      this.specError(
        `should${this.negation}be ${expVal}`,
        `[any ${expVal} value]`,
        this.actualValue
      );
    }

    return this.generateFluentState(this.actualValue, null, false);
  }

  protected _assertThrew<TError extends Error>(
    threw: Error,
    errorType: {
      new (...args: Array<any>): TError;
    }
  ) {
    if (this.maybeInvert(!threw)) {
      const expMsg = this.invertedContext
        ? "[no error thrown]"
        : (errorType || Error).name;
      this.specError(
        `should${this.negation}throw`,
        expMsg,
        this.formatShortError(threw)
      );
    } else if (
      errorType &&
      this.maybeInvert(!(threw instanceof errorType))
    ) {
      const tname = errorType.name;
      const taname = threw.name || "[Unnamed error]";
      this.specError(
        `should${this.negation}throw type ${tname} but threw ${taname}`,
        tname,
        this.formatShortError(threw)
      );
    }
  }

  // tslint:disable-next-line
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

    if (!(matcher instanceof RegExp)) {
      this.specError(
        `matcher should be a regular expression`,
        "[a RegExp]",
        this.id(matcher)
      );
    }

    if (this.maybeInvert(!matcher.test(this.actualValue))) {
      this.specError(
        `should${this.negation}match`,
        matcher.toString(),
        this.actualValue
      );
    }
  }
}
