import { IFluentCore } from "./i-fluent-core";
import { INarrowableOperators } from "./i-narrowable-operators";
import { IFluentNode } from "../types/i-fluent-node";

export interface INarrowableFluentCore<T, TThat, TPrev>
  extends IFluentCore<T, TThat, TPrev>,
    INarrowableOperators<TThat, T, TPrev>,
    IFluentNode {}
