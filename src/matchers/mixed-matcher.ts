import { Matcher } from "alsatian";

import { PropertiesMatcher } from "./properties-matcher";
import { EntityMatcher } from "./entity-matcher";
import { Operators } from "./operators";
//import { IFluentCore } from "./i-fluent-core";
import { INarrowableFluentCore } from "./i-narrowable-fluent-core";

/**
 * Mixin version of all matchers to allow any function to be used at runtime
 */
function Mixin<T>(...mixins: any[]) : new(a: any, b: any, c: any) => T {
  class X {
      constructor(a: any, b: any, c: any) {
        let obj = new mixins[0](a, b, c);
      }
  }
  //Object.assign(X.prototype, ...mixins.map(m => m.prototype));
  try {
  let i = 0;
  mixins.forEach(baseCtor => {
    console.log(i++, baseCtor);
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      X.prototype[name] = baseCtor.prototype[name];
    });
  });
} catch (ex) { console.log("hwat happened!!", ex); throw "Boom!"}
  return <any>X;
}

export class MixedMatcher<T, TNext> extends Mixin(PropertiesMatcher, EntityMatcher, Operators) {
  constructor(protected actualValue: T, nextValue: TNext, invertResult: boolean) {
    super(actualValue, nextValue, invertResult);
  }
}
/*export interface MixedMatcher<T, TNext> extends INarrowableFluentCore<T, TNext> {}

applyMixins(
  MixedMatcher,
  PropertiesMatcher,
  EntityMatcher,
  Operators
);
function applyMixins(derivedCtor: any, ...baseCtors: Array<any>) {
  let i=0; 
  baseCtors.forEach(baseCtor => {
    console.log(i++, baseCtor);
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
  });
}
*/