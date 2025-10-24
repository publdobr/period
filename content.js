// content.js - DOM Investigator

console.log("Jules a.k.a. Menstrual Cycle Visualizer is running. (DOM Investigator Mode)");

const potentialSelectors = [
  'div[data-datekey]',      // Original guess
  '[data-date]',            // From Stack Overflow
  'div[role="gridcell"]',   // Generic grid cell
  'div[data-day-id]',       // Another possibility
  'td.fc-day',              // Common in calendar libraries
  '[aria-label*="202"]',    // Look for elements with years in their labels
  'div[jsname="jVqMGc"]',    // A previously seen jsname for day cells
  'a[aria-label][href*="/calendar/day"]' // Links to day views
];

/**
 * Main function to investigate the DOM.
 */
const investigateDOM = () => {
  console.log("--- Jules: DOM Investigation Report ---");

  potentialSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      console.log(`FOUND ${elements.length} elements with selector: "${selector}"`);
      // Log details of the first element found for context
      console.log("  First element:", elements[0]);
    } else {
      console.log(`NOT FOUND: No elements matching selector: "${selector}"`);
    }
  });

  console.log("--- End of Report ---");
};


// Run the investigation periodically to catch the calendar grid when it loads.
// No need for MutationObserver in this mode, we'll just poll.
setInterval(investigateDOM, 5000); // Run every 5 seconds

// Run it once on load as well.
window.addEventListener('load', () => {
    console.log("Jules: Window loaded. Running initial DOM investigation.");
    investigateDOM();
});
