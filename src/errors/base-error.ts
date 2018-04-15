import * as StackTrace from 'stacktrace-js';
import { MatchError } from 'alsatian';

export class BaseError extends MatchError {
    public __proto__: Error;
    constructor(_message?: string, expected?: string, actual?: string) {
        // inheritance. see https://stackoverflow.com/a/48567560/2356600
        const trueProto = new.target.prototype;
        super(_message, expected, actual);
        this.__proto__ = trueProto; 
    }
    public message: string;
    public name: string;
    public stack?: string;
}