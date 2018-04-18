import { SpecError } from "../errors";
import { INarrowableFluentCore } from "./i-narrowable-fluent-core";
import { IFluentNode } from "../types/i-fluent-node";
import { RootNode } from "../types";

export class FluentMatcherBase extends RootNode {
  //protected lastNode: FluentNode;
  //protected currentNode: FluentNode;
  public name: string;
  public details: string;
  public actualValue: any;
  public nextValue: any;
  public invert: boolean = false;
  public parent: IFluentNode;
  /*protected get actualValue(): any { return (this.currentNode || <any>{}).actualValue; }
  protected get nextValue(): any { return (this.currentNode || <any>{}).nextValue; }
  protected get invert(): boolean { return (this.currentNode || <any>{}).invert === true; }*/

  constructor(
    actualValue: any,
    nextValue: any,
    initial: boolean = false
  ) {
    // not set for non-root until a fluent method is called.
    super(undefined, undefined);
    if (initial) {
      this.parent = new RootNode("Assert", typeof actualValue);
    }
    this.actualValue = actualValue;
    this.nextValue = nextValue;
  }

  /**
   * Inverts assertions, as in Expect(value).not.to.equal(something).
   * @param original The original boolean.
   */
  protected checkInvert(original: boolean): boolean {
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

  protected specError(
    message: string,
    expected: any,
    actual: any): SpecError {
      throw new SpecError(this, message, expected, actual);
  }
}
