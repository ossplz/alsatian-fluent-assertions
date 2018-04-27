import { IFluentCore } from "./i-fluent-core";
import { EqType } from "../types";
import { ISimpleMatcher } from "./i-simple-matcher";

export interface ISimpleMatcherWithHelpers<T> extends ISimpleMatcher<T> {
  /**
   * Compares the contextual value with expected value.
   * See https://git.io/vptAT.
   * @param expected The expected value.
   * @param eqType The comparison type (default: EqType.strictly, ===).
   */
  equals(
    expected: T,
    eqType?: EqType
  ): IFluentCore<T>;
}