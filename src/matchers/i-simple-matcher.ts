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
  isDefined(): IFluentCore<T>;

  /**
   * Validates the contextual, string value with a regular expression. Preserves context.
   * @param matcher The regular expression to validate the contextual value.
   */
  matches(matcher: RegExp): IFluentCore<string>;

  /**
   * Same as matches, except that it narrows the context to the matches themselves.
   * @param matcher The regular expression to match the contextual value.
   */
  hasMatches(
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
    new (): any;
  }): IFluentCore<T>;

  /**
   * Ensures the expected object contains the given property.
   */
  hasProperty<K extends keyof T>(key: K): INarrowableFluentCore<T, T[K]>;
  hasProperty<K extends keyof T>(selector: (o: T) => T[K]): INarrowableFluentCore<T, T[K]>;
}
