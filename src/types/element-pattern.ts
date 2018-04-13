import { ElementQuantity } from "./element-quantity";
import { ElementPatternType } from "./element-pattern-type";

export class ElementPattern<T> {
    constructor(
        public quantity: ElementQuantity | number | [number, number],
        public ctorOrSat: ElementPatternType<T> = null)
    {}
}
