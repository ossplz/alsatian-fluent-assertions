import { Test } from "alsatian";
import { Assert } from "../../src/assert";

export class MaybeNotTest {
    @Test()
    public maybeNot_conditionalDoubleNegation() {
        Assert("something")
            .maybe(true).not.equals("another thing");
        Assert("something")
            .maybe(false).not.equals("something");
    }

    @Test()
    public notNot_multipleNegation() {
        Assert("something")
            .not.not.not.equals("another thing");
        Assert("something")
            .not.not.equals("something");
    }
}