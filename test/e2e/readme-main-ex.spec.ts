import {
    Test,
    TestCase,
    Any,
    Expect
  } from "alsatian";
  import { Assert } from "../../src/assert";

class SomeType {
    prop: string = "user 007";
    other: string = "..."
}

export class ReadmeMainExample {

    @Test()
    public MainExample_CanPass() {
        let obj = new SomeType();
        let expected = obj;
        Assert(obj)
            .is(SomeType)
            .has(o => o.prop)
            .that.hasMatch(/(\d+)/) // alt 'matches' that returns match result scope
            .that.has(matchParts => +matchParts[0])
            .that.equals(7);
        Assert(obj).equals(expected);
        Assert(obj).has({
            prop: "user 007",
            other: p => Assert(p).matches(/.../)
        });
    }
}