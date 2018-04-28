import { LocationMode, MatchMode } from "../types";
import { IFluentCore } from "./i-fluent-core";
import { INarrowableFluentCore } from ".";

export interface IElementsMatcher<T> {
  /**
   * Checks an array for the given values.
   * See https://git.io/vptpk.
   * @param expected The values to existence-check within the expected array.
   * @param location (LocationMode) How to locate values: fromStart, toEnd, contains (default).
   * @param mode (MatchMode) How to match values: asserts, normal (default), literal.
   */
  hasElements(
    expected: Array<any>,
    location?: LocationMode,
    mode?: MatchMode
  ): IFluentCore<T>;

  /**
   * Checks whether any of the contextual array's elements satisfy the given expression.
   * @param predicate A boolean lambda expression that returns true when the test should pass.
   */
  anySatisfy(
    predicate: (e: any, i?: number) => boolean
  ): T extends Array<any> ? IFluentCore<T> : void;

  /**
   * Checks whether all of the contextual array's elements satisfy the given expression.
   * @param predicate A boolean lambda expression that returns true when the test should pass.
   */
  allSatisfy(
    predicate: (e: any, i?: number) => boolean
  ): T extends Array<any> ? IFluentCore<T> : void;

  /**
   * Checks whether the contextual array contains at least one element. If so, you can
   * narrow the assertion scope to that first element with the 'that' operator.
   */
  hasFirst(): T extends Array<any> | string
    ? INarrowableFluentCore<T, T[0]>
    : void;

  /**
   * Checks whether the contextual array contains at least one element. If so, you can
   * narrow the assertion scope to the last element with the 'that' operator.
   */
  hasLast(): T extends Array<any> | string
    ? INarrowableFluentCore<T, T[0]>
    : void;

  /**
   * Checks whether the contextual array has an element at the given, zero-based index.
   * If so, you can narrow the assertion scope to that element with the 'that' operator.
   */
  hasNth<N extends number>(
    n: N
  ): T extends Array<any> | string ? INarrowableFluentCore<T, T[N]> : void;
}
