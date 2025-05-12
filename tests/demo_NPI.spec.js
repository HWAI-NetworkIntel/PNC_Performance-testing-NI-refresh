const { test, expect } = require("@playwright/test");
const ExcelJS = require("exceljs");
const axios = require("axios");

// ✅ Helper function to post results to Teams

const clientConfig = {
  Demo: {
    menuText: "NetworkIntel",
    views: {
      npiSearch: "Provider Network Comparison 1-to-1",
    },
  },
};

async function measureTTFD(menuText, viewText, page) {
  console.log("measureTTFD :", menuText, viewText);

  const networkIntelMenuItem = page.locator(
    'img[alt="Product-Icon"][src*="NetworkIntel.png"]'
  );
  await expect(networkIntelMenuItem).toBeVisible({ timeout: 15000 });
  await networkIntelMenuItem.hover();
  await page.waitForTimeout(500);

  const networkIntelText = page.locator("div.flex.cursor-pointer.gap-2", {
    hasText: menuText,
  });
  await expect(networkIntelText).toBeVisible({ timeout: 5000 });
  await networkIntelText.hover();
  await page.waitForTimeout(500);

  const start = Date.now();
  const comparisonOption = page.getByText(viewText, { exact: true }).first();
  await expect(comparisonOption).toBeVisible({ timeout: 15000 });
  await comparisonOption.click({ force: true });

  // ******************************** TEST CASE START ***********************************************
  //  Time taken to fully drawn (TTFD)

  await page.waitForSelector("#i_frame", { timeout: 20000 });
  const frameLocator = page.frameLocator('iframe[title="dashboard"]').first();
  const spinner = frameLocator.locator(".ant-spin.ant-spin-spinning");
  await expect(spinner.first()).toBeVisible({ timeout: 60000 });
  await spinner.first().waitFor({ state: "detached", timeout: 60000 });
  const end = Date.now();

  const filterLoadTimeinitial = ((end - start) / 1000).toFixed(1);

  const filterLoadTimes = [
    {
      Scenario: "Time taken to fully drawn (TTFD)",
      Time: `${filterLoadTimeinitial}s`,
    },
  ];

  // ******************************** TEST CASE START ***********************************************
  // State change Arizona to New York

  let filterDropdown = frameLocator.locator("#\\33"); // STATE FILTER 3
  await expect(filterDropdown).toBeVisible({ timeout: 60000 });

  // Click to open the dropdown
  await filterDropdown.click();

  let filterStart = Date.now();
  // Wait for the dropdown panel to appear
  let dropdownPanel = frameLocator.locator('ul[role="listbox"]');
  await expect(dropdownPanel).toBeVisible({ timeout: 50000 });

  // Select New York from state list
  let thirdOption = dropdownPanel.locator('li[role="option"]', {
    hasText: "New York",
  });
  await thirdOption.click();

  let filterSpinner = frameLocator.locator(".ant-spin.ant-spin-spinning");

  // Wait for spinner after selecting NY
  await expect(filterSpinner.first()).toBeVisible({ timeout: 60000 });
  await filterSpinner.first().waitFor({ state: "detached", timeout: 60000 });

  let filterEnd = Date.now();
  let filterLoadTimeThird = ((filterEnd - filterStart) / 1000).toFixed(1);

  filterLoadTimes.push({
    Scenario: "State change Arizona to New York",
    Time: `${filterLoadTimeThird}s`,
  });

  console.log(filterLoadTimes);

  // ******************************** TEST CASE START ***********************************************
  // County Change > 1st 2 (Albany and Allegany)

  // More reliable way to locate the filter dropdown
  filterDropdown = frameLocator.locator(".p-multiselect").first(); // or a more specific selector
  await expect(filterDropdown).toBeVisible({ timeout: 60000 });

  // Click to open the dropdown
  await filterDropdown.click();

  filterStart = Date.now();

  // Wait for the dropdown panel to appear - more specific selector
  dropdownPanel = frameLocator.locator(".p-multiselect-panel");
  await expect(dropdownPanel).toBeVisible({ timeout: 50000 });

  // Better way to select "New York" option
  let optionText = "New York";
  let optionSelector = `li.p-multiselect-item:has-text("${optionText}")`;

  // Wait for the option to be available
  await frameLocator
    .locator(optionSelector)
    .waitFor({ state: "visible", timeout: 30000 });

  // Click the option
  await frameLocator.locator(optionSelector).click();

  // Handle spinner
  filterSpinner = frameLocator.locator(".ant-spin.ant-spin-spinning");
  await expect(filterSpinner.first()).toBeVisible({ timeout: 60000 });
  await filterSpinner.first().waitFor({ state: "detached", timeout: 60000 });

  filterEnd = Date.now();
  filterLoadTimeThird = ((filterEnd - filterStart) / 1000).toFixed(1);

  filterLoadTimes.push({
    Scenario: "County Change > 1st 2 (Albany and Allegany)",
    Time: `${filterLoadTimeThird}s`,
  });

  console.log(filterLoadTimes);

  // ******************************** TEST CASE START ***********************************************
  // Plan type Change (Local HMO to Local PPO)

  console.log("Plan type Change (Local HMO to Local PPO)");
  
   filterDropdown = frameLocator.locator("#\\35"); // PLAN TYPE FILTER 5
  await expect(filterDropdown).toBeVisible({ timeout: 60000 });

  // Click to open the dropdown
  await filterDropdown.click();

  filterStart = Date.now();
  // Wait for the dropdown panel to appear
  dropdownPanel = frameLocator.locator('ul[role="listbox"]');
  await expect(dropdownPanel).toBeVisible({ timeout: 50000 });

  // Select New York from state list
  thirdOption = dropdownPanel.locator('li[role="option"]', {
    hasText: "Local PPO",
  });
  await thirdOption.click();

  filterSpinner = frameLocator.locator(".ant-spin.ant-spin-spinning");

  // Wait for spinner after selecting NY
  await expect(filterSpinner.first()).toBeVisible({ timeout: 60000 });
  await filterSpinner.first().waitFor({ state: "detached", timeout: 60000 });

  filterEnd = Date.now();
  filterLoadTimeThird = ((filterEnd - filterStart) / 1000).toFixed(1);

  filterLoadTimes.push({
    Scenario: "Plan type Change (Local HMO to Local PPO)",
    Time: `${filterLoadTimeThird}s`,
  });

  console.log(filterLoadTimes);

  // ******************************** TEST CASE START ***********************************************
  // Plan type Change (Local HMO to Local PPO)

  await page.pause();

  // ************************************** // END OF TEST CASES  *************************************************

  // **************************************  START OF CUSTOM RESULT ***********************************************

  // // Custom log format like in your attachment
  // console.log("\nCustom Table:");
  // console.log("Scenario\t\t\t\t\t\tTime");
  // for (const row of filterLoadTimes) {
  //   console.log(`${row.Scenario.padEnd(45)}${row.Time}`);
  // }

  // **************************************  END OF CUSTOM RESULT ************************************************

  // 11. Pause for manual inspection

  return filterLoadTimes;
}

test("Login and measure TTFD for multiple clients with Excel Output", async ({
  page,
}) => {
  test.setTimeout(180000); // 3 min timeout

  const loginUrl = "https://hwai.analytics-hub.com/login";
  const username = "vibhore.goel@teganalytics.com";
  const password = "Goteg@123";

  // Get all clients from config
  const clients = Object.keys(clientConfig);

  // Format EST Time
  const now = new Date();
  const estFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const estTime = estFormatter.format(now).replace(",", "") + " EST";
  const [month, day, year] = dateFormatter.format(now).split("/");
  const formattedDate = `${month}-${day}-${year}`;
  const filePath = `./ttfd_output_${formattedDate}.xlsx`;

  // Create a single workbook instance
  const workbook = new ExcelJS.Workbook();

  // Login once
  await page.goto(loginUrl);
  await page
    .getByRole("textbox", { name: "Enter email address" })
    .fill(username);
  await page.getByRole("textbox", { name: "Enter password" }).fill(password);
  await page.getByRole("button", { name: "Login" }).click();

  const continueButton = page.getByRole("button", { name: "Continue" });
  await expect(continueButton).toBeVisible({ timeout: 15000 });
  await continueButton.click();

  // Process each client
  for (const client of clients) {
    const config = clientConfig[client];
    const { menuText, views } = config;

    // Skip clients without npiSearch view
    if (!views?.npiSearch) {
      console.log(`ℹ️ Skipping ${client} - no npiSearch view configured`);
      continue;
    }

    console.log(`\n=== Starting tests for client: ${client} ===`);

    // Switch client if not Demo

    if (client !== "Demo") {
      console.log("clientclientclient", client);
      const clientDropdownButton = page.locator("button#options-menu");
      await expect(clientDropdownButton).toBeVisible({ timeout: 10000 });
      await clientDropdownButton.click();

      const searchInput = page.locator(
        'button#options-menu input[placeholder="Search..."]'
      );
      await expect(searchInput).toBeVisible({ timeout: 5000 });
      await searchInput.fill(client);

      const clientOption = page.locator(`text="${client}"`).first();
      await expect(clientOption).toBeVisible({ timeout: 5000 });
      await clientOption.click();

      await page.waitForTimeout(3000); // Wait for client switch to complete
    }

    // Run tests and add to Excel workbook
    try {
      const filterLoadTimes = await measureTTFD(
        menuText,
        views.npiSearch,
        page
      );

      // Add a worksheet for the current client
      const worksheet = workbook.addWorksheet(client);

      // Add headers with styling
      worksheet.columns = [
        { header: "Scenario", key: "Scenario", width: 60 },
        { header: "Time", key: "Time", width: 15 },
        { header: "Run Time", key: "RunTime", width: 20 },
      ];

      // Style the header row
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD3D3D3" },
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
      });

      // Add data rows
      filterLoadTimes.forEach((row) => {
        worksheet.addRow({
          Scenario: row.Scenario,
          Time: row.Time,
          RunTime: estTime,
        });
      });

      console.log(`✅ Completed tests for client: ${client}`);
    } catch (error) {
      console.error(`❌ Error processing client ${client}:`, error);
    }
  }

  // Save the workbook after all clients are processed
  await workbook.xlsx.writeFile(filePath);
  console.log(`\nAll results saved to ${filePath}`);
});
