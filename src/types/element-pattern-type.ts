import { PropLambdaUnderstoodReturns } from "./property-lambda-returns";

export type ElementPatternType<T> = { new(): T; } | ((e: T) => PropLambdaUnderstoodReturns);