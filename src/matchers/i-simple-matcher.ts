import { EqType } from "../types";
import { IFluentCore } from "./i-fluent-core";
import { INarrowableFluentCore } from "./i-narrowable-fluent-core";

/** Fluent API for simple (as opposed to property) assertions. */
export interface ISimpleMatcher<T> {
  /**
   * Strictly (===) compares the contextual value with the expected value.
   * Helper method for equal(...). See https://git.io/vptAT.
   * @param expected The expected value.
   */
  strictlyEquals(expected: T): IFluentCore<T>;

  /**
   * Loosely (==) compares the contextual value with the expected value.
   * See https://git.io/vptAT.
   * @param expected The expected value.
   */
  looselyEquals(expected: T): IFluentCore<T>;

  /**
   * Recursively compares the contextual value with the expected value.
   * See https://git.io/vptAT.
   * @param expected The expected value.
   * @param eqType The comparison type, either EqType.strictly or EqType.loosely (default: strictly).
   */
  deeplyEquals(
    expected: T,
    eqType?: EqType.strictly | EqType.loosely
  ): IFluentCore<T>;

  /**
   * Performs a loose, recursive comparison of the contextual value with the expected value.
   * See https://git.io/vptAT.
   * @param expected The expected value.
   */
  deepLooselyEquals(expected: T): IFluentCore<T>;

  /**
   * Performs a strict, recursive comparison of the contextual value with the expected value.
   * See https://git.io/vptAT.
   * @param expected The expected value.
   */
  deepStrictlyEquals(expected: T): IFluentCore<T>;

  /**
   * Checks whether the value is defined.
   * See https://git.io/vptAD.
   */
  isDefined(): IFluentCore<T>;

  /**
   * Validates the contextual, string value with a regular expression. Preserves context.
   * See https://git.io/vptxm.
   * @param matcher The regular expression to validate the contextual value.
   */
  matches(matcher: RegExp): IFluentCore<string>;

  /**
   * Same as matches, except that it narrows the context to the matches themselves.
   * See https://git.io/vptxm.
   * @param matcher The regular expression to match the contextual value.
   */
  hasMatch(matcher: RegExp): INarrowableFluentCore<T, Array<string>>;

  /**
   * Validates whether the contextual value (a lambda function) throws an Error.
   * Narrows the fluent context to the error object.
   * See https://git.io/vptxL.
   */
  throws(): INarrowableFluentCore<T, Error>;

  /**
   * Validates whether the contextual value (a lambda function) throws an Error of the given type.
   * Narrows the fluent context to the error object.
   * See https://git.io/vptxL.
   *
   * @param errorType The type of the Error.
   * @returns A fluent context for the error object.
   */
  throws<TError extends Error>(errorType?: {
    new (...args: Array<any>): TError;
  }): INarrowableFluentCore<T, TError>;

  /** Same as throws, but for asynchronous methods. */
  throwsAsync(): Promise<INarrowableFluentCore<T, Error>>;

  /** Same as throws, but for asynchronous methods. */
  throwsAsync<TError extends Error>(errorType?: {
    new (...args: Array<any>): TError;
  }): Promise<INarrowableFluentCore<T, TError>>;

  /**
   * Checks whether the contextual value satisfies the given predicate function.
   * See https://git.io/vptxf.
   * @param predicate A function returning a boolean value.
   */
  satisfies(predicate: (t: T) => boolean): IFluentCore<T>;

  /**
   * Checks whether the contextual value is an instance of the given type.
   * See https://git.io/vptAr.
   * @param expectedType The expected type.
   */
  is(expectedType: { new (...args: Array<any>): any }): IFluentCore<T>;

  /**
   * Ensures the expected object contains the given property.
   * See https://git.io/vptAY.
   * @param expected Either a key or a property selector method.
   */
  hasProperty<R>(
    expected: ((o: T) => R) | keyof T
  ): INarrowableFluentCore<T, R>;

  /**
   * Asserts that the list contains one element. Throws if not a list.
   * See https://git.io/vptAR.
   */
  hasSingle(): T extends Array<any> ? INarrowableFluentCore<T, T[0]> : void;

  /**
   * Checks whether the given array, object, or string is empty.
   * See https://git.io/vptAb.
   */
  isEmpty(): IFluentCore<T>;

  /**
   * Asserts that the value can be coerced to false (e.g., !value === true). Ex: empty strings,
   * zero, null, undefined, false, etc.
   * See https://git.io/vptAx.
   */
  isFalsy(): IFluentCore<T>;

  /**
   * Asserts that the value can be coerced to true. Ex: non-empty strings, numbers not equal
   * to zero, objects, true, etc.
   * See https://git.io/vptAh.
   */
  isTruthy(): IFluentCore<T>;

  /**
   * Performs the specified transformation and returns the result in the fluent context.
   * Shorthand for `hasProperty(o => transform(o)).that.` (obviates `that`).
   * Included for clarity.
   * See https://git.io/vptNj.
   */
  converted<R>(lambda: (v: T) => R): IFluentCore<R>;
}
