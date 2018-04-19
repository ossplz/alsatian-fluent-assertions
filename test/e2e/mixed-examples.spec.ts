import {
    Test,
    TestCase,
    Any
  } from "alsatian";
import { Assert } from "../../src/assert";
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
}