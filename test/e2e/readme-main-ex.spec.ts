import { Test, TestCase, Any } from "alsatian";
import { Assert } from "../../src/assert";

class UserModel {
  public name: string = "agent 007";
  public other: string = "...";
  public address: Redacted = new Redacted();
  public phone: string = "+441234567890";
  public deploy(): void {

  }
}

class Redacted {

}

export class ReadmeMainExample {
  @Test()
  public MainExample_CanPass() {
    const obj = new UserModel();
    const expected = obj;
    Assert(obj)
      .is(UserModel)
      .has(o => o.name)
      .that.hasMatch(/\d+/) // alt 'matches' that returns match result scope
      .that.converted(parts => +parts[0])
      .equals(7);
  
  Assert(obj).equals(expected);
  
  Assert(obj)
    .hasAsserts({ // same as .has/.hasProperties with MatchMode.Asserts
      name: "agent 007",
      address: a => a.is(Redacted),
      phone: /\+44\d{10}/,
      deploy: a => a.is(Function).not.throws()
    });
  }
}
