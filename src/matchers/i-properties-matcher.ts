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
   * Ensures the contextual value has the given key.
   * @param key The key whose existence to check.
   */
  has<K extends keyof T>(key: K): INarrowableFluentCore<T, T[K]>;

  /**
   * Intended to select a property from the contextual value, but may return others, at
   * the developer's discretion.
   * @param selector A lambda that returns a property from the object.
   */
  has<K extends keyof T>(selector: (o: T) => T[K]): INarrowableFluentCore<T, T[K]>;

  /**
   * Checks the contextual value for the existence of the given keys.
   * @param keys An array of keys.
   */
  has(keys: string[]): IFluentCore<T>;

  /**
   * Ensures the expected object contains the provided subset of property definitions. See https://git.io/vAH9p
   * @param subsetDict A subset of the original object's properties, with assertions for values.
   */
  has(subsetDict: SubsetPropertyAssertsDict<T>): IFluentCore<T>;

  /**
   * Ensures the expected object contains the provided subset of property definitions. See https://git.io/vAH9p
   * @param subsetDict A subset of the original object's properties, with assertions for values.
   */
  hasProperties(dict: SubsetPropertyAssertsDict<T>): IFluentCore<T>;

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
