import * as StackTrace from "stacktrace-js";
import { MatchError } from "alsatian";

export class BaseError extends MatchError {
  // tslint:disable-next-line
  public __proto__: Error;
  public message: string;
  public name: string;
  public stack?: string;
  constructor(_message?: string, expected?: string, actual?: string) {
    // inheritance. see https://stackoverflow.com/a/48567560/2356600
    const trueProto = new.target.prototype;
    super(_message, expected, actual);
    this.__proto__ = trueProto;
  }
}
