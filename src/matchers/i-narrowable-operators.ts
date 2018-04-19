import { IFluentCore } from "./i-fluent-core";

export interface INarrowableOperators<TNext> {
  /**
   * Narrows the assertion scope to the last operation's implied result.
   * Example:
   *   .has(o => o.prop).that.has(p => p.itsOwnProp)
   */
  that: IFluentCore<TNext>;
}