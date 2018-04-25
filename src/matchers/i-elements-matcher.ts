import { LocationMode, MatchMode } from "../types";
import { IFluentCore } from "./i-fluent-core";

export interface IElementsMatcher<T> {
      /**
   * Checks an array for the given values.
   * See https://git.io/vptpk.
   * @param expected The values to existence-check within the expected array.
   * @param location (LocationMode) How to locate values: fromStart, toEnd, contains (default).
   * @param mode (MatchMode) How to match values: asserts, normal (default), literal.
   */
  hasElements(expected: Array<any>, location?: LocationMode, mode?: MatchMode): IFluentCore<T>;

  anySatisfy(predicate: (t: T, i?: number) => boolean): T extends any[] ? IFluentCore<T> : void;

  allSatisfy(predicate: (t: T, i?: number) => boolean): T extends any[] ? IFluentCore<T> : void;
}