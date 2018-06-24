import { IFluentCore } from "./i-fluent-core";
import { INarrowableFluentCore } from "./i-narrowable-fluent-core";

export interface IOperators<T, TNext, TPrev> {
  /**
   * Gets the last contextual value in the fluent chain. This begins with
   * Assert(firstContextualValue) and can be narrowed via has(...), throws(...), etc.
   * Note: if used immediately after a narrowable function (e.g., hasProperty), it will return
   * the non-narrowed value. To get the narrowed value, first use the `that` keyword.
   * See https://git.io/vptQd
   */
  lastContextualValue: T;

  /**
   * Ends a scope entered by the 'that' operator. Think of it like a stack 'pop.'
   * See https://git.io/vhlEK
   */
  kThx: IFluentCore<TPrev, T, void>;

  /**
   * Negates the next item in the fluent chain. E.g., Assert(val).not.equals(3).
   * Note: does not negate the entire chain. See https://git.io/vptQP.
   * See also the 'maybe' conditional negation operator (https://git.io/vptQ9).
   */
  not: IFluentCore<T, TNext, TPrev>;

  /**
   * A conditional negation. If the parameter is true, the next item is considered a verbatim
   * assertion (no negation). That is, maybe(false) === not.
   * CAUTION: As with 'not', 'maybe' negations do not propagate. Only the next term is negated.
   * See https://git.io/vptQ9. See also the parameterless 'not' operator.
   * @param verbatim Boolean representing whether consider the next item verbatim (true) or negated (false).
   */
  maybe(verbatim: boolean): IFluentCore<T, TNext, TPrev>;

  /**
   * Adds a clarification to help future debuggers understand the reason for a particular assertion.
   * @param reason Justification for the upcoming set of fluent assertions.
   */
  forReason(reason: string): IFluentCore<T, TNext, TPrev>
}
