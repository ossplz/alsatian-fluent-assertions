import {
  Test,
  TestCase,
  Any,
  MatchError
} from "alsatian";
import { Assert } from "../../src/assert";

export class ToMatchTests {
  @TestCase("asdfasdf", /asdf/)
  public matchesString(target: string, regexp: RegExp) {
    const assert = Assert(target);

    Assert(() => assert.matches(regexp)).not.throws();
  }

  @TestCase("asdfasdf", /^asdf$/)
  public doesNotMatchString(target: string, regexp: RegExp) {
    const assert = Assert(target);

    Assert(() => assert.matches(regexp))
      .throws(MatchError)
      .that.has({
        message: /should match/
      });
  }

  @TestCase({ 123: 456 }, /asdf/)
  public errorsOnNonStringType(target: string, regexp: RegExp) {
    const assert = Assert(target);

    Assert(() => assert.matches(regexp))
      .throws(MatchError)
      .that.has({
        message: /actual value type was not a string/
      });
  }

  @TestCase("asdfasdf", /asdf/)
  public notInvertsMatches(target: string, regexp: RegExp) {
    const assert = Assert(target);

    Assert(() => assert.not.matches(regexp)).throws();
  }
}
