import { inject, injectable } from "inversify";
import { Refs } from "./references";
import { IPropertiesMatcher } from "./matchers";

// Typescript doesn't yet support mixins in the way we need.
// In order to eliminate recursive class references (the dynamic return values of our fluent methods),
// we have to have a DI framework take all references, and piece things together ourselves.

@injectable()
export class MatcherFactory {
    constructor(
        //@inject(Refs.PropertiesMatcherClass) private propsMatcherClass: any,
        //@inject(Refs.SimpleMatcherClass) private simpleMatcherClass: any,
        //@inject(Refs.OperatorsClass) private operatorsClass: any
    ) {

    }

    /*public buildMatcher<T>(): T {
        class X {

        }
        applyMixins(
            X,
            this.propsMatcherClass,
            this.simpleMatcherClass,
            this.operatorsClass
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
    }*/
}
