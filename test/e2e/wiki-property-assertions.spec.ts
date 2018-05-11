import { Test, TestCase, Any } from "alsatian";
import { Assert } from "../../src/assert";

class Bob {
  public prop: string = "   3   ";
}

// Helps ensure our docs stay accurate.
export class WikiPropertyAssertions {
  @Test()
  public has_aliasing() {
    Assert([1, 2, 3]).has([1, 2]); // same as .hasKeys([1,2])
    Assert({ myProp: 3 }).has("myProp"); // same as .hasProperty(o => o.myProp)
    Assert({ myProp: 3 }).has(o => o.myProp); // same as .hasProperty(o => o.myProp)
    Assert({ myProp: 3 }).has({ myProp: 3 }); // same as .hasProperties({ myProp: 3 })
  }

  @Test()
  public hasProperties_differentWays() {
    const viewModel = new ViewModel();
    Assert(viewModel).has({
      username: /exampleuser\d+/,
      email: e => Assert(e).matches(/\w+\@example.com/),
      academicInfo: {
        gpa: g => g > 3.5,
        type: "Graduate Student"
      }
    });
  }

  @Test()
  public hasKeys_example() {
    const viewModel = { one: 1, two: 2, three: 3 };
    Assert(viewModel).hasKeys(["one", "two", "three"]);
  }

  @Test()
  public hasElements_example() {
    const results = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    Assert(results).hasElements([4, 5, 6]);
  }
}

class ViewModel {
  public username: string = "exampleuser1234@somedomain";
  public email: string = "someone@example.com";
  public academicInfo = {
    gpa: 3.7,
    type: "Graduate Student"
  };
}
