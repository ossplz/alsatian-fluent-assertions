import { IOperators } from "./i-operators";
import { IElementsMatcher } from "./i-elements-matcher";
import { IPropertiesMatcherWithHelpers } from "./i-properties-matcher-with-helpers";
import { ISimpleMatcherWithHelpers } from "./i-simple-matcher-with-helpers";

/**
 * The members of this interface are only accessible within a fluent context.
 */
export interface IFluentCore<T, TNext, TPrev>
  extends IPropertiesMatcherWithHelpers<T, TNext, TPrev>,
    IElementsMatcher<T, TNext, TPrev>,
    ISimpleMatcherWithHelpers<T, TNext, TPrev>,
    IOperators<T, TNext, TPrev> {}
