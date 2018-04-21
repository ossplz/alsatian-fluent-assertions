import { ElementPattern } from "./element-pattern";
import { ElementPatternType } from "./element-pattern-type";
import { ElementQuantity } from "./element-quantity";

// TODO: here to consider this, but its not yet exposed.
export namespace E {
    export function zeroOrMore<T>(ctorOrSat: ElementPatternType<T> = null) {
        return new ElementPattern<T>(ElementQuantity.zeroOrMore, ctorOrSat);
    }
    export function oneOrMore<T>(ctorOrSat: ElementPatternType<T> = null) {
        return new ElementPattern<T>(ElementQuantity.oneOrMore, ctorOrSat);
    }
    export function none<T>(ctorOrSat: ElementPatternType<T> = null) {
        return new ElementPattern<T>(ElementQuantity.none, ctorOrSat);
    }
    export function one<T>(ctorOrSat: ElementPatternType<T> = null) {
        return new ElementPattern<T>(ElementQuantity.one, ctorOrSat);
    }
    export function quantity<T>(n: number, ctorOrSat: ElementPatternType<T> = null) {
        return new ElementPattern<T>(n, ctorOrSat);
    }
    export function range<T>(m: number, n: number, ctorOrSat: ElementPatternType<T> = null) {
        return new ElementPattern<T>([m, n], ctorOrSat);
    }
}