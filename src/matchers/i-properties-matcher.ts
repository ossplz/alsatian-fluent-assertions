import {
  SubsetPropertyAssertsDict,
  AllPropertyAssertsDict
} from "../types";
import { IFluentCore } from "./i-fluent-core";
import { INarrowableFluentCore } from "./i-narrowable-fluent-core";

/**
 * Fluent API for beginning property assertions on complex types (e.g., objects or arrays).
 */
export interface IPropertiesMatcher<T> {
  /**
   * Ensures the expected object contains the provided subset of property definitions. See https://git.io/vAH9p
   * @param subsetDict A subset of the original object's properties, with assertions for values.
   */
  has<K extends keyof T>(key: K): INarrowableFluentCore<T, T[K]>;
  has<K extends keyof T>(selector: (o: T) => T[K]): INarrowableFluentCore<T, T[K]>;
  has(keys: string[]): IFluentCore<T>;
  has(subsetDict: SubsetPropertyAssertsDict<T>): IFluentCore<T>;

  /**
   * Like properties(...) but ensures compile-time errors when properties are missing from the expected
   * value definition. This helps you remember to update your tests when adding properties to your types,
   * in the future. See https://git.io/vAHHs
   * @param dict A dictionary with all properties of T.
   */
  hasAll(
    dict: AllPropertyAssertsDict<T>
  ): IFluentCore<T>;

  /**
   * Checks for the existence of keys on the expected object, without regard for values.
   * @param expectedKeys An array of keys to existence-check.
   */
  hasKeys<K extends keyof T>(
    expectedKeys: Array<K>
  ): IFluentCore<T>;

  /**
   * Checks an array for the given values.
   * @param expected The values to existence-check within the expected array.
   */
  hasElements(expected: Array<any>): IFluentCore<Array<any>>;
}
