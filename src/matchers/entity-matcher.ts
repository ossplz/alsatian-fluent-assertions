import deepEqual = require("deep-equal");
import { MatchError } from "alsatian";

import { ErrorMatchError } from "../errors";
import { ISimpleMatcher } from "./i-simple-matcher";
import { EqType } from "../types/eq-types";
import { IFluentCore } from "./i-fluent-core";
import { INarrowableFluentCore } from "./i-narrowable-fluent-core";
import { Operators } from "./operators";
import { PropertiesMatcher } from "./properties-matcher";

/** @inheritDoc */
export class EntityMatcher<T>
    extends Operators<T, any>
    implements ISimpleMatcher<T> {
  constructor(
    protected actualValue: any,
    protected nextValue: any,
    protected invert: boolean
  ) {
    super(actualValue, nextValue, invert);
  }

  /** @inheritDoc */
  public equals(
    expected: T,
    eqType: EqType = EqType.strictly
  ): IFluentCore<T> {
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
        throw new Error(`Unrecognized EqType: ${eqType}.`);
    }
  }

  /** @inheritDoc */
  public strictlyEquals(expected: T): IFluentCore<T> {
    if (this.checkInvert(this.actualValue !== expected)) {
      throw new MatchError(
        "should strictly (===) equal",
        expected,
        this.actualValue
      );
    }

    this.setFluentState(this.actualValue, null, false);
    return <any>this;
  }

  /** @inheritDoc */
  public looselyEquals(expected: T): IFluentCore<T> {
    /*tslint:disable:triple-equals*/
    if (this.checkInvert(this.actualValue != expected)) {
      /*tslint:enable:triple-equals*/
      throw new MatchError(
        "should loosely (==) equal",
        expected,
        this.actualValue
      );
    }

    this.setFluentState(this.actualValue, null, false);
    return <any>this;
  }

  /** @inheritDoc */
  public deeplyEquals(
    expected: T,
    eqType: EqType.strictly | EqType.loosely = EqType.strictly
  ): IFluentCore<T> {
    const equal = deepEqual(expected, this.actualValue, {
      strict: eqType === EqType.strictly
    });
    if (this.checkInvert(!equal)) {
      throw new MatchError(
        `should deeply equal (${eqType})`,
        expected,
        this.actualValue
      );
    }

    this.setFluentState(this.actualValue, null, false);
    return <any>this;
  }

  /** @inheritDoc */
  public deepStrictlyEquals(expected: T): IFluentCore<T> {
    return this.deeplyEquals(expected, EqType.strictly);
  }

  /** @inheritDoc */
  public deepLooselyEquals(expected: T): IFluentCore<T> {
    return this.deeplyEquals(expected, EqType.loosely);
  }

  /** @inheritDoc */
  public defined(): IFluentCore<T> {
    if (this.checkInvert(typeof this.actualValue === "undefined")) {
      throw new MatchError(`should${this.negation}be defined.`);
    }

    this.setFluentState(this.actualValue, null, false);
    return <any>this;

  }

  /** @inheritDoc */
  public matches(matcher: RegExp): IFluentCore<string> {
    this._match(matcher);

    this.setFluentState(this.actualValue, null, false);
    return <any>this;

  }

  /** @inheritDoc */
  public hasMatch(
    matcher: RegExp
  ): INarrowableFluentCore<T, Array<string>> {
    this._match(matcher);
    const matches = this.actualValue.match(matcher);
    this.setFluentState(this.actualValue, matches, false);
    return <any>this;

  }

  /** @inheritDoc */
  public throws(): INarrowableFluentCore<T, Error>;
  /** @inheritDoc */
  public throws<TError extends Error>(errorType?: {
    new (...args: Array<any>): TError;
  }): INarrowableFluentCore<T, TError> {
    let threw: TError = null;
    try {
      this.actualValue();
    } catch (err) {
      threw = err;
    }
    if (this.checkInvert(!threw)) {
      throw new ErrorMatchError(
        threw,
        !this.invert,
        errorType,
        `should${this.negation}throw`
      );
    } else if (
      typeof errorType !== "undefined" &&
      this.checkInvert(!(threw instanceof errorType))
    ) {
      throw new ErrorMatchError(
        threw,
        !this.invert,
        errorType,
        `should${this.negation}throw type`
      );
    }

    this.setFluentState(this.actualValue, threw, false);
    return <any>this;
  }

  /** @inheritDoc */
  public satisfies(predicate: (t: T) => boolean): IFluentCore<T> {
    if (this.checkInvert(!predicate(this.actualValue))) {
      throw new MatchError(
        "should match lambda",
        this.getFnString(predicate),
        this.actualValue
      );
    }

    this.setFluentState(this.actualValue, null, false);
    return <any>this;
  }

  /** @inheritDoc */
  public is(expectedType: {
    new (): any;
  }): IFluentCore<T> {
    if (this.checkInvert(!(this.actualValue instanceof expectedType))) {
      throw new MatchError(
        "should match type",
        typeof this.actualValue,
        typeof expectedType
      );
    }

    this.setFluentState(this.actualValue, null, false);
    return <any>this;
  }

  /** @inheritDoc */
  public hasProperty<R>(selector: (t: T) => R): INarrowableFluentCore<T, R> {
    if (!(selector instanceof Function)) {
      throw new Error("Provided selector was not a function.");
    }

    const selected = selector(this.actualValue);

    if (this.checkInvert(typeof selected === "undefined")) {
      throw new MatchError(
        "should be defined",
        this.getFnString(selector),
        this.actualValue
      );
    }

    this.setFluentState(this.actualValue, selected, false);
    return <any>this;
  }

  private _match(matcher: RegExp): void {
    if (typeof this.actualValue !== "string") {
      throw new MatchError("actual value type was not a string");
    }

    if (this.checkInvert(!matcher.test(this.actualValue))) {
      throw new MatchError(
        "should match",
        matcher.toString(),
        this.actualValue
      );
    }
  }
}
