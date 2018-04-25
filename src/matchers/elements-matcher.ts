import { SimpleMatcher } from "./simple-matcher";
import { IPropertiesMatcher } from "./i-properties-matcher";
import { MatchMode, LocationMode, EqType } from "../types";
import { IFluentCore } from "./i-fluent-core";
import { IElementsMatcher } from "./i-elements-matcher";

/** @inheritDoc */
export class ElementsMatcher<T>
  extends SimpleMatcher<T>
  implements IElementsMatcher<T>
{
  constructor(
    actualValue: any,
    nextValue: any,
    initial: boolean
  ) {
    super(actualValue, nextValue, initial);
  }

    /** @inheritDoc */
    public hasElements(
        expected: Array<any>,
        location: LocationMode = LocationMode.contains,
        elMode: MatchMode = MatchMode.normal
      ): IFluentCore<T> {
        this.setCurrentNode(this.hasElements.name, `${location}, ${elMode}`);
        this._assertHasElements(this.actualValue, expected, location, elMode, []);
        return this.setFluentState(this.actualValue, null, false);
      }
    
      protected _assertHasElements(
        actual: Array<any>,
        expected: Array<any>,
        location: LocationMode,
        elMode: MatchMode,
        path: string[]
      ) {
        if (!(actual instanceof Array)) {
          this.specError("not an array type", expected, this.actualValue);
        }
    
        if (expected.length > this.actualValue.length) {
          this.specError("expected array is longer than the actual array.", expected, this.actualValue);
        }
    
        if (location == LocationMode.contains) {
          this._assertContainsElements(expected, location, elMode, path);
        } else if (location === LocationMode.sequentialContains) {
          this._assertSequentialHasElements(expected, location, elMode, path);
        } else if (location === LocationMode.startsWith) {
          this._assertHasElementsFrom(expected, 0, location, elMode, path);
        } else {
          const start = this.actualValue.length - expected.length;
          this._assertHasElementsFrom(expected, start, location, elMode, path);
        }
      }
    
      protected _assertHasElementsFrom(
        expected: Array<any>,
        start: number,
        location: LocationMode,
        elMode: MatchMode,
        path: string[]
      ): void {
        for (let i=start; i<expected.length; i++) {
          this._assertElement(i, this.actualValue[i], expected[i-start], location, elMode);
        }
      }
    
      protected _assertContainsElements(
        expected: Array<any>,
        location: LocationMode,
        elMode: MatchMode,
        path: string[]
      ): void {
          for (let i=0; i<expected.length; i++) {
            let found = false;
            for (let j=0; j<this.actualValue.length; j++) {
                if (this._matchElement(this.actualValue[j], expected[i], location, elMode)) {
                    found = true;
                    break;
                }
            }

            if (this.maybeInvert(!found)) {
                this.specError(`should${this.negation}contain expected elements (index: ${i}, value: ${expected[i]})`, expected, this.actualValue);
            }
        }            
      }
    
      protected _assertSequentialHasElements(
        expected: Array<any>,
        location: LocationMode,
        elMode: MatchMode,
        path: string[]
      ): void {
        const lenDelta = this.actualValue.length - expected.length;
        let hasSeq: boolean;
        let anyHas: boolean = false;
        for (let start=0; start<lenDelta; start++) {
          hasSeq = true;
          for (let i=start; i<start + lenDelta; i++) {
            if (! this._matchElement(this.actualValue[i], expected[i - start], location, elMode)) {
                hasSeq = false;
                break;
            }
          }
          anyHas = anyHas || hasSeq;
          if (anyHas && this.maybeInvert(true)) { // if we're inverted, check all
            break;
          }
        }

        if (this.maybeInvert(! anyHas)) {
            this.specError(`should${this.negation}find sequence in array`, expected, this.actualValue);
        }
      }
    
      protected _assertElement(
        index: number,
        actual: any,
        expected: any,
        location: LocationMode,
        elMode: MatchMode
      ): void {
        if (!this._matchElement(actual, expected, location, elMode)) {
          this.specError(`index: ${index} should${this.negation}match`, expected, this.actualValue);
        }
      }
    
      protected _matchElement(actual: any, expected: any, location: LocationMode, elMode: MatchMode): boolean {
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
          } else if (actual instanceof RegExp && actual.toString() === expected.toString()) {
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
      
      public allSatisfy(
        predicate: (el: T, i?: number) => boolean
      ): T extends any[] ? IFluentCore<T> : void {
        this.setCurrentNode(this.allSatisfy.name);
        const result = this.actualValue.every(predicate);
        if (this.maybeInvert(!result)) {
            this.specError(`should all${this.negation}satisfy predicate`, predicate, this.actualValue);
        }
        return <any>this.setFluentState(this.actualValue, null, false);
      }
    
      public anySatisfy(
        predicate: (t: T) => boolean
      ): T extends any[] ? IFluentCore<T> : void {
        this.setCurrentNode(this.anySatisfy.name);
        const result = this.actualValue.some(predicate);
        if (this.maybeInvert(!result)) {
            this.specError(`some should${this.negation}satisfy predicate`, predicate, this.actualValue);
        }
        return <any>this.setFluentState(this.actualValue, null, false);
      }
}
