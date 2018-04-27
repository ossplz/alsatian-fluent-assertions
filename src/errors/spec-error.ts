import * as StackTrace from "stacktrace-js";
import { BaseError } from "./base-error";
import { IFluentNode } from "../types/i-fluent-node";

export class SpecError extends BaseError {
  private static _stringifyPosition(node: IFluentNode): string {
    let current = node;
    let result = current.name;
    while (current.parent) {
      current = current.parent;
      result = `${current.fullname}.${result}`;
    }
    return result;
  }

  private static _filterToUserFrames(f: StackTrace.StackFrame): boolean {
    const fn = f.functionName || "";
    return (
      (f.source || "").indexOf("alsatian-fluent-assertions") === -1 ||
      (fn.indexOf("PropertiesMatcher") === -1 &&
        fn.indexOf("SimpleMatcher") === -1 &&
        fn.indexOf("Operators") === -1)
    );
  }

  constructor(node: IFluentNode, _message: string, expected: any, actual: any) {
    let frames = StackTrace.getSync();
    frames = frames.filter(SpecError._filterToUserFrames);
    const line = (frames[1] || ({} as any)).lineNumber;
    let message = `${_message} @ ${SpecError._stringifyPosition(node)}`;
    if (line) {
      message += `, line: ${line}.`;
    }
    super(message, expected, actual);
  }
}
