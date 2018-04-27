import { SpecError } from "./spec-error";
import { IFluentNode } from "../types/i-fluent-node";

export class NestedPropertiesMatchError extends SpecError {
  public constructor(
    node: IFluentNode,
    message: string,
    path: string,
    error: Error
  ) {
    /* istanbul ignore next */
    super(
      node,
      `Property at path '${path}': ${message}.` +
        "\n" +
        error.message +
        "\n" +
        error.stack,
      undefined,
      undefined
    );
  }
}
