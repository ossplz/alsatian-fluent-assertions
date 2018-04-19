import { EqType } from "../types";
import { IFluentCore } from "./i-fluent-core";
import { INarrowableFluentCore } from "./i-narrowable-fluent-core";


/** Fluent API for simple (as opposed to property) assertions. */
export interface ISimpleMatcher<T> {
  /**
   * Compares the contextual value with expected value.
   * @param expected The expected value.
   * @param eqType The comparison type (default: EqType.strictly, ===).
   */
  equals(
    expected: T,
    eqType?: EqType
  ): IFluentCore<T>;

  /**
   * Strictly (===) compares the contextual value with the expected value.
   * Helper method for equal(...).
   * @param expected The expected value.
   */
  strictlyEquals(expected: T): IFluentCore<T>;

  /**
   * Loosely (==) compares the contextual value with the expected value.
   * @param expected The expected value.
   */
  looselyEquals(expected: T): IFluentCore<T>;

  /**
   * Recursively compares the contextual value with the expected value.
   * @param expected The expected value.
   * @param eqType The comparison type, either EqType.strictly or EqType.loosely (default: strictly).
   */
  deeplyEquals(
    expected: T,
    eqType?: EqType.strictly | EqType.loosely
  ): IFluentCore<T>;

  /**
   * Performs a loose, recursive comparison of the contextual value with the expected value.
   * @param expected The expected value.
   */
  deepLooselyEquals(expected: T): IFluentCore<T>;

  /**
   * Performs a strict, recursive comparison of the contextual value with the expected value.
   * @param expected The expected value.
   */
  deepStrictlyEquals(expected: T): IFluentCore<T>;

  /**
   * Checks whether the value is defined.
   */
  defined(): IFluentCore<T>;

  /**
   * Validates the contextual, string value with a regular expression. Preserves context.
   * @param matcher The regular expression to validate the contextual value.
   */
  matches(matcher: RegExp): IFluentCore<string>;

  /**
   * Same as matches, except that it narrows the context to the matches themselves.
   * @param matcher The regular expression to match the contextual value.
   */
  hasMatch(
    matcher: RegExp
  ): INarrowableFluentCore<T, Array<string>>;

  /**
   * Validates whether the contextual value (a lambda function) throws an Error.
   * Narrows the fluent context to the error object.
   */
  throws(): INarrowableFluentCore<T, Error>;

  /**
   * Validates whether the contextual value (a lambda function) throws an Error of the given type.
   * Narrows the fluent context to the error object.
   * @param errorType The type of the Error.
   * @returns A fluent context for the error object.
   */
  throws<TError extends Error>(errorType?: {
    new (...args: Array<any>): TError;
  }): INarrowableFluentCore<T, TError>;

  /**
   * Checks whether the contextual value satisfies the given predicate function.
   * @param predicate A function returning a boolean value.
   */
  satisfies(
    predicate: (t: T) => boolean
  ): IFluentCore<T>;

  /**
   * Checks whether the contextual value is an instance of the given type.
   * @param expectedType The expected type.
   */
  is(expectedType: {
    new (...args: any[]): any;
  }): IFluentCore<T>;

  /**
   * Ensures the expected object contains the given property.
   */
  hasProperty<K extends keyof T>(key: K): INarrowableFluentCore<T, T[K]>;
  hasProperty<K extends keyof T>(selector: (o: T) => T[K]): INarrowableFluentCore<T, T[K]>;

  /**
   * Checks whether the given array, object, or string is empty.
   */
  isEmpty(): IFluentCore<T>;

  /**
   * Asserts that the list contains one element.
   */
  hasSingle(): T extends any[] ? INarrowableFluentCore<T, T[0]> : IFluentCore<T>;

  /**
   * Asserts that the value can be coerced to true. Ex: non-empty strings, numbers not equal
   * to zero, objects, true, etc.
   */
  isTruthy(): IFluentCore<T>;

  /**
   * Asserts that the value can be coerced to false (e.g., !value === true). Ex: empty strings,
   * zero, null, undefined, false, etc.
   */
  isFalsy(): IFluentCore<T>;

  /**
   * Performs the specified transformation and returns the result in the fluent context.
   * Shorthand for `hasProperty(o => transform(o)).that.` (obviates `that`).
   * Included for clarity.
   */
  converted<R>(lambda: (v: T) => R): IFluentCore<R>;
}
