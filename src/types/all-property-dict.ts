import { PropertyLambda } from "./property-lambda";

/** Dictionary type for asserting over all (strictly) values within an object. */
export type AllPropertyDict<T> = {
    [key in keyof T]:
      | T[key]
      | PropertyLambda<T[key]>
      | RegExp
      | AllPropertyDict<T[key]>
  };