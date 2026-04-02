```typescript title="a11y.ts"
import axe from "axe-core";
import { flow } from "@qawolf/flows/web";

export default flow(
  "Home Page Accessibility",
  "Web - Chrome",
  async ({
    test,
    launch,
    getInbox,
    setEnvironmentVariable,
    ...testContext
  }) => {
    await test("Home page accessibility", async () => {
      const { context } = await launch();
      context.setDefaultTimeout(8000);
      const page = await context.newPage();

      const targetUrl = process.env.BASE_URL;
      await page.goto(targetUrl);

      try {
        await page.getByRole("button", { name: /accept/i }).click({ timeout: 8000 });
      } catch (error) {
        console.log("Cookie consent banner not found");
      }

      try {
        await page.getByText("×").click({ timeout: 8000 });
      } catch (error) {
        console.log("Top notification bar not found");
      }

      await page.waitForLoadState("domcontentloaded");

      await page.addScriptTag({ content: axe.source });
      const axeResults = await page.evaluate(async () => {
        return await window.axe.run();
      });

      console.log("Accessibility violations:", axeResults.violations);
    });
  },
);
```
