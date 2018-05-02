import { IPropertiesMatcher } from "./i-properties-matcher";
import { MatchMode, LocationMode, EqType } from "../types";
import { IFluentCore } from "./i-fluent-core";
import { IElementsMatcher } from "./i-elements-matcher";
import { INarrowableFluentCore } from "./i-narrowable-fluent-core";
import { SimpleMatcherWithHelpers } from "./simple-matcher-with-helpers";

export class ElementsMatcher<T> extends SimpleMatcherWithHelpers<T>
  implements IElementsMatcher<T> {
  constructor(actualValue: any, nextValue: any, initial: boolean) {
    super(actualValue, nextValue, initial);
  }

  public hasElements(
    expected: Array<any>,
    location: LocationMode = LocationMode.contains,
    elMode: MatchMode = MatchMode.normal
  ): IFluentCore<T> {
    this.setCurrentNode(this.hasElements.name, `${location}, ${elMode}`);
    this._assertHasElements(this.actualValue, expected, location, elMode, []);
    return this.generateFluentState(this.actualValue, null, false);
  }

  public allSatisfy(
    predicate: (el: any, i?: number) => boolean
  ): T extends Array<any> ? IFluentCore<T> : void {
    this.setCurrentNode(this.allSatisfy.name);
    this._assertActualArray();
    this._assertExpectationIsFunction(predicate);
    const result = this.actualValue.every(predicate);
    if (this.maybeInvert(!result)) {
      this.specError(
        `should all${this.negation}satisfy predicate`,
        predicate,
        this.actualValue
      );
    }
    return this.generateFluentState(this.actualValue, null, false) as any;
  }

  public anySatisfy(
    predicate: (e: any) => boolean
  ): T extends Array<any> ? IFluentCore<T> : void {
    this.setCurrentNode(this.anySatisfy.name);
    this._assertActualArray();
    this._assertExpectationIsFunction(predicate);
    const result = this.actualValue.some(predicate);
    if (this.maybeInvert(!result)) {
      this.specError(
        `some should${this.negation}satisfy predicate`,
        predicate,
        this.actualValue
      );
    }
    return this.generateFluentState(this.actualValue, null, false) as any;
  }

  public hasFirst(): T extends Array<any> | string
    ? INarrowableFluentCore<T, T[0]>
    : void {
    this.setCurrentNode(this.hasFirst.name);
    const failMsg = `should${this.negation}have one or more elements`;
    this._assertHasNth(
      0,
      this.actualValue,
      `[an array of length >= 1]`,
      failMsg
    );
    return this.generateFluentState(
      this.actualValue,
      this.actualValue[0],
      false
    ) as any;
  }

  public hasLast(): T extends Array<any> | string
    ? INarrowableFluentCore<T, T[0]>
    : void {
    this.setCurrentNode(this.hasLast.name);
    const failMsg = `should${this.negation}have one or more elements`;
    this._assertHasNth(
      0,
      this.actualValue,
      `[an array of length >= 1]`,
      failMsg
    );
    return this.generateFluentState(
      this.actualValue,
      this.actualValue[this.actualValue.length - 1],
      false
    ) as any;
  }

  public hasNth<N extends number>(
    n: N
  ): T extends Array<any> | string ? INarrowableFluentCore<T, T[N]> : void {
    this.setCurrentNode(this.hasNth.name, `${n}`);
    if (typeof n !== "number") {
      this.specError("parameter should be a number", "[a number]", this.id(n));
    }
    const index: number = +n;
    const failMsg = `should${this.negation}have ${index + 1} or more elements`;
    this._assertHasNth(
      index,
      this.actualValue,
      `[an array of length > ${index}]`,
      failMsg
    );
    return this.generateFluentState(
      this.actualValue,
      this.actualValue[index],
      false
    ) as any;
  }

  protected _assertHasNth(
    n: number,
    actual: any,
    expected: string,
    failMsg: string
  ): void {
    this.setCurrentNode(this.hasFirst.name);
    this._assertActualArrayOrString();
    if (this.maybeInvert(this.actualValue.length <= n)) {
      this.specError(failMsg, expected, this.actualValue);
    }
    return this.generateFluentState(
      this.actualValue,
      this.actualValue[n],
      false
    ) as any;
  }

  protected _assertHasElements(
    actual: Array<any>,
    expected: Array<any>,
    location: LocationMode,
    elMode: MatchMode,
    path: Array<string>
  ) {
    if (!(actual instanceof Array)) {
      this.specError("not an array type", expected, this.actualValue);
    }

    if (this.maybeInvert(true) && expected.length > this.actualValue.length) {
      this.specError(
        "expected array is longer than the actual array.",
        expected,
        this.actualValue
      );
    }

    if (location === LocationMode.contains) {
      this._assertContainsElements(expected, location, elMode, path);
    } else if (location === LocationMode.sequentialContains) {
      this._assertSequentialHasElements(expected, location, elMode, path);
    } else if (location === LocationMode.startsWith) {
      this._assertHasElementsFrom(expected, 0, location, elMode, path);
    } else if (location === LocationMode.endsWith) {
      const start = this.actualValue.length - expected.length;
      this._assertHasElementsFrom(expected, start, location, elMode, path);
    } else {
      this.specError(`Unknown LocationMode: ${location}.`, "[A known LocationMode]", `${location}`);
    }

  }

  protected _assertHasElementsFrom(
    expected: Array<any>,
    start: number,
    location: LocationMode,
    elMode: MatchMode,
    path: Array<string>
  ): void {
    for (let i = start; i < expected.length; i++) {
      this._assertElement(
        i,
        this.actualValue[i],
        expected[i - start],
        location,
        elMode
      );
    }
  }

  protected _assertContainsElements(
    expected: Array<any>,
    location: LocationMode,
    elMode: MatchMode,
    path: Array<string>
  ): void {
    for (let i = 0; i < expected.length; i++) {
      let found = false;
      for (const value of this.actualValue) {
        if (this._matchElement(value, expected[i], location, elMode)) {
          found = true;
          break;
        }
      }

      if (this.maybeInvert(!found)) {
        this.specError(
          `should${
            this.negation
          }contain expected elements (index: ${i}, value: ${expected[i]})`,
          expected,
          this.actualValue
        );
      }
    }
  }

  protected _assertSequentialHasElements(
    expected: Array<any>,
    location: LocationMode,
    elMode: MatchMode,
    path: Array<string>
  ): void {
    const lenDelta = this.actualValue.length - expected.length;
    let hasSeq: boolean;
    let anyHas: boolean = false;
    for (let start = 0; start <= lenDelta; start++) {
      hasSeq = true;
      for (let i = start; i < start + lenDelta; i++) {
        if (
          !this._matchElement(
            this.actualValue[i],
            expected[i - start],
            location,
            elMode
          )
        ) {
          hasSeq = false;
          break;
        }
      }
      anyHas = anyHas || hasSeq;
      if (anyHas && this.maybeInvert(true)) {
        // if we're inverted, check all
        break;
      }
    }

    if (this.maybeInvert(!anyHas)) {
      this.specError(
        `should${this.negation}find sequence in array`,
        expected,
        this.actualValue
      );
    }
  }

  protected _assertElement(
    index: number,
    actual: any,
    expected: any,
    location: LocationMode,
    elMode: MatchMode
  ): void {
    if (this.maybeInvert(!this._matchElement(actual, expected, location, elMode))) {
      this.specError(
        `element at index ${index} should${this.negation}match asserted element`,
        expected,
        this.actualValue
      );
    }
  }

  protected _matchElement(
    actual: any,
    expected: any,
    location: LocationMode,
    elMode: MatchMode
  ): boolean {
    if (elMode === MatchMode.literal) {
      return actual === expected;
    }

    return this._heuristicMatch(actual, expected, location, elMode);
  }

  protected _heuristicMatch(
    actual: any,
    expected: any,
    location: LocationMode,
    elMode: MatchMode.asserts | MatchMode.normal
  ): boolean {
    if (expected instanceof RegExp) {
      if (typeof actual === "string") {
        return expected.test(actual);
      } else if (
        actual instanceof RegExp &&
        actual.toString() === expected.toString()
      ) {
        return true;
      }

      return false;
    } else if (expected instanceof Function) {
      try {
        if (elMode === MatchMode.asserts) {
          return expected(this.wrap(actual));
        }
        return expected(actual);
      } catch (err) {
        return false;
      }

      /** What would recursion even mean WRT a data structure where element position
       * is semantic? If you ask, "does the array contain (sequentially, from left/right,
       * at all, etc)," what does that mean for a sub-array? I think we should require
       * any recursion to be explicitly spelled out via lambda assertions.
       */
      /* } else if (expected instanceof Array) {
              let newPath = path.slice(0);
              newPath.push(""+index);
              this._assertHasElements(actual, expected, location, elMode, path); */
    } else {
      return this._deeplyEquals(actual, expected, EqType.strictly);
    }
  }

  protected _assertActualArray(): void {
    if (!(this.actualValue instanceof Array)) {
      this.specError(
        "should be an array type",
        "an array type",
        this.id(this.actualValue)
      );
    }
  }

  protected _assertActualArrayOrString(): void {
    if (
      !(
        this.actualValue instanceof Array ||
        typeof this.actualValue === "string"
      )
    ) {
      this.specError(
        "should be an array or string type",
        "an array type",
        this.id(this.actualValue)
      );
    }
  }

  protected _assertExpectationIsFunction(expectation: any): void {
    if (!(expectation instanceof Function)) {
      this.specError(
        "expectation should be a function",
        "a function",
        this.id(this.actualValue)
      );
    }
  }
}
