// content.js - DOM Investigator v2

console.log("Jules a.k.a. Menstrual Cycle Visualizer is running. (DOM Investigator Mode v2)");

// More comprehensive list of potential selectors
const potentialSelectors = [
    // --- Previous Selectors ---
    'div[data-datekey]',
    '[data-date]',
    'div[role="gridcell"]',
    'div[data-day-id]',
    'td.fc-day',
    '[aria-label*="202"]', // Assuming the year is in the 2020s
    'div[jsname="jVqMGc"]',
    'a[aria-label][href*="/calendar/day"]',

    // --- New Selectors (more generic) ---
    'div[data-datekey^="20"]', // Starts with the year
    'div[class*="day"]',
    'td[class*="day"]',
    'div[role="button"]',
    'div[aria-labelledby]',
    '[jscontroller]',
    'div[jsaction]',
    'h2[data-date]', // Might be a header within the cell

    // --- New Selectors (structure-based) ---
    'div[role="row"] > div[role="gridcell"]',
    'tbody > tr > td',

    // --- New Selectors (looking for text content hints) ---
    'div[aria-label]', // Any element with an aria-label
    'div:not(:empty)', // Any div that is not empty, to see what's there

    // --- Very Generic ---
    'div[class]', // Any div with a class
    'span[class]', // Any span with a class
];

/**
 * Main function to investigate the DOM.
 */
const investigateDOM = () => {
    try {
        console.log("--- Jules v2: Starting DOM Investigation ---");

        let foundSomething = false;

        potentialSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                foundSomething = true;
                console.log(`%cFOUND ${elements.length} elements with selector: "${selector}"`, 'color: green; font-weight: bold;');

                // Log details of the first element found for context
                const firstElement = elements[0];
                console.log("  First element found:", firstElement);

                // Log its attributes for more clues
                const attrs = Array.from(firstElement.attributes).map(attr => `  - ${attr.name}="${attr.value}"`).join('\n');
                console.log("  Attributes:\n" + attrs);

                // Log its inner text/HTML if it's short
                if (firstElement.innerText && firstElement.innerText.length < 100) {
                    console.log(`  Inner Text: "${firstElement.innerText.trim()}"`);
                }
                 if (firstElement.innerHTML && firstElement.innerHTML.length < 250) {
                    console.log(`  Inner HTML sample: "${firstElement.innerHTML.trim()}"`);
                }

            } else {
                // This will be too noisy now, so I'll comment it out.
                // console.log(`NOT FOUND: No elements matching selector: "${selector}"`);
            }
        });

        if (!foundSomething) {
            console.log("%cWARNING: No elements were found matching ANY of the potential selectors.", 'color: orange; font-weight: bold;');
        }

        console.log("--- Jules v2: End of Report ---");
    } catch (error) {
        console.error("Jules v2: An error occurred during DOM investigation:", error);
    }
};

// We need a reliable way to run this after the calendar has loaded.
// Google Calendar is a single-page app (SPA), so 'load' only fires once.
// A simple interval is a bit crude but effective for this diagnostic purpose.
let investigationInterval = null;

const startInvestigation = () => {
    // Clear any existing interval to avoid multiple loops
    if (investigationInterval) {
        clearInterval(investigationInterval);
    }
    console.log("Jules v2: Starting periodic DOM investigation (every 7 seconds)...");
    investigationInterval = setInterval(investigateDOM, 7000); // Run every 7 seconds
    // Run it once immediately too
    investigateDOM();
};

// Start the investigation when the window loads.
window.addEventListener('load', () => {
    console.log("Jules v2: Window loaded. Giving SPA time to initialize...");
    // Wait a couple of seconds for the single-page app to potentially render its content.
    setTimeout(startInvestigation, 3000);
});
