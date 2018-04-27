import { ISimpleMatcher } from "./i-simple-matcher";
import { IOperators } from "./i-operators";
import { IElementsMatcher } from "./i-elements-matcher";
import { IPropertiesMatcherWithHelpers } from "./i-properties-matcher-with-helpers";

/**
 * The members of this interface are only accessible within a fluent context.
 */
export interface IFluentCore<T> extends IPropertiesMatcherWithHelpers<T>, IElementsMatcher<T>, ISimpleMatcher<T>, IOperators<T, any> {

}