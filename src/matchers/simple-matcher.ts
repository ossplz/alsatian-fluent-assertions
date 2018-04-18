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
    initial: boolean = false
  ) {
    super(actualValue, nextValue, initial);
  }

  /** @inheritDoc */
  public equals(
    expected: T,
    eqType: EqType = EqType.strictly
  ): IFluentCore<T> {
    this.setCurrentNode(this.equals.name, typeof(expected) + ", " + eqType);
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
    this.setCurrentNode(this.strictlyEquals.name, typeof(expected));
    if (this.maybeInvert(this.actualValue !== expected)) {
      this.specError("should strictly (===) equal", expected, this.actualValue);
    }

    return this.setFluentState(this.actualValue, null, false);
  }

  /** @inheritDoc */
  public looselyEquals(expected: T): IFluentCore<T> {
    this.setCurrentNode(this.looselyEquals.name, typeof(expected));
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
    this.setCurrentNode(this.deeplyEquals.name, typeof(expected) + ", " + eqType);
    const equal = deepEqual(expected, this.actualValue, {
      strict: eqType === EqType.strictly
    });
    if (this.maybeInvert(!equal)) {
      this.specError(`should${this.negation}deeply equal (${eqType})`, expected, this.actualValue);
    }

    return this.setFluentState(this.actualValue, null, false);
  }

  /** @inheritDoc */
  public deepStrictlyEquals(expected: T): IFluentCore<T> {
    this.setCurrentNode(this.deepStrictlyEquals.name, typeof(expected));
    return this.deeplyEquals(expected, EqType.strictly);
  }

  /** @inheritDoc */
  public deepLooselyEquals(expected: T): IFluentCore<T> {
    this.setCurrentNode(this.deepLooselyEquals.name, typeof(expected));
    return this.deeplyEquals(expected, EqType.loosely);
  }

  /** @inheritDoc */
  public defined(): IFluentCore<T> {
    this.setCurrentNode(this.defined.name, null);
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
    new (...args: Array<any>): TError;
  }): INarrowableFluentCore<T, TError> {
    this.setCurrentNode(this.throws.name, errorType ? typeof errorType : null);
    let threw: TError = null;
    try {
      this.actualValue();
    } catch (err) {
      threw = err;
    }
    if (this.maybeInvert(!threw)) {
      this.specError(`should${this.negation}throw`, errorType, threw);
    } else if (
      typeof errorType !== "undefined" &&
      this.maybeInvert(!(threw instanceof errorType))
    ) {
      this.specError(`should${this.negation}throw type ${errorType} but threw ${threw}`, errorType, threw);
    }

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
    new (...args: any[]): any;
  }): IFluentCore<T> {
    let eActualName = (expectedType || <any>{}).name;
    this.setCurrentNode(this.is.name, eActualName);
    if (this.maybeInvert(!(this.actualValue instanceof expectedType))) {
      let ename = eActualName || `(Unnamed type; JS type: ${typeof expectedType})`;
      let aname = (this.actualValue.name || <any>{}).name || `(Unnamed type; JS type: ${typeof this.actualValue})`;
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

  private _match(matcher: RegExp): void {
    if (typeof this.actualValue !== "string") {
      throw new MatchError("actual value type was not a string");
    }

    if (this.maybeInvert(!matcher.test(this.actualValue))) {
      this.specError(`should${this.negation}match`, matcher.toString(), this.actualValue);
    }
  }
}
