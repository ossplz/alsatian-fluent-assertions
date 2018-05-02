import { IFluentCore } from "../matchers/i-fluent-core";
import { INarrowableFluentCore } from "../matchers";

/** Affords type safety when creating property lambdas. */
export type PropLambdaUnderstoodReturns = boolean | void | IFluentCore<any> | INarrowableFluentCore<any, any>;
