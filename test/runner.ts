import { TapBark } from "tap-bark";
import { TestSet, TestRunner } from "alsatian";

(async () => {
  const testSet = TestSet.create();
  testSet.addTestsFromFiles("./test/expect-tests/*.spec.ts");
  testSet.addTestsFromFiles("./test/errors-tests/*.spec.ts");
  testSet.addTestsFromFiles("./test/e2e/*.spec.ts");

  const testRunner = new TestRunner();

  testRunner.outputStream
    //.pipe(TapBark.create().getPipeable())
    .pipe(process.stdout);

  await testRunner.run(testSet);
})().catch(e => {
  // tslint:disable-next-line
  console.error(e);
  process.exit(1);
});
