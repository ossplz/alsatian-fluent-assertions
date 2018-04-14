import { IFluentCore } from "./i-fluent-core";

export interface INarrowableOperators<TNext> {
      /**
   * Gets the last contextual value in the fluent chain. This begins with
   * Expect(firstContextualValue) and can be narrowed via has(...), throws(...), etc.
   */
  lastContextualValue: TNext;

  /**
   * Narrows the assertion scope to the last operation's implied result.
   * Example:
   *   .has(o => o.prop).that.has(p => p.itsOwnProp)
   */
  that: IFluentCore<TNext>;
}