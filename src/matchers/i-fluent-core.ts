import { IPropertiesMatcher } from "./i-properties-matcher";
import { ISimpleMatcher } from "./i-simple-matcher";
import { IOperators } from "./i-operators";
import { IElementsMatcher } from "./i-elements-matcher";

/**
 * The members of this interface are only accessible within a fluent context.
 */
export interface IFluentCore<T> extends IPropertiesMatcher<T>, IElementsMatcher<T>, ISimpleMatcher<T>, IOperators<T, any> {

}