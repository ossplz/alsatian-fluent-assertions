import {
    Test,
    TestCase,
    Any,
    Expect
  } from "alsatian";
import { Assert } from "../../src/assert";
import { FluentNode } from "../../src/types/fluent-node";
import { SpecError } from "../../src/errors/spec-error";

class SomeClass {
    prop: string = "   3   ";
}

export class MixedExamples {
    @Test()
    public NarrowARegex_Pass() {
        try {
            Assert(new SomeClass())
                .is(SomeClass)
                .has(o => o.prop)
                .that.hasMatch(/(\d+)/) // alt 'matches' that returns match result scope
                .that.has(matchParts => +matchParts[0])
                .that.equals(3);
        } catch(err) {
            Assert.fail(err);
        }
    }

    @Test()
    public NarrowARegex_Fail() {
        try {
            Assert(new SomeClass())
                .is(SomeClass)
                .has(o => o.prop)
                .that.hasMatch(/(\d+)/) // alt 'matches' that returns match result scope
                .that.has(matchParts => +matchParts[2])
                .that.equals(3);
            Assert.fail("Should have errored before here.");
        } catch(err) {
        }
    }

    @Test()
    public TestErrors() {
        let n = new FluentNode("Assert", typeof(""));
        let n2 = new FluentNode("has", "fn", n);
        let n3 = new FluentNode("that", null, n2);
        let n4 = new FluentNode("matches", /123/.toString(), n3);
        throw new SpecError(n4, "Something didn't match something", undefined, undefined);
    }
}