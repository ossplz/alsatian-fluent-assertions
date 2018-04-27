import { SpecError } from "../errors";
import { INarrowableFluentCore } from "./i-narrowable-fluent-core";
import { IFluentNode } from "../types/i-fluent-node";
import { RootNode } from "../types";
import { Z_VERSION_ERROR } from "zlib";
import { IFluentCore } from "./i-fluent-core";

export class FluentMatcherBase extends RootNode {
  public name: string;
  public details: string;
  public actualValue: any;
  public nextValue: any;
  public parent: IFluentNode;
  protected invert: boolean = false;

  constructor(actualValue: any, nextValue: any, initial: boolean) {
    // not set for non-root until a fluent method is called.
    super(undefined, undefined);
    if (initial) {
      this.parent = new RootNode("Assert", this.id(actualValue));
    }
    this.actualValue = actualValue;
    this.nextValue = nextValue;
  }

  /**
   * Inverts conditionals according to any current, fluent negation.
   * @param {boolean} original The original boolean.
   * @returns {boolean} The original value maybe inverted, depending on current fluent state.
   */
  protected maybeInvert(original: boolean): boolean {
    if (this.invert) {
      return !original;
    }

    return original;
  }

  protected setCurrentNode(name: string, details?: string): void {
    if (this.name) {
      return;
    }

    this.name = name;
    this.details = details;
  }

  /**
   * Generates the actual and next (available via 'that') values of the
   * @param {any} actualValue The value over which future assertions will be performed.
   * @param {any} nextValue The next contextual value (from prior operations) the user could choose with 'that'.
   * @param {boolean} invert Inverts the next term.
   * @returns {INarrowableFluentCore<TActual, TNext>} The fluent context for upcoming assertions.
   */
  protected generateFluentState<TActual, TNext>(
    actualValue: any,
    nextValue: any,
    invert: boolean
  ): INarrowableFluentCore<TActual, TNext> {
    /**
     * Shh... Typescript made me do it. :) You can't return a new PropertiesMatcherWithHelpers()
     * from base classes of the PropertiesMatcherWithHelpers class.
     * No import loops, and all that.
     */
    const self = new (this.constructor as any)(actualValue, nextValue) as this;
    self.parent = this as any;
    self.actualValue = actualValue;
    self.nextValue = nextValue;
    self.invert = invert;
    return self as any;
  }

  /**
   * Wraps a value in our asserts framework. Intended for use inside property assertions.
   * @param {TActual} actualValue The value to wrap in an Assert.
   * @returns {IFluentCore<TActual>} The fluent context to provide inside, e.g., a property assertion.
   */
  protected wrap<TActual>(actualValue: TActual): IFluentCore<TActual> {
    return new (this.constructor as any)(actualValue, null);
  }

  /**
   * Returns " not " or "" depending on whether the chain up til this point is inverted.
   */
  protected get negation(): string {
    return this.invert ? " not " : " ";
  }

  /**
   * Returns a string representation of a function definition up to 500 characters long.
   * Intended to help debugging tests.
   * @param {Function} fn Function to stringify.
   * @returns {string} A maximum of 500 characters of a function definition.
   */
  protected getFnString(fn: (...args: Array<any>) => any): string {
    const mAlias = fn.toString();
    return mAlias.substr(Math.max(mAlias.length, 500 /* fns can get long */));
  }

  /**
   * Tries to intelligently identify a value. ATOW, returns "array" when an array, a "/regex/"
   * when such, or `typeof item`.
   * @param {any} item The item whose type to identify.
   * @returns {string} A string identifying the type of the item in a human-friendly way.
   */
  protected id(item: any): string {
    if (item instanceof Array) {
      return "array";
    } else if (item instanceof RegExp) {
      return item.toString();
    }

    return typeof item;
  }

  protected formatShortError(e: Error) {
    return e ? `Error '${e.name}' with message '${e.message}'.` : "[no error]";
  }

  protected specError(message: string, expected: any, actual: any): SpecError {
    throw new SpecError(this, message, expected, actual);
  }
}
