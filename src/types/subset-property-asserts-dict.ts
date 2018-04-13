import { PropertyLambda } from "./property-lambda";

/** Dictionary type for asserting over some values within an object. */
export type SubsetPropertyAssertsDict<T> = {
    [key in keyof T]?:
      | T[key]
      | PropertyLambda<T[key]>
      | RegExp
      | SubsetPropertyAssertsDict<T[key]>
  };