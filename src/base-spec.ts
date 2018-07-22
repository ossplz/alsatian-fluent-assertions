import { AsyncSetup, AsyncTeardown, AsyncSetupFixture } from "alsatian";
import { Assert } from "./assert";
import { ConfiguredAssert } from "./types";
import { AssertionContext } from "./types/assertion-context";

export class BaseSpec {
    protected assert: ConfiguredAssert;
    protected assertionContext: AssertionContext;

    @AsyncSetup
    protected beforeEach() {
        this.assertionContext = new AssertionContext();
        this.assert = Assert.configure(this.assertionContext);
    }

    @AsyncTeardown
    protected afterEach() {
        Assert.validateAssertions(this.assertionContext);
    }
}