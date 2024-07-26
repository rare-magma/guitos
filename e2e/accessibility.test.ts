import { expect, test } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";

test("should not have any automatically detectable accessibility issues on landing page", async ({
  page,
}) => {
  await page.goto("/");
  const accessibilityScanResults = await new AxeBuilder({ page })
    .disableRules("color-contrast")
    .analyze();

  expect(accessibilityScanResults.violations).toStrictEqual([]);
});

test("should not have any automatically detectable accessibility issues", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByText("get started").click();
  const accessibilityScanResults = await new AxeBuilder({ page })
    .disableRules("color-contrast")
    .analyze();

  expect(accessibilityScanResults.violations).toStrictEqual([]);
});
