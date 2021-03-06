import { Test, TestCase, Any, Expect } from "alsatian";
import { Assert } from "../../src/assert";

class SomeClass {
  public prop: string = "   7   ";
}

export class WikiHome {
  @Test()
  public firstFluentExample_canPass() {
    const viewModel = new SomeClass();
    Assert(viewModel)
      .is(SomeClass)
      .has(o => o.prop)
      .that.hasMatch(/\d+/) // narrow scope (that) to prop, then match
      .that.converted(Number)
      .equals(7);
  }

  @Test()
  public secondFluentExample_CanPass() {
    const viewModel = new SomeClass();
    Assert(viewModel)
      .is(SomeClass)
      .has({
        prop: p => Assert(p).hasMatch(/\d+/)
          .that.converted(Number).equals(7)
      });
  }

  @Test()
  public alsatianDefault_CanPass() {
    const viewModel = new SomeClass();
    Expect(viewModel instanceof SomeClass).toBeTruthy();
    Expect(viewModel.prop).toBeDefined();
    const regex = /(\d+)/;
    Expect(viewModel.prop).toMatch(regex);
    Expect(viewModel.prop.match(regex)[0]).toEqual(7);
  }

  @Test()
  public forkingScopes_Num1_CanPass() {
    const viewModel = { someProp: { itsOwnProp: 2, someOther: 3 } };
    const a = Assert(viewModel).hasProperty(v => v.someProp);
    a.that.hasProperty(p => p.itsOwnProp);
    a.that.hasProperty(p => p.someOther).that.equals(3);
  }

  @Test()
  public forkingScopes_Num2_CanPass() {
    const viewModel = { someProp: { itsOwnProp: 123, someOther: 3 } };
    Assert(viewModel)
      .hasAsserts({
        someProp: {
          itsOwnProp: a => a.isDefined(),
          someOther: 3
        }
      });
  }
}
