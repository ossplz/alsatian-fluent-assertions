import { IPropertiesMatcher } from "./i-properties-matcher";
import { ISimpleMatcher } from "./i-simple-matcher";
import { IOperators } from "./i-operators";

/**
 * The members of this interface are only accessible within a fluent context.
 */
export interface IFluentCore<T> extends IPropertiesMatcher<T>, ISimpleMatcher<T>, IOperators<T, any> {

}