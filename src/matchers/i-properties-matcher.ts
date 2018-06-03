import {
  SubsetPropertyAssertsDict,
  AllPropertyAssertsDict,
  LocationMode,
  MatchMode,
  SubsetPropertyDict,
  SubsetPropertyLiteralsDict,
  AllPropertyDict,
  AllPropertyLiteralsDict
} from "../types";
import { IFluentCore } from "./i-fluent-core";
import { INarrowableFluentCore } from "./i-narrowable-fluent-core";

/**
 * Fluent API for beginning property assertions on complex types (e.g., objects or arrays).
 */
export interface IPropertiesMatcher<T, TNext, TPrev> {
  /**
   * Ensures the expected object contains the provided subset of property definitions.
   * See https://git.io/vptxi.
   * @param expected A subset of the original object's properties, with assertions for values.
   * @param mode (MatchMode) How to match values: asserts, normal (default), literal.
   */
  hasProperties(
    expected: SubsetPropertyAssertsDict<T>,
    mode?: MatchMode
  ): IFluentCore<T, TNext, TPrev>;

  /**
   * Ensures the expected object contains the provided subset of property definitions.
   * See https://git.io/vptxi.
   * @param expected A subset of the original object's properties, with assertions for values.
   * @param mode (MatchMode) How to match values: asserts, normal (default), literal.
   */
  hasProperties(
    expected: SubsetPropertyDict<T>,
    matchMode?: MatchMode.normal
  ): IFluentCore<T, TNext, TPrev>;

  /**
   * Ensures the expected object contains the provided subset of property definitions.
   * See https://git.io/vptxi.
   * @param expected A subset of the original object's properties, with assertions for values.
   * @param mode (MatchMode) How to match values: asserts, normal (default), literal.
   */
  hasProperties(
    expected: SubsetPropertyLiteralsDict<T>,
    matchMode: MatchMode.literal
  ): IFluentCore<T, TNext, TPrev>;

  /**
   * Like properties(...) but ensures compile-time errors when properties are missing from the expected
   * value definition. This helps you remember to update your tests when adding properties to your types,
   * in the future.
   * See https://git.io/vptxX.
   * @param expected A dictionary with all properties of T.
   * @param mode (MatchMode) How to match values: asserts, normal (default), literal.
   */
  hasAll(expected: AllPropertyAssertsDict<T>, mode?: MatchMode): IFluentCore<T, TNext, TPrev>;

  /**
   * Like properties(...) but ensures compile-time errors when properties are missing from the expected
   * value definition. This helps you remember to update your tests when adding properties to your types,
   * in the future.
   * See https://git.io/vptxX.
   * @param expected A dictionary with all properties of T.
   * @param mode (MatchMode) How to match values: asserts, normal (default), literal.
   */
  hasAll(
    expected: AllPropertyDict<T>,
    matchMode?: MatchMode.normal
  ): IFluentCore<T, TNext, TPrev>;

  /**
   * Like properties(...) but ensures compile-time errors when properties are missing from the expected
   * value definition. This helps you remember to update your tests when adding properties to your types,
   * in the future.
   * See https://git.io/vptxX.
   * @param expected A dictionary with all properties of T.
   * @param mode (MatchMode) How to match values: asserts, normal (default), literal.
   */
  hasAll(
    expected: AllPropertyLiteralsDict<T>,
    matchMode: MatchMode.literal
  ): IFluentCore<T, TNext, TPrev>;

  /**
   * Checks for the existence of keys on the expected object, without regard for values.
   * @param expectedKeys An array of keys to existence-check.
   * See https://git.io/vptpU.
   */
  hasKeys<K extends keyof T>(expectedKeys: Array<K>): IFluentCore<T, TNext, TPrev>;
}
