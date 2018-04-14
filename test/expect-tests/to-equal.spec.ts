import {
  Test,
  TestCase,
  Any
} from "alsatian";
import { Assert } from "../../src/assert";
import { EqType } from "../../src/types";

export class ToEqualTests {
  @TestCase(undefined)
  @TestCase(null)
  @TestCase(0)
  @TestCase(42)
  @TestCase(4.2)
  @TestCase(-4.2)
  @TestCase("")
  @TestCase("something")
  public identicalSimpleTypesDontThrow(value: any) {
    const assert = Assert(value);

    Assert(() => assert.equals(value)).not.throws();
  }

  @TestCase(0, false)
  @TestCase("", false)
  @TestCase(1, true)
  @TestCase([], false)
  @TestCase([], "")
  @TestCase(["a"], "a")
  public looselyEqual(a: any, b: any) {
    const assert = Assert(a);

    Assert(() => assert.equals(b, EqType.loosely)).not.throws();
  }

  @TestCase(0, 1)
  @TestCase("", "a")
  @TestCase(false, true)
  @TestCase([], [false])
  @TestCase(["a"], "b")
  public looselyInequal(a: any, b: any) {
    const assert = Assert(a);

    Assert(() => assert.equals(b, EqType.loosely))
      .throws()
      .that.has({ message: /should loosely \(==\) equal/ });
  }

  @TestCase(0, false)
  @TestCase("", false)
  @TestCase(1, true)
  @TestCase([], false)
  @TestCase([], "")
  @TestCase(["a"], "a")
  public strictlyInequal(a: any, b: any) {
    const assert = Assert(a);

    Assert(() => assert.equals(b, EqType.strictly)).throws();
  }

  @TestCase({ one: 123, two: { 456: 789 } }, { one: 123, two: { 456: 789 } })
  @TestCase({ one: 123, two: "asdf" }, { one: 123, two: "asdf" })
  public deepStrictlyEqual(a: any, b: any) {
    const assert = Assert(a);

    Assert(() => assert.equals(b, EqType.deepStrictly)).not.throws();
  }

  @TestCase({ one: 123, two: { 456: 789 } }, { one: 123 })
  @TestCase({ one: 123, two: { 456: 789 } }, { one: 123, two: { 456: 788 } })
  public deepStrictlyInequal(a: any, b: any) {
    const assert = Assert(a);

    Assert(() => assert.equals(b, EqType.deepStrictly))
      .throws()
      .that.has({ message: /should deeply equal/ });
  }

  @TestCase({ one: "", two: { 456: "" } }, { one: false, two: { 456: [] } })
  @TestCase({ one: [], two: "asdf" }, { one: false, two: "asdf" })
  @TestCase({}, {})
  @TestCase(null, null)
  @TestCase(undefined, undefined)
  @TestCase(undefined, null)
  public deepLooselyEqual(a: any, b: any) {
    const assert = Assert(a);

    Assert(() => assert.equals(b, EqType.deepLoosely)).not.throws();
  }

  @TestCase({ one: "", two: { 456: "" } }, { one: "", two: { 456: ["asdf"] } })
  @TestCase({ one: [], two: "asdf" }, { one: [1], two: "asdf" })
  @TestCase({}, "{}")
  @TestCase(null, "null")
  @TestCase(undefined, false)
  public deepLooselyInequal(a: any, b: any) {
    const assert = Assert(a);

    Assert(() => assert.equals(b, EqType.deepLoosely))
      .throws()
      .that.has({ message: /should deeply equal/ });
  }

  @Test()
  public UnrecognizedEqTypeThrows() {
    const assert = Assert(123);

    Assert(() => assert.equals(123, "bogus" as EqType))
      .throws()
      .that.has({ message: /Unrecognized EqType: bogus/ });
  }
}
