export const enum MatchMode {
  /**
   * For any lambda property assertions, wrap the actual value in an Assert
   * and pass that as the first parameter. Nevertheless, if the return value
   * of the lambda is a strict (===) true or false, then true is pass,
   * false is fail. Other property assertion types function as normal.
   */
  asserts = "asserts",

  /**
   * Default. Tries to interpret assertion properties as a person might. If the property is a:
   *  1. Lambda - then either assert, or use the boolean return value to determine pass/fail (true/false).
   *  2. RegExp - then, if the actual value is a string, check for a match.
   *     If its a regular expression,
   *     perform a strict equals (===) on their string representations. Otherwise, throw.
   *  3. Object/Array - then, if the actual value is the same, recurse. Otherwise, throw.
   *  4. all else - perform a strict equals.
   *
   * A lambda assertion should be of the form
   *  - (actualValue: any) => boolean | IFluentNode | void;
   *
   * where actualValue is the current property's value, and IFluentNode is the return
   * value of an assertion (lets the framework know you didn't intend a boolean assertion).
   */
  normal = "normal",

  /**
   * Forces literal interpretation of property values, even if they are lambdas or
   * regular expressions. Similar to deepEquals, but will only check defined properties,
   * rather than failing when one is missing.
   */
  literal = "literal"
}
