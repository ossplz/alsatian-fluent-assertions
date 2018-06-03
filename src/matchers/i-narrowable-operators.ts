import { IFluentCore } from "./i-fluent-core";

export interface INarrowableOperators<TNext, T, TPrev> {
  /**
   * Narrows the assertion scope to the last operation's implied result.
   * Example:
   *   .has(o => o.prop).that.has(p => p.itsOwnProp)
   * See https://git.io/vptQr
   */
  that: IFluentCore<TNext, void, T>;
}
