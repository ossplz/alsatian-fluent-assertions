import {
    Test,
    TestCase,
    AsyncTest,
    Any
} from "alsatian";
import { Assert } from "../../src/assert";
import { SpecError } from "../../src/errors";

// See: https://github.com/Microsoft/TypeScript/issues/13965
class MyError extends Error {
    // tslint:disable-next-line
    public __proto__: Error;
    constructor(message?: string) {
        const trueProto = new.target.prototype;
        super(message);

        // Alternatively use Object.setPrototypeOf if you have an ES6 environment.
        this.__proto__ = trueProto;
    }
}

export class ThrowsAsyncTests {
    @TestCase(0, true)
    @TestCase(0, false)
    @TestCase(100, true)
    @TestCase(100, false)
    @AsyncTest()
    public async shouldCatchAsyncThrow(ms: number, throws: boolean) {
        const assert = Assert(async () => {
            return new Promise<number>((resolve, reject) => {
                setTimeout(() => {
                    if (throws)
                        reject(new MyError());
                    else
                        resolve(123);
                }, ms);
            });
        });

        await Assert(async () => await assert.throwsAsync())
            .maybe(!throws).throwsAsync();
    }

    @TestCase(0, true)
    @TestCase(0, false)
    @TestCase(100, true)
    @TestCase(100, false)
    @AsyncTest()
    public async shouldCatchAsyncThrow_Negation(ms: number, throws: boolean) {
        const assert = Assert(async () => {
            return new Promise<number>((resolve, reject) => {
                setTimeout(() => {
                    if (throws)
                        reject(new MyError());
                    else
                        resolve(123);
                }, ms);
            });
        });

        await Assert(async () => await assert.not.throwsAsync())
            .maybe(throws).throwsAsync();
    }

    @TestCase(SyntaxError, true)
    @TestCase(MyError, false)
    @AsyncTest()
    public async shouldCatchAsyncThrow_IffType(type: { new (...args: any[]): Error }, throws: boolean) {
        const assert = Assert(async () => {
            return new Promise<void>((_, reject) => {
                setTimeout(() => {
                    reject(new MyError());
                }, 1);
            });
        });

        await Assert(async () => await assert.throwsAsync(type))
            .maybe(throws).throwsAsync();
    }
}
