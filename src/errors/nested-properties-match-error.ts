import { SpecError } from "./spec-error";
import { FluentNode } from "../types/fluent-node";

export class NestedPropertiesMatchError extends SpecError {
  public constructor(node: FluentNode, message: string, path: string, error: Error) {
    /* istanbul ignore next */
    super(
      node,
      `Property at path '${path}': ${message}.` +
        "\n" +
        error.message +
        "\n" +
        error.stack, undefined, undefined
    );
  }
}
