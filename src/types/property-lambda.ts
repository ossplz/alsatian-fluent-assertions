import { PropLambdaUnderstoodReturns } from "./property-lambda-returns";

/** Lambda type for asserting property values. */
export type PropertyLambda<TProp> = (
    actual?: TProp
  ) => PropLambdaUnderstoodReturns;