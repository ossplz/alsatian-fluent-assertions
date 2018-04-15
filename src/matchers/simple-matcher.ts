import deepEqual = require("deep-equal");
import { MatchError } from "alsatian";

import { ErrorMatchError, SpecError } from "../errors";
import { ISimpleMatcher } from "./i-simple-matcher";
import { EqType } from "../types/eq-types";
import { IFluentCore } from "./i-fluent-core";
import { INarrowableFluentCore } from "./i-narrowable-fluent-core";
import { Operators } from "./operators";
import { PropertiesMatcher } from "./properties-matcher";
import { FluentNode } from "../types/fluent-node";

/** @inheritDoc */
export class SimpleMatcher<T>
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
    this.currentNode = new FluentNode(this.equals.name, typeof(expected) + ", " + eqType, this.lastNode);
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
    if (this.currentNode == null) {
      this.currentNode = new FluentNode(this.strictlyEquals.name, typeof(expected), this.lastNode);
    }
    if (this.checkInvert(this.actualValue !== expected)) {
      this.specError("should strictly (===) equal", expected, this.actualValue);
    }

    this.setFluentState(this.actualValue, null, false);
    return <any>this;
  }

  /** @inheritDoc */
  public looselyEquals(expected: T): IFluentCore<T> {
    if (this.currentNode == null) {
      this.currentNode = new FluentNode(this.looselyEquals.name, typeof(expected), this.lastNode);
    }
    /*tslint:disable:triple-equals*/
    if (this.checkInvert(this.actualValue != expected)) {
      /*tslint:enable:triple-equals*/
      this.specError("should loosely (==) equal", expected, this.actualValue);
    }

    this.setFluentState(this.actualValue, null, false);
    return <any>this;
  }

  /** @inheritDoc */
  public deeplyEquals(
    expected: T,
    eqType: EqType.strictly | EqType.loosely = EqType.strictly
  ): IFluentCore<T> {
    if (this.currentNode == null) {
      this.currentNode = new FluentNode(this.deeplyEquals.name, typeof(expected) + ", " + eqType, this.lastNode);
    }
    const equal = deepEqual(expected, this.actualValue, {
      strict: eqType === EqType.strictly
    });
    if (this.checkInvert(!equal)) {
      this.specError(`should${this.negation}deeply equal (${eqType})`, expected, this.actualValue);
    }

    this.setFluentState(this.actualValue, null, false);
    return <any>this;
  }

  /** @inheritDoc */
  public deepStrictlyEquals(expected: T): IFluentCore<T> {
    if (this.currentNode == null) {
      this.currentNode = new FluentNode(this.deepStrictlyEquals.name, typeof(expected), this.lastNode);
    }
    return this.deeplyEquals(expected, EqType.strictly);
  }

  /** @inheritDoc */
  public deepLooselyEquals(expected: T): IFluentCore<T> {
    if (this.currentNode == null) {
      this.currentNode = new FluentNode(this.deepLooselyEquals.name, typeof(expected), this.lastNode);
    }
    return this.deeplyEquals(expected, EqType.loosely);
  }

  /** @inheritDoc */
  public defined(): IFluentCore<T> {
    this.currentNode = new FluentNode(this.defined.name, null, this.lastNode);
    if (this.checkInvert(typeof this.actualValue === "undefined")) {
      this.specError(`should${this.negation}be defined`, undefined, undefined);
    }

    this.setFluentState(this.actualValue, null, false);
    return <any>this;

  }

  /** @inheritDoc */
  public matches(matcher: RegExp): IFluentCore<string> {
    this.currentNode = new FluentNode(this.matches.name, matcher.toString(), this.lastNode);
    this._match(matcher);

    this.setFluentState(this.actualValue, null, false);
    return <any>this;

  }

  /** @inheritDoc */
  public hasMatch(
    matcher: RegExp
  ): INarrowableFluentCore<T, Array<string>> {
    this._match(matcher);
    this.currentNode = new FluentNode(this.hasMatch.name, matcher.toString(), this.lastNode);
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
    this.currentNode = new FluentNode(this.throws.name, errorType ? typeof errorType : null, this.lastNode);
    let threw: TError = null;
    try {
      this.actualValue();
    } catch (err) {
      threw = err;
    }
    if (this.checkInvert(!threw)) {
      this.specError(`should${this.negation}throw`, errorType, threw);
    } else if (
      typeof errorType !== "undefined" &&
      this.checkInvert(!(threw instanceof errorType))
    ) {
      this.specError(`should${this.negation}throw type ${errorType} but threw ${threw}`, errorType, threw);
    }

    this.setFluentState(this.actualValue, threw, false);
    return <any>this;
  }

  /** @inheritDoc */
  public satisfies(predicate: (t: T) => boolean): IFluentCore<T> {
    this.currentNode = new FluentNode(this.satisfies.name, null, this.lastNode);
    if (this.checkInvert(!predicate(this.actualValue))) {
      this.specError(`should${this.negation}match lambda`, this.getFnString(predicate), this.actualValue);
    }

    this.setFluentState(this.actualValue, null, false);
    return <any>this;
  }

  /** @inheritDoc */
  public is(expectedType: {
    new (...args: any[]): any;
  }): IFluentCore<T> {
    this.currentNode = new FluentNode(this.is.name, typeof(expectedType), this.lastNode);
    if (this.checkInvert(!(this.actualValue instanceof expectedType))) {
      let ename = (expectedType || <any>{}).name || `(Unnamed type; JS type: ${typeof expectedType})`;
      let aname = (this.actualValue.name || <any>{}).name || `(Unnamed type; JS type: ${typeof this.actualValue})`;
      this.specError(`should${this.negation}be of type`, ename, aname);
    }

    this.setFluentState(this.actualValue, null, false);
    return <any>this;
  }

  /** @inheritDoc */
  public hasProperty<R>(selector: (t: T) => R): INarrowableFluentCore<T, R> {
    if (this.currentNode == null) {
      this.currentNode = new FluentNode(this.hasProperty.name, null, this.lastNode);
    }
    if (!(selector instanceof Function)) {
      this.specError("Provided selector was not a function.", undefined, undefined);
    }

    const selected = selector(this.actualValue);

    if (this.checkInvert(typeof selected === "undefined")) {
      let fn = this.getFnString(selector);
      this.specError(`should${this.negation}be defined`, fn, this.actualValue);
    }

    this.setFluentState(this.actualValue, selected, false);
    return <any>this;
  }

  private _match(matcher: RegExp): void {
    if (typeof this.actualValue !== "string") {
      throw new MatchError("actual value type was not a string");
    }

    if (this.checkInvert(!matcher.test(this.actualValue))) {
      this.specError(`should${this.negation}match`, matcher.toString(), this.actualValue);
    }
  }
}
