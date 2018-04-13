import {
  IFluentCore,
  INarrowableFluentCore,
  PropertiesMatcher
} from "./matchers";
import { IAssert } from "./assert.i";
import { containerBuilder } from "./di";
import { MatcherFactory } from "./matcher-factory";
import { buildAssert } from "./build-assert";
import { MixedMatcher } from "./matchers/mixed-matcher";

/*function AssertFunction<ActualType, TNext>(
  actualValue: ActualType,
  nextValue: TNext = null,
  invertResult: boolean = false
): IFluentCore<any> {
  return new MixedMatcher(actualValue, nextValue, invertResult);
}*/

/*tslint:disable*/
//const ASSERT = buildAssert<IAssert>(AssertFunction);
//export { ASSERT as Assert };
/*tslint:disable*/

export let Assert = <T, TNext>(value?: T, nextValue?: TNext, invert: boolean = false): INarrowableFluentCore<T, TNext> => new PropertiesMatcher<T>(value, nextValue, invert);
//let matcherFactory = containerBuilder().get<MatcherFactory>(MatcherFactory);
/*export function Assert<T, TNext>(value?: T, nextValue?: TNext, invert: boolean = false): INarrowableFluentCore<T, TNext> {
  return matcherFactory.buildMatcher();
}*/
