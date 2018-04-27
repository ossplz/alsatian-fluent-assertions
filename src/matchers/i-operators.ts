import { IFluentCore } from "./i-fluent-core";

export interface IOperators<T, TNext> {
  /**
   * Gets the last contextual value in the fluent chain. This begins with
   * Assert(firstContextualValue) and can be narrowed via has(...), throws(...), etc.
   * Note: if used immediately after a narrowable function (e.g., hasProperty), it will return
   * the non-narrowed value. To get the narrowed value, first use the `that` keyword.
   * See https://git.io/vptQd
   */
  lastContextualValue: T;

  /**
   * Negates the next item in the fluent chain. E.g., Assert(val).not.equals(3).
   * Note: does not negate the entire chain. See https://git.io/vptQP
   */
  not: IFluentCore<T>;

  /**
   * A conditional negation. If the parameter is true, the next item is considered a verbatim
   * assertion (no negation). That is, maybe(false) === not.
   * CAUTION: As with 'not', 'maybe' negations do not propagate. Only the next term is negated.
   * See https://git.io/vptQ9
   * @param verbatim Boolean representing whether consider the next item verbatim (true) or negated (false).
   */
  maybe(verbatim: boolean): IFluentCore<T>;
}
