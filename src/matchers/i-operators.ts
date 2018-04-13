import { IFluentCore } from "./i-fluent-core";

export interface IOperators<T, TNext> {
  /**
   * Negates the next item in the fluent chain. E.g., Expect(val).not.to.equal(3).
   * Note: does not negate the entire chain. See: https://git.io/vxiKp
   */
  not: IFluentCore<T>;

  /**
   * A conditional version of 'not' designed to facilitate test parameterization.
   * Using maybe(false) is equivalent to using not.
   * @param yayNay Boolean representing whether the next term should remain unnegated.
   */
  maybe(yayNay: boolean): IFluentCore<T>;
}