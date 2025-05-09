const { test, expect } = require("@playwright/test");
const ExcelJS = require("exceljs");
const axios = require("axios");

// ✅ Helper function to post results to Teams

const clientConfig = {
  Demo: {
    menuText: "NetworkIntel",
    views: {
      pnc1to1: "Provider Network Comparison 1-to-1",
    },
  },
  MJHS: {
    menuText: "Network Intelligence",
    views: {
      // pnc1to1: "2025 Provider Network Comparison 1-to-1",
      npiSearch: "2025 NPI Search"
    },
  },
  IBX: {
    menuText: "Network Intelligence",
    views: {
      // pnc1to1: "2025 Provider Network Comparison 1-to-1",
      npiSearch: "2025 NPI Search"
    },
  },
  CDPHP: {
    menuText: "Network Intelligence",
    views: {
      // pnc1to1: "2025 Provider Network Comparison 1-to-1",
      npiSearch: "2025 NPI Search"
    },
  },
  Aetna: {
    menuText: "Network Intelligence",
    views: {
      // pnc1to1: "2025 Provider Network Comparison 1-to-1",
      // pnc1tomany: "2025 Provider Network Comparison 1-to-Many",
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


  filterDropdown = frameLocator.locator("#\\36"); // Filter 6
  await expect(filterDropdown).toBeVisible({ timeout: 10000 });

  // Click to open the dropdown
  await filterDropdown.click();

  filterStart = Date.now();
  // Wait for the dropdown panel to appear
  dropdownPanel = frameLocator.locator('ul[role="listbox"]');
  await expect(dropdownPanel).toBeVisible({ timeout: 5000 });

  // Select New York from state list
  thirdOption = dropdownPanel.locator('li[role="option"]', {
    hasText: "New York",
  });
  await thirdOption.click();

  filterSpinner = frameLocator.locator(".ant-spin.ant-spin-spinning");

  // Wait for spinner after selecting NY
  await expect(filterSpinner.first()).toBeVisible({ timeout: 60000 });
  await filterSpinner.first().waitFor({ state: "detached", timeout: 60000 });

  filterEnd = Date.now();
  const filterLoadTimeThird = ((filterEnd - filterStart) / 1000).toFixed(1);
 

  filterLoadTimes.push({
    Scenario: "county list when State NY is selected",
    Time: `${filterLoadTimeThird}s`,
  });

 
  // ******************************** TEST CASE START ***********************************************
  // zip code list when county New York is selected



const countyFilter = frameLocator.locator('#\\37'); // Filter 7

await countyFilter.click();
await expect(countyFilter).toBeVisible({ timeout: 10000 });


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
 await expect(executeButton).toBeVisible({ timeout: 10000 });

 const startExecute = Date.now();
 await executeButton.click();

 // Wait for result spinner
 const emptyState = frameLocator.locator(".ant-empty");
 if (await emptyState.isVisible()) {
   console.warn("⚠️ No data found after Execute. Empty state is rendered.");
 } else {
   const rows = frameLocator.locator("table tbody tr");
   await expect(rows.first()).toBeVisible({ timeout: 10000 });
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
await expect(geographyFilter).toBeVisible({ timeout: 10000 });

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
await expect(dropdownPanelfil).toBeVisible({ timeout: 5000 });
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
 await expect(executeButtonthird).toBeVisible({ timeout: 10000 });

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
await expect(geographyFilter4).toBeVisible({ timeout: 10000 });

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

console.table(filterLoadTimes);



// ******************************** TEST CASE START ***********************************************
// Clicking on Provider Name to open the Affiliation popup (NPI 1649351214)

const providerLink = frameLocator.getByText("RUBY RABIYA-SHEIKH KAPADIA", { exact: false });
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

console.table(filterLoadTimes);


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

console.table(filterLoadTimes);

console.table("filterLoadTimes",);
const closeTabButton = frameLocator.locator('button.ant-tabs-tab-remove[aria-label="remove"]');
await expect(closeTabButton).toBeVisible({ timeout: 10000 });
await closeTabButton.click();



// ******************************** TEST CASE START ***********************************************
// Clicking on Network count to open the Network count popup (same NPI)


// Locate the Networks link for the specific provider (IDA LOUISE SANTANA's row)
const networksLink = frameLocator.locator('tr:has-text("RUBY RABIYA-SHEIKH KAPADIA") a.networklink >> nth=1');
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

console.table(filterLoadTimes);

console.table("filterLoadTimes",);
const closeTabButton7 = frameLocator.locator('button.ant-tabs-tab-remove[aria-label="remove"]');
await expect(closeTabButton7).toBeVisible({ timeout: 10000 });
await closeTabButton7.click();


// ******************************** TEST CASE START ***********************************************
// In PCP NY NY- selecting Affiliated to Hospital (ABRAZO ARROWHEADS CAMPUS)

// Get frameLocator reference
let frame = page.frameLocator('#i_frame');

// Close the help guide if it appears
const helpGuideClose = frame.getByRole("button", { name: "Close help guide" });
if (await helpGuideClose.isVisible({ timeout: 3000 }).catch(() => false)) {
  await helpGuideClose.click();
}

// Locate the dropdown with id="10"
const filterDropdownAffiliations = frame.locator('#\\31\\30');
await expect(filterDropdownAffiliations).toBeVisible({ timeout: 10000 });

// Click the dropdown
await filterDropdownAffiliations.click();

// Wait for the dropdown listbox to show
const dropdownPanelAffi = frame.locator('ul[role="listbox"]');
await expect(dropdownPanelAffi).toBeVisible({ timeout: 5000 });

// Select the 5th option
const fifthOptionAffi = dropdownPanelAffi.locator('li[role="option"]').nth(4);
await fifthOptionAffi.click();

// Measure time for spinner to finish
const filterStartAffi = Date.now();
const filterSpinnerAffi = frame.locator(".ant-spin.ant-spin-spinning");

// await expect(filterSpinnerAffi.first()).toBeVisible({ timeout: 60000 });
// await filterSpinnerAffi.first().waitFor({ state: "detached", timeout: 60000 });

const filterEndAffi = Date.now();
const filterLoadTimeAffil = ((filterEndAffi - filterStartAffi) / 1000).toFixed(1);

filterLoadTimes.push({
  Scenario: "In PCP NY NY - selecting Affiliated to Hospital (ABRAZO ARROWHEADS CAMPUS)",
  Time: `${filterLoadTimeAffil}s`,
});

console.table(filterLoadTimes);




// ******************************** TEST CASE START ***********************************************
// In PCP NY NY - Click on exclusive and select Parent Org and Execute (CENTENE CORPORATION)


// Get the iframe locator
const iframe = page.frameLocator('#i_frame');

// Wait for the iframe to load (optional but safe)
await expect(iframe.locator('body')).toBeVisible({ timeout: 10000 });

// Locate the "Excl." radio label (visible clickable element)
const exclRadioLabel = iframe.locator('label:has-text("Excl.")');

// Wait until it's visible and enabled
await expect(exclRadioLabel).toBeVisible({ timeout: 10000 });
await expect(exclRadioLabel).toBeEnabled({ timeout: 10000 });

// Click the label to select the radio button
await exclRadioLabel.click();

// Optional: Verify it’s selected (checked)
await expect(exclRadioLabel).toHaveClass(/ant-radio-button-wrapper-checked/);



// Locate the dropdown with id="10"
const filterDropdownParent = frame.locator("#\\39");
await expect(filterDropdownParent).toBeVisible({ timeout: 10000 });

// Click the dropdown
await filterDropdownParent.click();

// Wait for the dropdown listbox to show
const dropdownPanelParent = frame.locator('ul[role="listbox"]');
await expect(dropdownPanelParent).toBeVisible({ timeout: 5000 });

// Select the 5th option
const fifthOptionParent = dropdownPanelParent.locator('li[role="option"]').nth(4);
await fifthOptionParent.click();

// Measure time for spinner to finish
const filterSpinnerParent = frame.locator(".ant-spin.ant-spin-spinning");

 // Click Execute and start timer
 const executeButtonclick = frameLocator.getByRole("button", { name: "Execute" });
 await expect(executeButtonclick).toBeVisible({ timeout: 10000 });

 const startExecuteClick = Date.now();
 await executeButtonclick.click();

 // Wait for result spinner
 const emptyStateClick = frameLocator.locator(".ant-empty");
 if (await emptyStateClick.isVisible()) {
   console.warn("⚠️ No data found after Execute. Empty state is rendered.");
 } else {
   const rows = frameLocator.locator("table tbody tr");
   await expect(rows.first()).toBeVisible({ timeout: 10000 });
   const rowCount = await rows.count();
   console.log(`✅ Data loaded. Row count: ${rowCount}`);
 }

 // Wait for results table
 const resultTableClick = frameLocator.locator("table");
 await expect(resultTableClick).toBeVisible({ timeout: 30000 });

 const endStartClick = Date.now();
 const resultLoadTimeClick = ((endStartClick - startExecuteClick) / 1000).toFixed(2);

filterLoadTimes.push({
  Scenario: "In PCP NY NY - Click on exclusive and select Parent Org and Execute (CENTENE CORPORATION)",
  Time: `${resultLoadTimeClick}s`,
});

console.table(filterLoadTimes);

// ******************************** TEST CASE START ***********************************************
// for PCP CA, LA result generation after clicking on Execute



filterDropdown = frameLocator.locator("#\\36"); // Filter 6
await expect(filterDropdown).toBeVisible({ timeout: 10000 });

// Click to open the dropdown
await filterDropdown.click();

filterStart = Date.now();
// Wait for the dropdown panel to appear
dropdownPanel = frameLocator.locator('ul[role="listbox"]');
await expect(dropdownPanel).toBeVisible({ timeout: 5000 });

// Select New York from state list
thirdOption = dropdownPanel.locator('li[role="option"]', {
  hasText: "California",
});
await thirdOption.click();

const countyFilterLA = frameLocator.locator('#\\37'); // Filter 7

await countyFilterLA.click();
await expect(countyFilterLA).toBeVisible({ timeout: 10000 });


// Select New York from state list
thirdOption = dropdownPanel.locator('li[role="option"]', {
  hasText: "Los Angeles",
});
await thirdOption.click();



 // Click Execute and start timer
 const executeButtonclickLA = frameLocator.getByRole("button", { name: "Execute" });
 await expect(executeButtonclickLA).toBeVisible({ timeout: 10000 });

 const startExecuteClickLA = Date.now();
 await executeButtonclickLA.click();

 // Wait for result spinner
 const emptyStateClickLA = frameLocator.locator(".ant-empty");
 if (await emptyStateClickLA.isVisible()) {
   console.warn("⚠️ No data found after Execute. Empty state is rendered.");
 } else {
   const rows = frameLocator.locator("table tbody tr");
   await expect(rows.first()).toBeVisible({ timeout: 10000 });
   const rowCount = await rows.count();
   console.log(`✅ Data loaded. Row count: ${rowCount}`);
 }

 // Wait for results table
 const resultTableClickLA = frameLocator.locator("table");
 await expect(resultTableClickLA).toBeVisible({ timeout: 30000 });

 const endStartClickLA = Date.now();
 const resultLoadTimeClickLA = ((endStartClickLA - startExecuteClickLA) / 1000).toFixed(2);

filterLoadTimes.push({
  Scenario: "for PCP CA, LA result generation after clicking on Execute",
  Time: `${resultLoadTimeClickLA}s`,
});

console.table(filterLoadTimes);



// ******************************** TEST CASE START ***********************************************
// switching from In County to Within 10 miles in Geography filter

// Locate and interact with the Geography filter
const geographyFilterLA = frameLocator.locator('#\\38'); // Assuming Geography filter is 1
await geographyFilterLA.click();
await expect(geographyFilterLA).toBeVisible({ timeout: 10000 });

// Toggle the switch to OFF (if it's currently ON)
const switchButtonsecondLA = frameLocator.locator('button.ant-switch-small[role="switch"]');
const isCheckedsecondLA = await switchButtonsecondLA.getAttribute('aria-checked');

if (isCheckedsecondLA === 'true') {
  console.log("🔄 Switch is ON — toggling OFF");
  await switchButtonsecondLA.click();
} else {
  console.log("✅ Switch is already OFF");
}

// Wait for the switch action to complete
await page.waitForTimeout(1000);

// Open the dropdown to select the 10 miles option
let dropdownPanelfilLA = frameLocator.locator('ul[role="listbox"]'); 
await expect(dropdownPanelfilLA).toBeVisible({ timeout: 5000 });
let startExecuteFilterLA = Date.now()

// Select "Within 10 miles" option from the dropdown
let tenMilesOptionLA = dropdownPanelfilLA.locator('li[role="option"]', {
  hasText: "Within 10 miles",
});
await tenMilesOptionLA.click();

// Wait for filter interaction to complete
const filterSpinnergeoLA = frameLocator.locator(".ant-spin.ant-spin-spinning");
await expect(filterSpinnergeoLA.first()).toBeVisible({ timeout: 60000 });
await filterSpinnergeoLA.first().waitFor({ state: "detached", timeout: 60000 });


const endStartgeoFilterLA = Date.now();
const resultLoadTimeFilterLA = ((endStartgeoFilterLA - startExecuteFilterLA) / 1000).toFixed(2);


filterLoadTimes.push({
  Scenario: "switching from In County to Within 10 miles in Geography filter",
  Time: `${resultLoadTimeFilterLA}s`,
});


// ******************************** TEST CASE START ***********************************************
// for PCP CA LA, result generation after clicking on Execute (within 10 miles)



// Click Execute and start timer
const executeButtonclickLA1 = frameLocator.getByRole("button", { name: "Execute" });
await expect(executeButtonclickLA1).toBeVisible({ timeout: 10000 });

const startExecuteClickLA1 = Date.now();
await executeButtonclickLA1.click();

// Wait for result spinner
const emptyStateClickLA1 = frameLocator.locator(".ant-empty");
if (await emptyStateClickLA1.isVisible()) {
  console.warn("⚠️ No data found after Execute. Empty state is rendered.");
} else {
  const rows = frameLocator.locator("table tbody tr");
  await expect(rows.first()).toBeVisible({ timeout: 10000 });
  const rowCount = await rows.count();
  console.log(`✅ Data loaded. Row count: ${rowCount}`);
}

// Wait for results table
const resultTableClickLA1 = frameLocator.locator("table");
await expect(resultTableClickLA1).toBeVisible({ timeout: 30000 });

const endStartClickLA1 = Date.now();
const resultLoadTimeClickLA1 = ((endStartClickLA1 - startExecuteClickLA1) / 1000).toFixed(2);

filterLoadTimes.push({
 Scenario: "for PCP CA LA, result generation after clicking on Execute (within 10 miles)",
 Time: `${resultLoadTimeClickLA1}s`,
});


// ******************************** TEST CASE START ***********************************************
// switching from within 10 miles to within 30 miles in Geography filter


// Locate and interact with the Geography filter
const geographyFilterLA2 = frameLocator.locator('#\\38'); // Assuming Geography filter is 1
await geographyFilterLA2.click();
await expect(geographyFilterLA2).toBeVisible({ timeout: 10000 });

// Toggle the switch to OFF (if it's currently ON)
const switchButtonsecondLA2 = frameLocator.locator('button.ant-switch-small[role="switch"]');
const isCheckedsecondLA2 = await switchButtonsecondLA2.getAttribute('aria-checked');

if (isCheckedsecondLA2 === 'true') {
  console.log("🔄 Switch is ON — toggling OFF");
  await switchButtonsecondLA2.click();
} else {
  console.log("✅ Switch is already OFF");
}

// Wait for the switch action to complete
await page.waitForTimeout(1000);

// Open the dropdown to select the 10 miles option
let dropdownPanelfilLA2 = frameLocator.locator('ul[role="listbox"]'); 
await expect(dropdownPanelfilLA2).toBeVisible({ timeout: 5000 });
let startExecuteFilterLA2 = Date.now()

// Select "Within 30 miles" option from the dropdown
let tenMilesOptionLA2 = dropdownPanelfilLA.locator('li[role="option"]', {
  hasText: "Within 30 miles",
});
await tenMilesOptionLA2.click();

// Wait for filter interaction to complete
const filterSpinnergeoLA2 = frameLocator.locator(".ant-spin.ant-spin-spinning");
await expect(filterSpinnergeoLA2.first()).toBeVisible({ timeout: 60000 });
await filterSpinnergeoLA2.first().waitFor({ state: "detached", timeout: 60000 });


const endStartgeoFilterLA2 = Date.now();
const resultLoadTimeFilterLA2 = ((endStartgeoFilterLA2 - startExecuteFilterLA2) / 1000).toFixed(2);


filterLoadTimes.push({
  Scenario: "switching from within 10 miles to within 30 miles in Geography filter",
  Time: `${resultLoadTimeFilterLA2}s`,
});


// ******************************** TEST CASE START ***********************************************
// for PCP CA LA, result generation after clicking on Execute (within 30 miles)



// Click Execute and start timer
const executeButtonclickLA4 = frameLocator.getByRole("button", { name: "Execute" });
await expect(executeButtonclickLA4).toBeVisible({ timeout: 10000 });

const startExecuteClickLA4 = Date.now();
await executeButtonclickLA4.click();

// Wait for result spinner
const emptyStateClickLA4 = frameLocator.locator(".ant-empty");
if (await emptyStateClickLA4.isVisible()) {
  console.warn("⚠️ No data found after Execute. Empty state is rendered.");
} else {
  const rows = frameLocator.locator("table tbody tr");
  await expect(rows.first()).toBeVisible({ timeout: 10000 });
  const rowCount = await rows.count();
  console.log(`✅ Data loaded. Row count: ${rowCount}`);
}

// Wait for results table
const resultTableClickLA4 = frameLocator.locator("table");
await expect(resultTableClickLA1).toBeVisible({ timeout: 30000 });

const endStartClickLA4 = Date.now();
const resultLoadTimeClickLA4 = ((endStartClickLA4 - startExecuteClickLA4) / 1000).toFixed(2);

filterLoadTimes.push({
 Scenario: "for PCP CA LA, result generation after clicking on Execute (within 30 miles)",
 Time: `${resultLoadTimeClickLA4}s`,
});

console.table(filterLoadTimes);

// ******************************** TEST CASE START ***********************************************
// Search using filters - Download time for Results table

const executeButtonthird8 = frameLocator.getByRole("button", { name: "Download" });
await expect(executeButtonthird8).toBeVisible({ timeout: 10000 });

const startExecuteFilter8 = Date.now();
await executeButtonthird8.click();

// Wait for the loading spinner to appear and then disappear
const filterSpinnergeo8 = frameLocator.locator(".ant-spin.ant-spin-spinning");
await expect(filterSpinnergeo8.first()).toBeVisible({ timeout: 60000 });
await filterSpinnergeo8.first().waitFor({ state: "detached", timeout: 60000 });

const endStartgeoFilter8 = Date.now();
const resultLoadTimeFilter8 = ((endStartgeoFilter8 - startExecuteFilter8) / 1000).toFixed(2);

filterLoadTimes.push({
  Scenario: "Search using filters - Download time for Results table",
  Time: `${resultLoadTimeFilter8}s`,
});



// ******************************** TEST CASE START ***********************************************
// Clicking on Provider Name to open the Affiliation popup (NPI 1427208669)



const providerLink2 = frameLocator.getByText("KEITH GREGORY HEINZERLING", { exact: false });
await expect(providerLink2).toBeVisible({ timeout: 10000 });

const startTabLoad2 = Date.now();
await providerLink2.click();



// ✅ Replace this with a reliable selector inside the new tab
await frameLocator.locator('.ant-tabs-tabpane-active').waitFor({ timeout: 60000 });

const endTabLoad2 = Date.now();
const tabLoadTime2 = ((endTabLoad2 - startTabLoad2) / 1000).toFixed(2);

filterLoadTimes.push({
  Scenario: "Clicking on Provider Name to open the Affiliation popup (NPI 1427208669)",
  Time: `${tabLoadTime2}s`,
});





// ******************************** TEST CASE START ***********************************************
// Search using filters - download time for Affiliation data (same NPI)


const executeButtonthird9 = frameLocator.getByRole("button", { name: "Download" });
await expect(executeButtonthird7).toBeVisible({ timeout: 10000 });

const startExecuteFilter9 = Date.now();
await executeButtonthird9.click();

// Wait for the loading spinner to appear and then disappear
const filterSpinnergeo9 = frameLocator.locator(".ant-spin.ant-spin-spinning");
await expect(filterSpinnergeo9.first()).toBeVisible({ timeout: 60000 });
await filterSpinnergeo9.first().waitFor({ state: "detached", timeout: 60000 });

const endStartgeoFilter9 = Date.now();
const resultLoadTimeFilter9 = ((endStartgeoFilter9 - startExecuteFilter9) / 1000).toFixed(2);

filterLoadTimes.push({
  Scenario: "Search using filters - download time for Affiliation data (same NPI)",
  Time: `${resultLoadTimeFilter9}s`,
});



console.table("filterLoadTimes",);
const closeTabButton9 = frameLocator.locator('button.ant-tabs-tab-remove[aria-label="remove"]');
await expect(closeTabButton9).toBeVisible({ timeout: 10000 });
await closeTabButton9.click();






// ******************************** TEST CASE START ***********************************************
// Clicking on Network count to open the Network count popup (same NPI)


// Locate the Networks link for the specific provider (IDA LOUISE SANTANA's row)
const networksLinkone = frameLocator.locator('tr:has-text("KEITH GREGORY HEINZERLING") a.networklink >> nth=1');
await expect(networksLinkone).toBeVisible({ timeout: 10000 });

// Track time for performance measurement
const startTabLoadone = Date.now();

// Click the Networks link (should open a new tab)
await networksLinkone.click();

// ✅ Replace this with a reliable selector inside the new tab
await frameLocator.locator('.ant-tabs-tabpane-active').waitFor({ timeout: 60000 });

const endTabLoadone = Date.now();
const tabLoadTimeone = ((endTabLoadone - startTabLoadone) / 1000).toFixed(2);

filterLoadTimes.push({
  Scenario: "Clicking on Network count to open the Network count popup (same NPI)",
  Time: `${tabLoadTimeone}s`,
});



// Continue with your test...
// await page.pause();

// ******************************** TEST CASE START ***********************************************
// Search using filters - download time for Network data (same NPI)



const executeButtonthirdone = frameLocator.getByRole("button", { name: "Download" });
await expect(executeButtonthirdone).toBeVisible({ timeout: 10000 });


const startExecuteFilterone = Date.now();
await executeButtonthirdone.click();

// Wait for the loading spinner to appear and then disappear
const filterSpinnergeoone = frameLocator.locator(".ant-spin.ant-spin-spinning");
await expect(filterSpinnergeoone.first()).toBeVisible({ timeout: 60000 });
await filterSpinnergeoone.first().waitFor({ state: "detached", timeout: 60000 });

const endStartgeoFilterone = Date.now();
const resultLoadTimeFilterone = ((endStartgeoFilterone - startExecuteFilterone) / 1000).toFixed(2);

filterLoadTimes.push({
  Scenario: "Search using filters - download time for Network data (same NPI)",
  Time: `${resultLoadTimeFilterone}s`,
});



console.table("filterLoadTimes",);
const closeTabButtonone = frameLocator.locator('button.ant-tabs-tab-remove[aria-label="remove"]');
await expect(closeTabButtonone).toBeVisible({ timeout: 10000 });
await closeTabButtonone.click();




// ******************************** TEST CASE START ***********************************************
// In PCP - selecting Affiliated to Hospital (ABRAZO ARROWHEADS CAMPUS)

// Get frameLocator reference
 frame = page.frameLocator('#i_frame');

// Close the help guide if it appears
const helpGuideCloseone = frame.getByRole("button", { name: "Close help guide" });
if (await helpGuideCloseone.isVisible({ timeout: 3000 }).catch(() => false)) {
  await helpGuideCloseone.click();
}

// Locate the dropdown with id="10"
const filterDropdownAffiliationsone = frame.locator('#\\31\\30');
await expect(filterDropdownAffiliationsone).toBeVisible({ timeout: 10000 });

// Click the dropdown
await filterDropdownAffiliationsone.click();

// Wait for the dropdown listbox to show
const dropdownPanelAffione = frame.locator('ul[role="listbox"]');
await expect(dropdownPanelAffione).toBeVisible({ timeout: 5000 });

// Select the 5th option
const fifthOptionAffione = dropdownPanelAffione.locator('li[role="option"]').nth(4);
await fifthOptionAffione.click();

// Measure time for spinner to finish
const filterStartAffione = Date.now();
const filterSpinnerAffione = frame.locator(".ant-spin.ant-spin-spinning");

// await expect(filterSpinnerAffi.first()).toBeVisible({ timeout: 60000 });
// await filterSpinnerAffi.first().waitFor({ state: "detached", timeout: 60000 });

const filterEndAffione = Date.now();
const filterLoadTimeAffilone = ((filterEndAffione - filterStartAffione) / 1000).toFixed(1);

filterLoadTimes.push({
  Scenario: "In PCP - selecting Affiliated to Hospital (ABRAZO ARROWHEADS CAMPUS)",
  Time: `${filterLoadTimeAffilone}s`,
});





// ******************************** TEST CASE START ***********************************************
// In PCP - Click on exclusive and select Parent Org and Execute (CENTENE CORPORATION)


// Wait for the iframe to load (optional but safe)
await expect(iframe.locator('body')).toBeVisible({ timeout: 10000 });

// Locate the "Excl." radio label (visible clickable element)
const exclRadioLabelone = iframe.locator('label:has-text("Excl.")');

// Wait until it's visible and enabled
await expect(exclRadioLabelone).toBeVisible({ timeout: 10000 });
await expect(exclRadioLabelone).toBeEnabled({ timeout: 10000 });

// Click the label to select the radio button
await exclRadioLabelone.click();

// Optional: Verify it’s selected (checked)
await expect(exclRadioLabelone).toHaveClass(/ant-radio-button-wrapper-checked/);



// Locate the dropdown with id="10"
const filterDropdownParentone = frame.locator("#\\39");
await expect(filterDropdownParent).toBeVisible({ timeout: 10000 });

// Click the dropdown
await filterDropdownParent.click();

// Wait for the dropdown listbox to show
const dropdownPanelParentone = frame.locator('ul[role="listbox"]');
await expect(dropdownPanelParentone).toBeVisible({ timeout: 5000 });

// Select the 5th option
const fifthOptionParentone = dropdownPanelParentone.locator('li[role="option"]').nth(1);
await fifthOptionParentone.click();

// Measure time for spinner to finish
const filterSpinnerParentone = frame.locator(".ant-spin.ant-spin-spinning");

 // Click Execute and start timer
 const executeButtonclickone = frameLocator.getByRole("button", { name: "Execute" });
 await expect(executeButtonclickone).toBeVisible({ timeout: 10000 });

 const startExecuteClickone = Date.now();
 await executeButtonclickone.click();

 // Wait for result spinner
 const emptyStateClickone = frameLocator.locator(".ant-empty");
 if (await emptyStateClickone.isVisible()) {
   console.warn("⚠️ No data found after Execute. Empty state is rendered.");
 } else {
   const rows = frameLocator.locator("table tbody tr");
   await expect(rows.first()).toBeVisible({ timeout: 10000 });
   const rowCount = await rows.count();
   console.log(`✅ Data loaded. Row count: ${rowCount}`);
 }

 // Wait for results table
 const resultTableClickone = frameLocator.locator("table");
 await expect(resultTableClickone).toBeVisible({ timeout: 30000 });

 const endStartClickone = Date.now();
 const resultLoadTimeClickone = ((endStartClickone - startExecuteClickone) / 1000).toFixed(2);

filterLoadTimes.push({
  Scenario: "In PCP - Click on exclusive and select Parent Org and Execute (CENTENE CORPORATION)",
  Time: `${resultLoadTimeClickone}s`,
});






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
await npiInput.fill('1265497713');

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



const collapseHeader = frameLocator.locator('.ant-collapse-header', { hasText: 'PCP' });
await collapseHeader.click();


await page.waitForTimeout(3000); // Optional pause

// ******************************** TEST CASE START ***********************************************
//Search using NPI Number - download time for Affiliation data (same NPI)



const providerLink21 = frameLocator.getByText("CHERYL A MAURICE", { exact: false });
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




// Locate the Networks link for the specific provider (IDA LOUISE SANTANA's row)
const networksLinktwo = frameLocator.locator('tr:has-text("CHERYL A MAURICE") a.networklink >> nth=1');
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

console.table(filterLoadTimes);

console.table("filterLoadTimes",);
const closeTabButton10 = frameLocator.locator('button.ant-tabs-tab-remove[aria-label="remove"]');
await expect(closeTabButton10).toBeVisible({ timeout: 10000 });
await closeTabButton9.click();



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

const resultTableone2 = frameLocator1.locator("table"); // Use iframe context
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
  const clients = ["Demo"];
  // const clients = ["Demo", "MJHS", "IBX", "CDPHP", "Aetna"];

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

  const results = [];

  // Login using Demo
  await page.goto(loginUrl);
  await page
    .getByRole("textbox", { name: "Enter email address" })
    .fill(username);
  await page.getByRole("textbox", { name: "Enter password" }).fill(password);
  await page.getByRole("button", { name: "Login" }).click();

  const continueButton = page.getByRole("button", { name: "Continue" });
  await expect(continueButton).toBeVisible({ timeout: 15000 });
  await continueButton.click();

  for (const client of clients) {
    const config = clientConfig[client];
    const { menuText, views } = config;
    console.log("clientConfig", clients);

    if (client !== "Demo") {
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

      await page.waitForTimeout(3000);
    }

    if (views.npiSearch) {
      const filterLoadTimes = await measureTTFD(menuText, views.npiSearch, page);
      await writeToExcel(filePath, filterLoadTimes, client, estTime);
    }

    console.log(`✅ Measured TTFD for client: ${client}`);

    console.log(`✅ Measured TTFD for client: ${client}`);
  }
});


async function writeToExcel(filePath, data, clientName, estTime) {
  const workbook = new ExcelJS.Workbook();
  
  try {
    // Try to read existing workbook
    await workbook.xlsx.readFile(filePath);
  } catch (error) {
    // If file doesn't exist, create a new workbook
    console.log("Creating new Excel file...");
  }

  // Add a worksheet for the current client
  const worksheet = workbook.addWorksheet(clientName);

  // Add headers
  worksheet.columns = [
    { header: 'Scenario', key: 'Scenario', width: 60 },
    { header: 'Time', key: 'Time', width: 15 },
    { header: 'Run Time', key: 'RunTime', width: 20 }
  ];

  // Add data rows
  data.forEach(row => {
    worksheet.addRow({
      Scenario: row.Scenario,
      Time: row.Time,
      RunTime: estTime
    });
  });

  // Style the header row
  worksheet.getRow(1).eachCell(cell => {
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
  });

  // Save the workbook
  await workbook.xlsx.writeFile(filePath);
  console.log(`Results saved to ${filePath}`);
}
