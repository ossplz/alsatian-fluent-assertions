import {
  SubsetPropertyAssertsDict,
  AllPropertyAssertsDict,
  LocationMode,
  MatchMode
} from "../types";
import { IFluentCore } from "./i-fluent-core";
import { INarrowableFluentCore } from "./i-narrowable-fluent-core";

/**
 * Fluent API for beginning property assertions on complex types (e.g., objects or arrays).
 */
export interface IPropertiesMatcher<T> {
  /**
   * Ensures the contextual value has the given key.
   * See https://git.io/vptx2.
   * @param key The key whose existence to check.
   */
  has<K extends keyof T>(key: K): INarrowableFluentCore<T, T[K]>;

  /**
   * Intended to select a property from the contextual value, but may return others, at
   * the developer's discretion.
   * See https://git.io/vptx2.
   * @param selector A lambda that returns a property from the object.
   */
  has<K extends keyof T>(selector: (o: T) => T[K]): INarrowableFluentCore<T, T[K]>;

  /**
   * Shorthand for hasElements
   * See https://git.io/vptx2.
   * @param expected An array of element expectations.
   * @param location (LocationMode) How to locate values: fromStart, toEnd, contains (default).
   * @param mode (MatchMode) How to match values: asserts, normal (default), literal.
   */
  has(expected: Array<any>, location?: LocationMode, mode?: MatchMode): IFluentCore<T>;

  /**
   * Ensures the expected object contains the provided subset of property definitions.
   * See https://git.io/vptx2.
   * @param subsetDict A subset of the original object's properties, with assertions for values.
   * @param mode (MatchMode) How to match values: asserts, normal (default), literal.
   */
  has(subsetDict: SubsetPropertyAssertsDict<T>, matchMode?: MatchMode): IFluentCore<T>;

  /**
   * Ensures the expected object contains the provided subset of property definitions.
   * See https://git.io/vptxi.
   * @param expected A subset of the original object's properties, with assertions for values.
   * @param mode (MatchMode) How to match values: asserts, normal (default), literal.
   */
  hasProperties(expected: SubsetPropertyAssertsDict<T>, mode?: MatchMode): IFluentCore<T>;

  /**
   * Like properties(...) but ensures compile-time errors when properties are missing from the expected
   * value definition. This helps you remember to update your tests when adding properties to your types,
   * in the future.
   * See https://git.io/vptxX.
   * @param expected A dictionary with all properties of T.
   * @param mode (MatchMode) How to match values: asserts, normal (default), literal.
   */
  hasAll(
    expected: AllPropertyAssertsDict<T>,
    mode?: MatchMode
  ): IFluentCore<T>;

  /**
   * An alias for has/hasElements with the mode set to MatchMode.asserts.
   */
  hasAsserts<T2 extends any[]>(expected: T2, location?: LocationMode): IFluentCore<T>;


  /**
   * An alias for has/hasProperties with the mode set to MatchMode.asserts.
   */
  hasAsserts(expected: SubsetPropertyAssertsDict<T>): IFluentCore<T>;

  /**
   * An alias for hasAll with the mode set to MatchMode.asserts.
   */
  hasAllAsserts(expected: SubsetPropertyAssertsDict<T>): IFluentCore<T>;

  /**
   * Checks for the existence of keys on the expected object, without regard for values.
   * @param expectedKeys An array of keys to existence-check.
   * See https://git.io/vptpU.
   */
  hasKeys<K extends keyof T>(
    expectedKeys: Array<K>
  ): IFluentCore<T>;

  /**
   * Checks an array for the given values.
   * See https://git.io/vptpk.
   * @param expected The values to existence-check within the expected array.
   * @param location (LocationMode) How to locate values: fromStart, toEnd, contains (default).
   * @param mode (MatchMode) How to match values: asserts, normal (default), literal.
   */
  hasElements(expected: Array<any>, location?: LocationMode, mode?: MatchMode): IFluentCore<T>;
}
