import { IFluentCore } from "../matchers";

export type ConfiguredAssert
    = <T, TNext>(value?: any) => IFluentCore<T, TNext, void>;