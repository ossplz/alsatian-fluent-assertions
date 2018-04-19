import {
    Test,
    TestCase,
    Any,
    Expect
  } from "alsatian";
  import { Assert } from "../../src/assert";

class SomeClass {
    prop: string = "   3   ";
}

export class DocsHome {

    @Test()
    public firstFluentExample_CanPass() {
        let viewModel = new SomeClass();
        Assert(viewModel)
            .is(SomeClass)
            .has(o => o.prop)
            .that.hasMatch(/(\d+)/) // narrow scope (that) to prop, then match
            .that.converted(parts => +parts[0])
            .equals(3);
    }

    @Test()
    public alsatianDefault_CanPass() {
        let viewModel = new SomeClass();
        Expect(viewModel instanceof SomeClass).toBeTruthy();
        Expect(viewModel.prop).toBeDefined();
        let regex = /(\d+)/;
        Expect(viewModel.prop).toMatch(regex);
        Expect(viewModel.prop.match(regex)[0]).toEqual(3);
    }

    @Test()
    public forkingScopes_Num1_CanPass() {
        let viewModel = { someProp: { itsOwnProp: 2, someOther: 3 }};
        let a = Assert(viewModel).hasProperty(v => v.someProp);
        a.that.hasProperty(p => p.itsOwnProp);
        a.that.hasProperty(p => p.someOther).that.equals(3);
    }

    @Test()
    public forkingScopes_Num2_CanPass() {
        let viewModel = { someProp: { itsOwnProp: 123, someOther: 3 }};
        Assert(viewModel)
            .has({
                someProp: {
                    itsOwnProp: p => Assert(p).defined(),
                    someOther: 3,
                }
            });
    }
}