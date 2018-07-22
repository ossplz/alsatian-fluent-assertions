import { ElementsMatcher } from "./elements-matcher";
import { IPropertiesMatcherWithHelpers } from "./i-properties-matcher-with-helpers";
import { PropertiesMatcher } from "./properties-matcher";
import {
  SubsetPropertyDict,
  LocationMode,
  MatchMode,
  SubsetPropertyLiteralsDict,
  SubsetPropertyAssertsDict,
  AllPropertyAssertsDict,
  AssertionContext
} from "../types";
import { INarrowableFluentCore } from "./i-narrowable-fluent-core";
import { IFluentCore } from "./i-fluent-core";

export class PropertiesMatcherWithHelpers<T, TNext, TPrev> extends PropertiesMatcher<T, TNext, TPrev>
  implements IPropertiesMatcherWithHelpers<T, TNext, TPrev> {
  constructor(actualValue: any,
    nextValue: any,
    initial: boolean,
    prevCore?: IFluentCore<any, any, any>,
    ctxt?: AssertionContext)
  {
    super(actualValue, nextValue, initial, prevCore, ctxt);
  }

  public has<K extends keyof T>(
    selector: (o: T) => T[K]
  ): INarrowableFluentCore<T, T[K], TPrev>;

  public has<K extends keyof T>(key: K): INarrowableFluentCore<T, T[K], TPrev>;

  public has<T2 extends Array<any>>(
    expected: T2,
    location?: LocationMode,
    match?: MatchMode
  ): IFluentCore<T, TNext, TPrev>;

  public has(
    subsetDict: SubsetPropertyDict<T>,
    matchMode?: MatchMode.normal
  ): IFluentCore<T, TNext, TPrev>;

  public has(
    subsetDict: SubsetPropertyLiteralsDict<T>,
    matchMode: MatchMode.literal
  ): IFluentCore<T, TNext, TPrev>;

  public has(
    subsetDict: SubsetPropertyAssertsDict<T>,
    matchMode: MatchMode.asserts
  ): IFluentCore<T, TNext, TPrev>;
  public has(
    expected: any,
    option1?: LocationMode | MatchMode,
    option2?: MatchMode
  ): IFluentCore<T, TNext, TPrev> {
    this.setCurrentNode(this.has.name, typeof expected);
    if (expected instanceof Array) {
      return this.hasElements(expected, option1 as LocationMode, option2);
    } else if (expected instanceof Function) {
      return this.hasProperty(expected);
    } else if (typeof expected === "string") {
      return this.hasProperty(o => o[expected]);
    } else {
      this.hasProperties(expected, <any>option1);
    }

    return this.generateFluentState(this.actualValue, null, false);
  }

  public hasAsserts<T2 extends Array<any>>(
    expected: T2,
    location?: LocationMode
  ): IFluentCore<T, TNext, TPrev>;

  public hasAsserts(expected: SubsetPropertyAssertsDict<T>): IFluentCore<T, TNext, TPrev>;
  public hasAsserts(expected: any, location?: LocationMode): IFluentCore<T, TNext, TPrev> {
    this.setCurrentNode(this.hasAsserts.name, typeof expected);
    if (expected instanceof Array) {
      return this.hasElements(expected, location, MatchMode.asserts);
    }

    this._properties(this.actualValue, expected, [], MatchMode.asserts);
    return this.generateFluentState(this.actualValue, null, false);
  }

  public hasAllAsserts(expected: AllPropertyAssertsDict<T>): IFluentCore<T, TNext, TPrev> {
    this.setCurrentNode(this.hasAllAsserts.name, null);
    return this.hasAsserts(expected);
  }
}
