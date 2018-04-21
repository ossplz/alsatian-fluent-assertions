import { PropertyAssertsLambda } from "./property-asserts-lambda";

/** Dictionary type for asserting over all (strictly) values within an object. */
export type AllPropertyAssertsDict<T> = {
    [key in keyof T]:
      | T[key]
      | PropertyAssertsLambda<T[key]>
      | RegExp
      | AllPropertyAssertsDict<T[key]>
  };