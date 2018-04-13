import { IFluentCore } from "./i-fluent-core";
import { INarrowableOperators } from "./i-narrowable-operators";

export interface INarrowableFluentCore<T, TThat> extends IFluentCore<T>, INarrowableOperators<TThat> {

}