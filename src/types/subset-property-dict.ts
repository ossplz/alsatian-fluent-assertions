import { PropertyLambda } from "./property-lambda";

/** Dictionary type for asserting over some values within an object. */
export type SubsetPropertyDict<T> = {
    [key in keyof T]?:
      | T[key]
      | PropertyLambda<T[key]>
      | RegExp
      | SubsetPropertyDict<T[key]>
  };