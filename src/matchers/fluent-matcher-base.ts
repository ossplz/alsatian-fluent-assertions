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
  constructor(
    actualValue: any,
    nextValue: any,
    initial: boolean
  ) {
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
   * @param original The original boolean.
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
   * 
   * @param actualValue 
   * @param nextValue 
   * @param invert Inverts the next term.
   * @param thatInvert Indicates that a negation of the current .that chain occurred.
   */
  protected setFluentState<TActual, TNext>(
    actualValue: any,
    nextValue: any,
    invert: boolean
  ): INarrowableFluentCore<TActual, TNext> {
    /**
     * Shh... Typescript made me do it. :) You can't return a new PropertiesMatcher()
     * from base classes of the PropertiesMatcher class.
     * No import loops.
     */
    const self = new (<any>this.constructor)(actualValue, nextValue) as this;
    self.parent = <any>this;
    self.actualValue = actualValue;
    self.nextValue = nextValue;
    self.invert = invert;
    return <any>self;
  }

  /** Wraps a value in our asserts framework. Intended for use inside property assertions. */
  protected wrap<TActual>(actualValue: TActual): IFluentCore<TActual> {
    return new (<any>this.constructor)(actualValue, null);
  }

  /**
   * Returns " not " or "" depending on whether the chain up til this point is inverted.
   */
  protected get negation(): string {
    return this.invert ? " not " : " ";
  }

  /**
   * Returns a string representation of a function definition up to 500 characters long.
   * @param fn Function to stringify.
   */
  protected getFnString(fn: (...args: Array<any>) => any): string {
    const mAlias = fn.toString();
    return mAlias.substr(Math.max(mAlias.length, 500 /* fns can get long */));
  }

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

  protected specError(
    message: string,
    expected: any,
    actual: any): SpecError {
      throw new SpecError(this, message, expected, actual);
  }
}
