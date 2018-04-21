import { PropertyAssertsLambda } from "./property-asserts-lambda";

/** Dictionary type for asserting over some values within an object. */
export type SubsetPropertyAssertsDict<T> = {
    [key in keyof T]?:
      | T[key]
      | PropertyAssertsLambda<T[key]>
      | RegExp
      | SubsetPropertyAssertsDict<T[key]>
  };