import {
    Test,
    TestCase,
    Any,
    Expect
  } from "alsatian";
  import { Assert } from "../../src/assert";
import { SpecError } from "../../src/errors";
import { IFluentNode, RootNode } from "../../src/types";
import { FluentMatcherBase } from "../../src/matchers";

export class SpecErrorTests {
    @Test()
    public constructor_buildsCorrectAssertPath() {
        let node = new RootNode("Assert", "object");
        let child = new FluentMatcherBase({}, null, false);
        child.parent = node;
        child.name = "equals";
        child.details = "object";
        node = child;
        child = new FluentMatcherBase({}, null, false);
        child.parent = node;
        child.name = "that";
        child.details = undefined;        
        node = child;
        child = new FluentMatcherBase({}, null, false);
        child.parent = node;
        child.name = "has";
        child.details = undefined;
        let e = new SpecError(child, "something", <any>{}, 3);
        
        Assert(e.message).matches(/Assert\[object\].equals\[object\].that.has/);
    }

    @Test() _filterToUserFrames_noSource_IncludeIt() {
        let result = SpecError["_filterToUserFrames"](<StackTrace.StackFrame>{ });
        Assert(result).equals(true);
    }
}