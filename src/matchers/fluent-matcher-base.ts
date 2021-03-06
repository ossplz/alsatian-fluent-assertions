import { SpecError } from "../errors";
import { RootNode, AssertionContext } from "../types";
import { IFluentNode } from "../types/i-fluent-node";
import { IFluentCore } from "./i-fluent-core";
import { INarrowableFluentCore } from "./i-narrowable-fluent-core";

export class FluentMatcherBase extends RootNode {
  public name: string;
  public details: string;
  public actualValue: any;
  public nextValue: any;
  public hasNext: boolean;
  public parent: IFluentNode;
  protected assertionContext: AssertionContext;
  protected prevCore: IFluentCore<any, any, any>;
  protected invert: boolean = false;
  protected reason: string;
  protected reasonData: any;

  constructor(actualValue: any,
      nextValue: any,
      initial: boolean,
      prevCore: IFluentCore<any, any, any>,
      ctxt: AssertionContext
    ) {
    // not set for non-root until a fluent method is called.
    super(undefined, undefined);
    if (initial) {
      this.parent = new RootNode("Assert", this.id(actualValue));
    }
    this.hasNext = false;
    this.actualValue = actualValue;
    this.nextValue = nextValue;
    this.prevCore = prevCore;
    this.assertionContext = ctxt;
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

  /** Whether the current fluent scope is inverted, e.g., .not.something. */
  protected get invertedContext(): boolean { return this.invert; }

  protected nullOrUndefined(val: any): boolean {
    return val === null || typeof val === "undefined";
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
   * @param {boolean} hasNext Whether a narrowable value is available, per the current assertion.
   * @param {IFluentCore} prevCore Previous, unnarrowed fluent scope, if scope has narrowed.
   * @param {string} reason The reason for the current set of assertions. Helps with maintenance.
   * @param {any} reasonData Data to help with future testing metrics.
   * @returns {INarrowableFluentCore<TActual, TNext>} The fluent context for upcoming assertions.
   */
  protected generateFluentState<TActual, TNext, TPrev>(
    actualValue: any,
    nextValue: any,
    invert: boolean,
    hasNext: boolean = false,
    prevCore: IFluentCore<TPrev, TActual, TPrev> = null,
    reason: string = null,
    reasonData: any = null
  ): INarrowableFluentCore<TActual, TNext, TPrev> {
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
    self.hasNext = !!hasNext;
    self.prevCore = prevCore || this.prevCore;
    self.reason = reason;
    self.reasonData = reasonData;
    return self as any;
  }

  /**
   * Wraps a value in our asserts framework. Intended for use inside property assertions.
   * @param {TActual} actualValue The value to wrap in an Assert.
   * @returns {IFluentCore<TActual>} The fluent context to provide inside, e.g., a property assertion.
   */
  protected wrap<TActual>(actualValue: TActual): IFluentCore<TActual, void, void> {
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
