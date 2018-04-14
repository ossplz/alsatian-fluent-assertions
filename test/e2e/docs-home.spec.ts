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
    public alsatianDefault_Success() {
        let viewModel = new SomeClass();
        Expect(viewModel instanceof SomeClass).toBeTruthy();
        Expect(viewModel.prop).toBeDefined();
        let regex = /(\d+)/;
        Expect(viewModel.prop).toMatch(regex);
        Expect(viewModel.prop.match(regex)[0]).toEqual(3);
    }
}