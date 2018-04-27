import { PropertyAssertsLambda } from "./property-asserts-lambda";

/** Dictionary type for asserting over some values within an object. */
export type AllPropertyLiteralsDict<T> = { [key in keyof T]: T[key] };
