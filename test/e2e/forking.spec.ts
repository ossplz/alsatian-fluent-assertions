import {
    Test,
    TestCase,
    Any
  } from "alsatian";
  import { Assert } from "../../src/assert";
import { SpecError } from "../../src/errors";

class SomeType {
    prop: string = "user 007";
    other: string = "..."
}

/**
 * These tests help ensure that state is properly maintained when forking a fluent assertion scope, manually.
 */
export class ForkingTests {
    @Test()
    public Level0_Fork() {
        let v = "something";
        let a = Assert(v);
        a.matches(/met/);
        a.matches(/hing/);
        a.not.matches(/123/);
        a.equals("something");
        a.not.equals("123");
        Assert(() => a.equals("nopers"))
            .throws(SpecError)
            .that.has({
                message: /should strictly.*equal/
            });
    }

    @Test()
    public Level1_ThatFork() {
        let viewModel = {
            someProp: {
                itsOwnProp: 2,
                someOther: 3
            }
        };
        let a = Assert(viewModel).hasProperty(v => v.someProp);
        a.that.hasProperty(p => p.itsOwnProp);
        a.that.hasProperty(p => p.someOther).that.equals(3);
    }

    @Test()
    public Level2_ThatFork() {
        let viewModel = { 
            someProp: { 
                itsOwnProp: {
                    1: "2345"
                },
                someOther: 3
            }
        };
        let a = Assert(viewModel).hasProperty(v => v.someProp);
        let b = a.that.hasProperty(p => p.itsOwnProp).that;
        b.has({ 1: /234/ })
        b.has({ 1: /345/ });
    }

}