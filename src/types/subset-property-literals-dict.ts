import { PropertyAssertsLambda } from "./property-asserts-lambda";

/** Dictionary type for asserting over some values within an object. */
export type SubsetPropertyLiteralsDict<T> = { [key in keyof T]?: T[key] };
