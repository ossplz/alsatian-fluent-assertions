import {
  SubsetPropertyLiteralsDict,
  SubsetPropertyDict,
  MatchMode,
  LocationMode,
  SubsetPropertyAssertsDict,
  AllPropertyAssertsDict
} from "../types";
import { IFluentCore } from "./i-fluent-core";
import { INarrowableFluentCore } from "./i-narrowable-fluent-core";
import { IPropertiesMatcher } from ".";

export interface IPropertiesMatcherWithHelpers<T, TNext, TPrev>
  extends IPropertiesMatcher<T, TNext, TPrev> {
  /**
   * Ensures the contextual value has the given key.
   * See https://git.io/vptx2.
   * @param key The key whose existence to check.
   */
  has<K extends keyof T>(key: K): INarrowableFluentCore<T, T[K], TPrev>;

  /**
   * Intended to select a property from the contextual value, but may return others, at
   * the developer's discretion.
   * See https://git.io/vptx2.
   * @param selector A lambda that returns a property from the object.
   */
  has<R>(
    expected: ((o: T) => R) | keyof T
  ): INarrowableFluentCore<T, R, TPrev>;

  /**
   * Shorthand for hasElements
   * See https://git.io/vptx2.
   * @param expected An array of element expectations.
   * @param location (LocationMode) How to locate values: fromStart, toEnd, contains (default).
   * @param mode (MatchMode) How to match values: asserts, normal (default), literal.
   */
  has(
    expected: Array<any>,
    location?: LocationMode,
    mode?: MatchMode
  ): IFluentCore<T, TNext, TPrev>;

  /**
   * Ensures the expected object contains the provided subset of property definitions.
   * See https://git.io/vptx2.
   * @param subsetDict A subset of the original object's properties, with assertions for values.
   * @param mode (MatchMode) How to match values: asserts, normal (default), literal.
   */
  has(
    subsetDict: SubsetPropertyDict<T>,
    matchMode?: MatchMode.normal
  ): IFluentCore<T, TNext, TPrev>;

  /**
   * Ensures the expected object contains the provided subset of property definitions.
   * See https://git.io/vptx2.
   * @param subsetDict A subset of the original object's properties, with assertions for values.
   * @param mode (MatchMode) How to match values: asserts, normal (default), literal.
   */
  has(
    subsetDict: SubsetPropertyLiteralsDict<T>,
    matchMode: MatchMode.literal
  ): IFluentCore<T, TNext, TPrev>;

  /**
   * Ensures the expected object contains the provided subset of property definitions.
   * See https://git.io/vptx2.
   * @param subsetDict A subset of the original object's properties, with assertions for values.
   * @param mode (MatchMode) How to match values: asserts, normal (default), literal.
   */
  has(
    subsetDict: SubsetPropertyAssertsDict<T>,
    matchMode: MatchMode.asserts
  ): IFluentCore<T, TNext, TPrev>;

  /**
   * An alias for hasAll with the mode set to MatchMode.asserts
   */
  hasAllAsserts(expected: AllPropertyAssertsDict<T>): IFluentCore<T, TNext, TPrev>;

  /**
   * An alias for has/hasElements with the mode set to MatchMode.asserts.
   */
  hasAsserts<T2 extends Array<any>>(
    expected: T2,
    location?: LocationMode
  ): IFluentCore<T, TNext, TPrev>;

  /**
   * An alias for has/hasProperties with the mode set to MatchMode.asserts.
   */
  hasAsserts(expected: SubsetPropertyAssertsDict<T>): IFluentCore<T, TNext, TPrev>;
}
