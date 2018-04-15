import * as StackTrace from "stacktrace-js";
import { BaseError } from "./base-error";
import { FluentNode } from "../types/fluent-node";

export class SpecError extends BaseError {
    constructor(
        node: FluentNode,
        _message: string,
        expected: any,
        actual: any
    ) {
        let frames = StackTrace.getSync();
        frames = frames.filter(SpecError._filterToUserFrames);
        let line = (frames[1] || <any>{}).lineNumber;
        let message = `${_message} @ ${SpecError._stringifyPosition(node)}`;
        if (line) {
            message += `, line: ${line}.`;
        }
        super(message, expected, actual);
    }

    private static _stringifyPosition(node: FluentNode): string {
        let current = node;
        let result = current.name;
        while (current = current.parent) {
            result = `${current.fullname}.${result}`
        }
        return result;
    }

    private static _filterToUserFrames(f: StackTrace.StackFrame): boolean {
        let fn = f.functionName || "";
        return (f.source || "").indexOf("alsatian-fluent-assertions") === -1
          || (fn.indexOf("PropertiesMatcher") === -1
                && fn.indexOf("SimpleMatcher") === -1
                && fn.indexOf("Operators") === -1);
    }
}