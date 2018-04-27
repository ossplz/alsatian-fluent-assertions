import { PropLambdaUnderstoodReturns } from "./property-lambda-returns";
import { IFluentCore } from "../matchers";

/** Lambda type for asserting property values. */
export type PropertyAssertsLambda<TProp> = (
  actual?: IFluentCore<TProp>
) => PropLambdaUnderstoodReturns;
