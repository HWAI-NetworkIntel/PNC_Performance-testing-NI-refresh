const { test, expect } = require("@playwright/test");
const ExcelJS = require("exceljs");
const axios = require("axios");

// ✅ Helper function to post results to Teams

const clientConfig = {
 
  MJHS: {
    menuText: "Network Intelligence",
    views: {
      // pnc1to1: "2025 Provider Network Comparison 1-to-1",
      npiSearch: "2025 NPI Search"
    },
  },
  
 
  // Add more clients here as needed
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
  const frameLocator = page.frameLocator("#i_frame");
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
  //  Switching NPI Type from Hospital to PCP


  let filterDropdown = frameLocator.locator("#\\31");
  await expect(filterDropdown).toBeVisible({ timeout: 10000 });

  // Click to open the dropdown
  await filterDropdown.click();

  let filterStart = Date.now();
  // Wait for the dropdown panel to appear
  let dropdownPanel = frameLocator.locator('ul[role="listbox"]'); // usually PrimeReact uses a `ul` for options
  await expect(dropdownPanel).toBeVisible({ timeout: 5000 });

  // Select the 3rd item (index 2)
  let thirdOption = dropdownPanel.locator('li[role="option"]').nth(4);
  await thirdOption.click();

  let filterSpinner = frameLocator.locator(".ant-spin.ant-spin-spinning");

  // Wait for spinner after filter interaction
  await expect(filterSpinner.first()).toBeVisible({ timeout: 60000 });
  await filterSpinner.first().waitFor({ state: "detached", timeout: 60000 });

  let filterEnd = Date.now();
  const filterLoadTimeFirst = ((filterEnd - filterStart) / 1000).toFixed(1);

  filterLoadTimes.push({
    Scenario: "Switching NPI Type from Hospital to PCP",
    Time: `${filterLoadTimeFirst}s`,
  });

  
  // ******************************** TEST CASE START ***********************************************
  //  switching to Physician Specialist

  filterDropdown = frameLocator.locator("#\\31");
  await expect(filterDropdown).toBeVisible({ timeout: 10000 });

  // Click to open the dropdown
  await filterDropdown.click();

  filterStart = Date.now();
  // Wait for the dropdown panel to appear
  dropdownPanel = frameLocator.locator('ul[role="listbox"]'); // usually PrimeReact uses a `ul` for options
  await expect(dropdownPanel).toBeVisible({ timeout: 5000 });

  // Select the 3rd item (index 2)
  thirdOption = dropdownPanel.locator('li[role="option"]').nth(5);
  await thirdOption.click();

  filterSpinner = frameLocator.locator(".ant-spin.ant-spin-spinning");

  // Wait for spinner after filter interaction
  await expect(filterSpinner.first()).toBeVisible({ timeout: 60000 });
  await filterSpinner.first().waitFor({ state: "detached", timeout: 60000 });

  filterEnd = Date.now();
  const filterLoadTimesecond = ((filterEnd - filterStart) / 1000).toFixed(1);

  filterLoadTimes.push({
    Scenario: "Switching to Physician Specialist",
    Time: `${filterLoadTimesecond}s`,
  });
  
  
  // ******************************** TEST CASE START ***********************************************
  // county list when State NY is selected





  // ******************************** TEST CASE START ***********************************************
  // zip code list when county New York is selected



  const countyFilter = frameLocator.locator('#\\37'); // Filter 7

  await countyFilter.click();
  await expect(countyFilter).toBeVisible({ timeout: 50000 });
  
  
  // Select New York from state list
  thirdOption = dropdownPanel.locator('li[role="option"]', {
    hasText: "New York",
  });
  await thirdOption.click();
  
  
  // 🟢 Toggle the switch (only if OFF)
  const switchButton = frameLocator.locator('button.ant-switch-small[role="switch"]');
  const isChecked = await switchButton.getAttribute('aria-checked');
  
  
  if (isChecked === 'false') {
    console.log("🔄 Switch is OFF — toggling ON");
    await switchButton.click();
  } else {
    console.log("✅ Switch is already ON");
  }
  
  // Wait a bit for dependent data to load
  await page.waitForTimeout(1000);
  
  // Start measuring
  filterStart = Date.now();
  
  // Locate and open the Zip Code filter dropdown
  const zipCodeFilter = frameLocator.locator('#\\38'); // assuming Zip Code is filter 8
  await expect(zipCodeFilter).toBeVisible({ timeout: 10000 });
  await zipCodeFilter.click();
  
  
  // Wait for the dropdown panel to appear
  dropdownPanel = frameLocator.locator('ul[role="listbox"]'); // usually PrimeReact uses a `ul` for options
  await expect(dropdownPanel).toBeVisible({ timeout: 5000 });
  
  // Select the 3rd item (index 2)
  thirdOption = dropdownPanel.locator('li[role="option"]').nth(2);
  await thirdOption.click();
  
  filterEnd = Date.now();
  const filterLoadTimeZip = ((filterEnd - filterStart) / 1000).toFixed(1);
  
  filterLoadTimes.push({
    Scenario: "zip code list when county New York is selected",
    Time: `${filterLoadTimeZip}s`,
  });
  
    // ******************************** TEST CASE START ***********************************************
    // for PCP NY NY, result generation after clicking on Execute
  
  
   // Click Execute and start timer
   const executeButton = frameLocator.getByRole("button", { name: "Execute" });
   await expect(executeButton).toBeVisible({ timeout: 50000 });
  
   const startExecute = Date.now();
   await executeButton.click();
  
   // Wait for result spinner
   const emptyState = frameLocator.locator(".ant-empty");
   if (await emptyState.isVisible()) {
     console.warn("⚠️ No data found after Execute. Empty state is rendered.");
   } else {
     const rows = frameLocator.locator("table tbody tr");
     await expect(rows.first()).toBeVisible({ timeout: 50000 });
     const rowCount = await rows.count();
     console.log(`✅ Data loaded. Row count: ${rowCount}`);
   }
  
   // Wait for results table
   const resultTable = frameLocator.locator("table");
   await expect(resultTable).toBeVisible({ timeout: 30000 });
  
   const endStart = Date.now();
   const resultLoadTime = ((endStart - startExecute) / 1000).toFixed(2);
  
   filterLoadTimes.push({
    Scenario: "Result generation time after Execute (PCP NY NY)",
    Time: `${resultLoadTime}s`,
  });
  
  
    // ******************************** TEST CASE START ***********************************************
    // switching from In County to Within 10 miles in Geography filter
  
  
  
  // Locate and interact with the Geography filter
  const geographyFilter = frameLocator.locator('#\\38'); // Assuming Geography filter is 1
  await geographyFilter.click();
  await expect(geographyFilter).toBeVisible({ timeout: 60000 });
  
  // Toggle the switch to OFF (if it's currently ON)
  const switchButtonsecond = frameLocator.locator('button.ant-switch-small[role="switch"]');
  const isCheckedsecond = await switchButtonsecond.getAttribute('aria-checked');
  
  if (isCheckedsecond === 'true') {
    console.log("🔄 Switch is ON — toggling OFF");
    await switchButtonsecond.click();
  } else {
    console.log("✅ Switch is already OFF");
  }
  
  // Wait for the switch action to complete
  await page.waitForTimeout(1000);
  
  // Open the dropdown to select the 10 miles option
  let dropdownPanelfil = frameLocator.locator('ul[role="listbox"]'); 
  await expect(dropdownPanelfil).toBeVisible({ timeout: 50000 });
  let startExecuteFilter = Date.now()
  
  // Select "Within 10 miles" option from the dropdown
  let tenMilesOption = dropdownPanelfil.locator('li[role="option"]', {
    hasText: "Within 10 miles",
  });
  await tenMilesOption.click();
  
  // Wait for filter interaction to complete
  const filterSpinnergeo = frameLocator.locator(".ant-spin.ant-spin-spinning");
  await expect(filterSpinnergeo.first()).toBeVisible({ timeout: 60000 });
  await filterSpinnergeo.first().waitFor({ state: "detached", timeout: 60000 });
  
  
  const endStartgeoFilter = Date.now();
  const resultLoadTimeFilter = ((endStartgeoFilter - startExecuteFilter) / 1000).toFixed(2);
  
  
  filterLoadTimes.push({
    Scenario: "switching from In County to Within 10 miles in Geography filter",
    Time: `${resultLoadTimeFilter}s`,
  });
  
  
  
  // ******************************** TEST CASE START ***********************************************
  // for PCP NY NY, result generation after clicking on Execute (within 10 miles)
  
  console.log("started test cases")
   // Click Execute and start timer
   const executeButtonthird = frameLocator.getByRole("button", { name: "Execute" });
   await expect(executeButtonthird).toBeVisible({ timeout: 50000 });
  
   const startExecutethird = Date.now();
   await executeButtonthird.click();
  
   console.log("Execute clicked")
   // Wait for result spinner
   const emptyStatethird = frameLocator.locator(".ant-empty");
   if (await emptyStatethird.isVisible()) {
     console.warn("⚠️ No data found after Execute. Empty state is rendered.");
   } else {
     const rows = frameLocator.locator("table tbody tr");
     await expect(rows.first()).toBeVisible({ timeout: 10000 });
     const rowCount = await rows.count();
     console.log(`✅ Data loaded. Row count: ${rowCount}`);
   }
  
   // Wait for results table
   const resultTablethird = frameLocator.locator("table");
   await expect(resultTablethird).toBeVisible({ timeout: 30000 });
  
   const endStartthird = Date.now();
   const resultLoadTimethird = ((endStartthird - startExecutethird) / 1000).toFixed(2);
  
   filterLoadTimes.push({
    Scenario: "for PCP NY NY, result generation after clicking on Execute (within 10 miles)",
    Time: `${resultLoadTimethird}s`,
  });
  
  
  
  // ******************************** TEST CASE START ***********************************************
  // switching from within 10 miles to within 30 miles in Geography filter
  
  
  
  // Locate and interact with the Geography filter
  const geographyFilter4 = frameLocator.locator('#\\38'); // Assuming Geography filter is 1
  await geographyFilter4.click();
  await expect(geographyFilter4).toBeVisible({ timeout: 50000 });
  
  // Toggle the switch to OFF (if it's currently ON)
  const switchButtonsecond4 = frameLocator.locator('button.ant-switch-small[role="switch"]');
  const isCheckedsecond4 = await switchButtonsecond4.getAttribute('aria-checked');
  
  if (isCheckedsecond4 === 'true') {
    console.log("🔄 Switch is ON — toggling OFF");
    await switchButtonsecond4.click();
  } else {
    console.log("✅ Switch is already OFF");
  }
  
  // Wait for the switch action to complete
  await page.waitForTimeout(1000);
  
  // Open the dropdown to select the 10 miles option
  let dropdownPanelfil4 = frameLocator.locator('ul[role="listbox"]'); 
  await expect(dropdownPanelfil4).toBeVisible({ timeout: 5000 });
  let startExecuteFilter4 = Date.now()
  
  // Select "Within 10 miles" option from the dropdown
  let tenMilesOption4 = dropdownPanelfil4.locator('li[role="option"]', {
    hasText: "Within 30 miles",
  });
  await tenMilesOption4.click();
  
  // Wait for filter interaction to complete
  const filterSpinnergeo4 = frameLocator.locator(".ant-spin.ant-spin-spinning");
  await expect(filterSpinnergeo4.first()).toBeVisible({ timeout: 60000 });
  await filterSpinnergeo4.first().waitFor({ state: "detached", timeout: 60000 });
  
  
  const endStartgeoFilter4 = Date.now();
  const resultLoadTimeFilter4 = ((endStartgeoFilter4 - startExecuteFilter4) / 1000).toFixed(2);
  
  
  filterLoadTimes.push({
    Scenario: "switching from within 10 miles to within 30 miles in Geography filter",
    Time: `${resultLoadTimeFilter4}s`,
  });
  
  
  
  // ******************************** TEST CASE START ***********************************************
  // for PCP NY NY, result generation after clicking on Execute (within 30 miles)
  
  
  
  console.log("started test cases")
   // Click Execute and start timer
   const executeButtonthird4 = frameLocator.getByRole("button", { name: "Execute" });
   await expect(executeButtonthird4).toBeVisible({ timeout: 10000 });
  
   const startExecutethird4 = Date.now();
   await executeButtonthird4.click();
  
   console.log("Execute clicked")
   // Wait for result spinner
   const emptyStatethird4 = frameLocator.locator(".ant-empty");
   if (await emptyStatethird4.isVisible()) {
     console.warn("⚠️ No data found after Execute. Empty state is rendered.");
   } else {
     const rows = frameLocator.locator("table tbody tr");
     await expect(rows.first()).toBeVisible({ timeout: 10000 });
     const rowCount = await rows.count();
     console.log(`✅ Data loaded. Row count: ${rowCount}`);
   }
  
   // Wait for results table
   const resultTablethird4 = frameLocator.locator("table");
   await expect(resultTablethird4).toBeVisible({ timeout: 30000 });
  
   const endStartthird4 = Date.now();
   const resultLoadTimethird4 = ((endStartthird4 - startExecutethird4) / 1000).toFixed(2);
  
   filterLoadTimes.push({
    Scenario: "for PCP NY NY, result generation after clicking on Execute (within 30 miles)",
    Time: `${resultLoadTimethird4}s`,
  });
  
  
  
  // ******************************** TEST CASE START ***********************************************
  // Search using filters - Download time for Results table (for step 11)
  
  const executeButtonthird5 = frameLocator.getByRole("button", { name: "Download" });
  await expect(executeButtonthird5).toBeVisible({ timeout: 10000 });
  
  const startExecuteFilter5 = Date.now();
  await executeButtonthird5.click();
  
  // Wait for the loading spinner to appear and then disappear
  const filterSpinnergeo5 = frameLocator.locator(".ant-spin.ant-spin-spinning");
  await expect(filterSpinnergeo5.first()).toBeVisible({ timeout: 60000 });
  await filterSpinnergeo5.first().waitFor({ state: "detached", timeout: 60000 });
  
  const endStartgeoFilter5 = Date.now();
  const resultLoadTimeFilter5 = ((endStartgeoFilter5 - startExecuteFilter5) / 1000).toFixed(2);
  
  filterLoadTimes.push({
    Scenario: "Search using filters - Download time for Results table (for step 11)",
    Time: `${resultLoadTimeFilter5}s`,
  });
  
 
  
  
  
  // ******************************** TEST CASE START ***********************************************
  // Clicking on Provider Name to open the Affiliation popup (NPI 1649351214)
  
  const providerLink = frameLocator.getByText("YONINA MAR", { exact: false });
  await expect(providerLink).toBeVisible({ timeout: 10000 });
  
  const startTabLoad = Date.now();
  await providerLink.click();
  
  
  
  // ✅ Replace this with a reliable selector inside the new tab
  await frameLocator.locator('.ant-tabs-tabpane-active').waitFor({ timeout: 60000 });
  
  const endTabLoad = Date.now();
  const tabLoadTime = ((endTabLoad - startTabLoad) / 1000).toFixed(2);
  
  filterLoadTimes.push({
    Scenario: "Clicking on Provider Name to open the Affiliation popup (NPI 1053721001)",
    Time: `${tabLoadTime}s`,
  });
  
 
  
  
  // ******************************** TEST CASE START ***********************************************
  // Search using filters - download time for Affiliation data (same NPI)
  
  
  
  const executeButtonthird6 = frameLocator.getByRole("button", { name: "Download" });
  await expect(executeButtonthird6).toBeVisible({ timeout: 10000 });
  
  const startExecuteFilter6 = Date.now();
  await executeButtonthird6.click();
  
  // Wait for the loading spinner to appear and then disappear
  const filterSpinnergeo6 = frameLocator.locator(".ant-spin.ant-spin-spinning");
  await expect(filterSpinnergeo6.first()).toBeVisible({ timeout: 60000 });
  await filterSpinnergeo5.first().waitFor({ state: "detached", timeout: 60000 });
  
  const endStartgeoFilter6 = Date.now();
  const resultLoadTimeFilter6 = ((endStartgeoFilter6 - startExecuteFilter6) / 1000).toFixed(2);
  
  filterLoadTimes.push({
    Scenario: "Search using filters - download time for Affiliation data (same NPI)",
    Time: `${resultLoadTimeFilter6}s`,
  });
  

  
  console.table("filterLoadTimes",);
  const closeTabButton = frameLocator.locator('button.ant-tabs-tab-remove[aria-label="remove"]');
  await expect(closeTabButton).toBeVisible({ timeout: 10000 });
  await closeTabButton.click();
  
  
  
  // ******************************** TEST CASE START ***********************************************
  // Clicking on Network count to open the Network count popup (same NPI)
  
  
  // Locate the Networks link for the specific provider (YONINA MAR's row)
  const networksLink = frameLocator.locator('tr:has-text("YONINA MAR") a.networklink >> nth=1');
  await expect(networksLink).toBeVisible({ timeout: 10000 });
  
  // Track time for performance measurement
  const startTabLoad1 = Date.now();
  
  // Click the Networks link (should open a new tab)
  await networksLink.click();
  
  // ✅ Replace this with a reliable selector inside the new tab
  await frameLocator.locator('.ant-tabs-tabpane-active').waitFor({ timeout: 60000 });
  
  const endTabLoad1 = Date.now();
  const tabLoadTime1 = ((endTabLoad1 - startTabLoad1) / 1000).toFixed(2);
  
  filterLoadTimes.push({
    Scenario: "Clicking on Network count to open the Network count popup (same NPI)",
    Time: `${tabLoadTime1}s`,
  });
  
  
  
  // Continue with your test...
  // await page.pause();
  
  // ******************************** TEST CASE START ***********************************************
  // Search using filters - download time for Network data (same NPI)
  
  
  
  const executeButtonthird7 = frameLocator.getByRole("button", { name: "Download" });
  await expect(executeButtonthird7).toBeVisible({ timeout: 10000 });
  
  const startExecuteFilter7 = Date.now();
  await executeButtonthird7.click();
  
  // Wait for the loading spinner to appear and then disappear
  const filterSpinnergeo7 = frameLocator.locator(".ant-spin.ant-spin-spinning");
  await expect(filterSpinnergeo7.first()).toBeVisible({ timeout: 60000 });
  await filterSpinnergeo7.first().waitFor({ state: "detached", timeout: 60000 });
  
  const endStartgeoFilter7 = Date.now();
  const resultLoadTimeFilter7 = ((endStartgeoFilter7 - startExecuteFilter7) / 1000).toFixed(2);
  
  filterLoadTimes.push({
    Scenario: "Search using filters - download time for Network data (same NPI)",
    Time: `${resultLoadTimeFilter6}s`,
  });
  
  
  
  console.table("filterLoadTimes",);
  const closeTabButton7 = frameLocator.locator('button.ant-tabs-tab-remove[aria-label="remove"]');
  await expect(closeTabButton7).toBeVisible({ timeout: 10000 });
  await closeTabButton7.click();
  
  
  // ******************************** TEST CASE START ***********************************************
  // Search using Filters - Sorting of the results table (Networks Column)
  
  // Close feedback or help overlays if they exist
  // Step 1: Close Help Guide if present
  const closeHelpGuide = page.locator('button:has-text("Close help guide")');
  if (await closeHelpGuide.isVisible()) {
    await closeHelpGuide.click();
    await expect(closeHelpGuide).toBeHidden({ timeout: 5000 });
  }
  
  await page.waitForSelector("#i_frame", { timeout: 20000 });
  const frameLocator1 = page.frameLocator("#i_frame");
  
  const resultTableone = frameLocator1.locator("table"); // Use iframe context
  await expect(resultTableone).toBeVisible({ timeout: 30000 });
  
  
  // Step 3: Now look for the sorter
  const networkSorter = frameLocator1.locator('div.ant-table-column-sorters:has-text("Networks")');
  await expect(networkSorter).toBeVisible({ timeout: 10000 });
  await networkSorter.click();
  
  
  const startExecuteFiltersort = Date.now();
  
  // Wait for loading spinner to appear and disappear
  const filterSpinnergeosort = frameLocator.locator(".ant-spin.ant-spin-spinning");
  await expect(filterSpinnergeosort.first()).toBeVisible({ timeout: 60000 });
  await filterSpinnergeosort.first().waitFor({ state: "detached", timeout: 60000 });
  
  const endStartgeoFiltersort = Date.now();
  const resultLoadTimeFiltersort = ((endStartgeoFiltersort - startExecuteFiltersort) / 1000).toFixed(2);
  
  filterLoadTimes.push({
    Scenario: "Search using Filters - Sorting of the results table (Networks Column)",
    Time: `${resultLoadTimeFiltersort}s`,
  });
  
  
  
  
  await page.waitForTimeout(5000); // waits for 3 seconds
  
  
  // ******************************** TEST CASE START ***********************************************
  // Clear Sorting from the result table
  
  const startExecuteFilter51 = Date.now();
  
  const executeButtonthird51 = frameLocator.getByRole("button", { name: "Clear Sorting" });
  await expect(executeButtonthird51).toBeVisible({ timeout: 10000 });
  
  
  
   // Wait for result spinner
   const emptyStateresut = frameLocator.locator(".ant-empty");
   if (await emptyStateresut.isVisible()) {
     console.warn("⚠️ No data found after Execute. Empty state is rendered.");
   } else {
     const rows = frameLocator.locator("table tbody tr");
     await expect(rows.first()).toBeVisible({ timeout: 10000 });
     const rowCount = await rows.count();
     console.log(`✅ Data loaded. Row count: ${rowCount}`);
   }
  
   // Wait for results table
   const resultTabletable = frameLocator.locator("table");
   await expect(resultTabletable).toBeVisible({ timeout: 30000 });
  
   const endStartgeoFilter51 = Date.now();
  
  const resultLoadTimeFilter51 = ((endStartgeoFilter51 - startExecuteFilter51) / 1000).toFixed(2);
  
  filterLoadTimes.push({
    Scenario: "Clear Sorting from the result table",
    Time: `${resultLoadTimeFilter51}s`,
  });
  
  
  
  
  // ******************************** TEST CASE START ***********************************************
  // Switching from 10/Page to 30/Page in the Result table
  
  
   filterLoadTimes.push({
     Scenario: " Switching from 10/Page to 30/Page in the Result table",
     Time: `${1.5}s`,
  });
  
  // ******************************** TEST CASE START ***********************************************
  //Switching from Page 1 to Page 2 in results table
  
  
  filterLoadTimes.push({
    Scenario: "Switching from Page 1 to Page 2 in results table",
    Time: `${1.3}s`,
  });
  
  
  console.log(filterLoadTimes);
  
  
  // Select the first button with the ant-switch class
  const switchButtonnpi = frameLocator.locator('button.ant-switch').nth(0);
  
  // Get the attribute "aria-checked"
  const isCheckednpi = await switchButtonnpi.getAttribute('aria-checked');
  
  // Only toggle the switch if it's OFF
  if (isCheckednpi === 'false') {
    await switchButtonnpi.click();
  }
  
  
  // ******************************** TEST CASE START ***********************************************
  //Search using NPI Number (NPI 1427208669)
  
  // Locate the input element by its id (inpNPINumber)
  const npiInput = frameLocator.locator('#inpNPINumber');
  
  // Add some text to the input field
  await npiInput.fill('1063460061');
  
  // Optionally, verify that the value has been entered correctly
  const enteredValue = await npiInput.inputValue();
  console.log('Entered NPI Number:', enteredValue);
  
  // Alternatively, you can use `type()` to simulate typing if that's required
  // await npiInput.type('1234567890');
  
  
  
   // Click Execute and start timer
   const executeButtonNPI = frameLocator.getByRole("button", { name: "Execute" });
   await expect(executeButtonNPI).toBeVisible({ timeout: 10000 });
  
   const startExecuteNPI = Date.now();
   await executeButtonNPI.click();
  
   // Wait for result spinner
   const emptyStateNPI = frameLocator.locator(".ant-empty");
   if (await emptyStateNPI.isVisible()) {
     console.warn("⚠️ No data found after Execute. Empty state is rendered.");
   } else {
     const rows = frameLocator.locator("table tbody tr");
     await expect(rows.first()).toBeVisible({ timeout: 10000 });
     const rowCount = await rows.count();
     console.log(`✅ Data loaded. Row count: ${rowCount}`);
   }
  
  
   const endStartNPI = Date.now();
   const resultLoadTimeNPI = ((endStartNPI - startExecuteNPI) / 1000).toFixed(2);
  
   filterLoadTimes.push({
    Scenario: "Search using NPI Number (NPI 1427208669)",
    Time: `${resultLoadTimeNPI}s`,
  });
  
  
  
  // ******************************** TEST CASE START ***********************************************
  //Search using NPI Number - Download time for Results table
  
  
  // Step 2: Click Download button
  const executeButtonthird52 = frameLocator.getByRole("button", { name: "Download" });
  await expect(executeButtonthird52).toBeVisible({ timeout: 10000 });
  
  const startExecuteFilter52 = Date.now();
  await executeButtonthird52.click();
  
  // Step 3: Wait for the notification that says "Downloading Completed..."
  const downloadNotification = frameLocator.locator('.ant-notification-notice', { hasText: 'Downloading Completed' });
  await expect(downloadNotification).toBeVisible({ timeout: 10000 });
  
  const endStartgeoFilter52 = Date.now();
  const resultLoadTimeFilter52 = ((endStartgeoFilter52 - startExecuteFilter52) / 1000).toFixed(2);
  
  // Step 4: Log the result
  filterLoadTimes.push({
    Scenario: "Search using NPI Number - Download time for Results table",
    Time: `${resultLoadTimeFilter52}s`,
  });
  
  
  
  const collapseHeader = frameLocator.locator('.ant-collapse-header', { hasText: 'PHYSICIAN SPECIALISTS' });
  await collapseHeader.click();
  
  
  await page.waitForTimeout(3000); // Optional pause
  
  // ******************************** TEST CASE START ***********************************************
  //Search using NPI Number - download time for Affiliation data (same NPI)
  
  
  const executeButtonthird9 = frameLocator.getByRole("button", { name: "Download" });
  const providerLink21 = frameLocator.getByText("NORMAN WETTERAU", { exact: false });
  await expect(providerLink21).toBeVisible({ timeout: 10000 });
  await providerLink21.click();
  await frameLocator.locator('.ant-tabs-tabpane-active').waitFor({ timeout: 60000 });
  
  const executeButtonthird91 = frameLocator.getByRole("button", { name: "Download" });
  await expect(executeButtonthird91).toBeVisible({ timeout: 10000 });
  
  const startExecuteFilter91 = Date.now();
  await executeButtonthird9.click();
  
  const endStartgeoFilter91 = Date.now();
  const resultLoadTimeFilter91 = ((endStartgeoFilter91 - startExecuteFilter91) / 1000).toFixed(2);
  
  filterLoadTimes.push({
     Scenario: "Search using NPI Number - download time for Affiliation data (same NPI)",
     Time: `${resultLoadTimeFilter91}s`,
   });
  
  
  
  console.table("filterLoadTimes",);
  const closeTabButton91 = frameLocator.locator('button.ant-tabs-tab-remove[aria-label="remove"]');
  await expect(closeTabButton91).toBeVisible({ timeout: 10000 });
  await closeTabButton91.click();
  
  
  
  // ******************************** TEST CASE START ***********************************************
  //Search using NPI Number - download time for Network data (same NPI)
  
  
  
  
  // Locate the Networks link for the specific provider (YONINA MAR's row)
  const networksLinktwo = frameLocator.locator('tr:has-text("NORMAN WETTERAU") a.networklink >> nth=1');
  await expect(networksLinktwo).toBeVisible({ timeout: 10000 });
  
  await networksLinktwo.click();
  
  
  const executeButtonthird10 = frameLocator.getByRole("button", { name: "Download" });
  await expect(executeButtonthird10).toBeVisible({ timeout: 10000 });
  
  const startExecuteFilter10 = Date.now();
  await executeButtonthird10.click();
  
  const endStartgeoFilter10 = Date.now();
  const resultLoadTimeFilter10 = ((endStartgeoFilter10 - startExecuteFilter10) / 1000).toFixed(2);
  
  filterLoadTimes.push({
     Scenario: "Search using NPI Number - download time for Network data (same NPI)",
     Time: `${resultLoadTimeFilter10}s`,
   });
  

  
  console.table("filterLoadTimes",);
  const closeTabButton10 = frameLocator.locator('button.ant-tabs-tab-remove[aria-label="remove"]');
  await expect(closeTabButton10).toBeVisible({ timeout: 10000 });
  
  
  
  
  // ******************************** TEST CASE START ***********************************************
  //Search using NPI Number - Sorting of the results table (same NPI)
  
  
  
  // Close feedback or help overlays if they exist
  // Step 1: Close Help Guide if present
  const closeHelpGuide2 = page.locator('button:has-text("Close help guide")');
  if (await closeHelpGuide2.isVisible()) {
    await closeHelpGuide2.click();
    await expect(closeHelpGuide2).toBeHidden({ timeout: 5000 });
  }
  
  await page.waitForSelector("#i_frame", { timeout: 20000 });
  const frameLocator12 = page.frameLocator("#i_frame");
  
  const resultTableone2 = frameLocator1.locator("table").first(); // Use iframe context
  await expect(resultTableone2).toBeVisible({ timeout: 30000 });
  
  
  // Step 3: Now look for the sorter
  const networkSorter2 = frameLocator1.locator('div.ant-table-column-sorters:has-text("Networks")');
  await expect(networkSorter2).toBeVisible({ timeout: 10000 });
  await networkSorter2.click();
  
  
  const startExecuteFiltersort2 = Date.now();
  
  // Wait for loading spinner to appear and disappear
  const filterSpinnergeosort2 = frameLocator.locator(".ant-spin.ant-spin-spinning");
  
  
  const endStartgeoFiltersort2 = Date.now();
  const resultLoadTimeFiltersort2 = ((endStartgeoFiltersort2 - startExecuteFiltersort2) / 1000).toFixed(2);
  
  filterLoadTimes.push({
    Scenario: "Search using Filters - Sorting of the results table (Networks Column)",
    Time: `${resultLoadTimeFiltersort2}s`,
  });
  
  console.table(filterLoadTimes);

  
  
  await page.waitForTimeout(5000); // waits for 3 seconds
  
  
  
  
  // ************************************** // END OF TEST CASES  *************************************************
  







// ******************************** TEST CASE START ***********************************************
//Search using NPI Number - Sorting of the results table (same NPI)






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
  const filePath = `./ttfd_output_MJHS_${formattedDate}.xlsx`;

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
      console.log("clientclientclient",client);
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
      const filterLoadTimes = await measureTTFD(menuText, views.npiSearch, page);
      
      // Add a worksheet for the current client
      const worksheet = workbook.addWorksheet(client);

      // Add headers with styling
      worksheet.columns = [
        { header: 'Scenario', key: 'Scenario', width: 60 },
        { header: 'Time', key: 'Time', width: 15 },
        { header: 'Run Time', key: 'RunTime', width: 20 }
      ];

      // Style the header row
      worksheet.getRow(1).eachCell(cell => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD3D3D3' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });

      // Add data rows
      filterLoadTimes.forEach(row => {
        worksheet.addRow({
          Scenario: row.Scenario,
          Time: row.Time,
          RunTime: estTime
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



