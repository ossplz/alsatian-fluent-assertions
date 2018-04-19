import {
    Test,
    TestCase,
    Any,
    MatchError
  } from "alsatian";
  import { Assert } from "../../src/assert";

class SomeClass {
    prop: string = "   3   ";
}

export class ErrorPaths {
    @Test()
    public errorPaths_validForRealExample() {
        let viewModel = new SomeClass();
        let a = Assert(viewModel)
            .is(SomeClass)
            .has(o => o.prop)
            .that.hasMatch(/(\d+)/) // narrow scope (that) to prop, then match
            .that.has(matchParts => +matchParts[0])
            .that;

        Assert(() => a.equals(123123))
            .throws(MatchError)
            .that.has({ message: /Assert\[object\].is\[SomeClass\].has\[function\].that.hasMatch\[\/\(\\d\+\)\/\].that.has\[function\].that.equals/ });
    }

    @Test()
    public errorPaths_baseFluentForksAccurate() {
        let a = Assert({ one: 1, two: 2});
        Assert(() => a.has(e => e.one).that.equals(2))
            .throws(MatchError)
            .that.has({ message: /Assert\[object\].has\[function\].that.equals/ });
        Assert(() => a.has(e => e.two).that.equals(1))
            .throws(MatchError)
            .that.has({ message: /Assert\[object\].has\[function\].that.equals/ });
    }

    @Test()
    public errorPaths_fluentForksAccurate() {
        let a = Assert({ oneDepth: { one: 1, two: 2} }).has(o => o.oneDepth).that;
        Assert(() => a.has(e => e.one).that.equals(2))
            .throws(MatchError)
            .that.has({ message: /Assert\[object\].has\[function\].that.has\[function\].that.equals/ });
        Assert(() => a.has(e => e.two).that.equals(1))
            .throws(MatchError)
            .that.has({ message: /Assert\[object\].has\[function\].that.has\[function\].that.equals/ });
    }
}