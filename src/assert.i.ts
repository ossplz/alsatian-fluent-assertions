import {
  ContainerMatcher,
  EmptyMatcher,
  FunctionMatcher,
  Matcher,
  NumberMatcher,
  PropertyMatcher,
  StringMatcher,
  FunctionSpy
} from "alsatian";
import { IFluentCore, INarrowableFluentCore } from "./matchers";

/**
 * Enables actual vs expected comparisons
 */
export interface IAssert<T> {
  /**
   * Allows checking of test outcomes
   * @param actualValue - the value or function under test
   */
  //<T>(actualValue: FunctionSpy | ((...args: Array<any>) => any)): FunctionMatcher;
  //<T>(actualValue: PropertySpy<T>): PropertyMatcher<T>;
  <T>(actualValue: T): IFluentCore<T>;
  <TNext>(actualValue: T, nextValue?: TNext, invertResult?: boolean): INarrowableFluentCore<T, TNext>;

  /**
   * Fails the test with the given message
   * @param message - the message that will be shown in the failure
   */
  fail(message: string): void;
}
