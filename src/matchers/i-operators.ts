import { IFluentCore } from "./i-fluent-core";

export interface IOperators<T, TNext> {
  /**
   * Negates the next item in the fluent chain. E.g., Assert(val).not.equals(3).
   * Note: does not negate the entire chain. See: https://git.io/vxiKp
   */
  not: IFluentCore<T>;

  /**
   * A conditional version of 'not' designed to facilitate test parameterization.
   * Using 'maybe(false)' is equivalent to using 'not'.
   * CAUTION: As with 'not', 'maybe' negations do not propagate. Only the next term is negated.
   * See: https
   * @param not Boolean representing whether the next term should remain unnegated.
   */
  maybe(not: boolean): IFluentCore<T>;

  /**
   * Gets the last contextual value in the fluent chain. This begins with
   * Assert(firstContextualValue) and can be narrowed via has(...), throws(...), etc.
   * Note: if used immediately after a narrowable function (e.g., hasProperty), it will return
   * the non-narrowed value. To get the narrowed value, first use the `that` keyword.
   */
  lastContextualValue: T;
}