// content.js

(function() {
  console.log("Jules's Menstrual Cycle Visualizer is running.");

  const DEFAULT_SETTINGS = {
    cycleStartDate: new Date().toISOString().split('T')[0], // Default to today
    cycleLength: 28,
    periodLength: 5,
  };

  // --- Date Utilities ---

  /**
   * Formats a Date object into 'YYYY-MM-DD' string.
   * @param {Date} date The date to format.
   * @returns {string} The formatted date string.
   */
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Calculates the difference in days between two dates.
   * @param {Date} date1 First date.
   * @param {Date} date2 Second date.
   * @returns {number} The number of full days between the two dates.
   */
  function dayDifference(date1, date2) {
    const msPerDay = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.floor((utc2 - utc1) / msPerDay);
  }


  // --- Cycle Calculation ---

  /**
   * Determines the phase of the menstrual cycle for a given date.
   * @param {Date} currentDate The date to check.
   * @param {string} cycleStartDate The start date of the cycle (YYYY-MM-DD).
   * @param {number} cycleLength The total length of the cycle in days.
   * @param {number} periodLength The length of the period in days.
   * @returns {string} 'period', 'fertile', or 'regular'.
   */
  function getCyclePhase(currentDate, cycleStartDate, cycleLength, periodLength) {
    const startDate = new Date(cycleStartDate);
    // Adjust start date to be timezone-offset-free
    startDate.setMinutes(startDate.getMinutes() + startDate.getTimezoneOffset());


    const daysSinceStart = dayDifference(startDate, currentDate);

    if (daysSinceStart < 0) {
      return 'regular'; // Date is before the cycle even started
    }

    const dayInCycle = daysSinceStart % cycleLength;

    // Phase 1: Period
    if (dayInCycle < periodLength) {
      return 'period';
    }

    // Phase 2: Fertile Window (Approximation: typically days 11-16 for a 28-day cycle)
    // A common way to estimate ovulation is 14 days before the *next* cycle.
    const ovulationDay = cycleLength - 14;
    const fertileStart = ovulationDay - 4;
    const fertileEnd = ovulationDay + 1;

    if (dayInCycle >= fertileStart && dayInCycle <= fertileEnd) {
      return 'fertile';
    }

    return 'regular';
  }


  // --- Style Injection ---

  /**
   * Injects CSS into the page to color the calendar day headers.
   * @param {object} settings The user's settings.
   */
  function updateCalendarStyles(settings) {
    const styleId = 'jules-cycle-styles';
    let existingStyleElement = document.getElementById(styleId);

    // Clear old styles
    if (existingStyleElement) {
      existingStyleElement.remove();
    }

    const calendarDays = document.querySelectorAll('[data-start-date-key]');
    if (calendarDays.length === 0) {
        console.log("Jules: Calendar grid not found on the page yet.");
        return;
    }

    let cssRules = '';
    const {
      cycleStartDate,
      cycleLength,
      periodLength
    } = settings;

    calendarDays.forEach(dayElement => {
      const dateKey = dayElement.getAttribute('data-start-date-key');
      if (dateKey) {
        const currentDate = new Date(dateKey);
        // Adjust for timezone offset to get a clean UTC-based date
        currentDate.setMinutes(currentDate.getMinutes() + currentDate.getTimezoneOffset());


        const phase = getCyclePhase(currentDate, cycleStartDate, cycleLength, periodLength);

        let color = '';
        switch (phase) {
          case 'period':
            color = 'rgba(255, 182, 193, 0.6)'; // Light Pink
            break;
          case 'fertile':
            color = 'rgba(173, 216, 230, 0.6)'; // Light Blue
            break;
          default:
            // No color for regular days
            break;
        }

        if (color) {
            // This is the selector the user provided to target the day's header
            const selector = `[data-start-date-key="${dateKey}"] > [role="presentation"] > [role="row"] > [role="presentation"] > [role="columnheader"]:nth-child(2),
[data-start-date-key="${dateKey}"] > [role="presentation"] > [role="row"] > [role="presentation"] > ul > li:nth-child(1)`;

            cssRules += `
              ${selector} {
                background-color: ${color} !important;
                position: relative; /* As suggested by the user's style */
              }
            `;
        }
      }
    });

    if (cssRules) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = cssRules;
      document.head.appendChild(styleElement);
    }
  }

  // --- Initialization and Observers ---

  /**
   * Main initialization function.
   */
  function init() {
    chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS), (storedSettings) => {
      const settings = { ...DEFAULT_SETTINGS,
        ...storedSettings
      };
      // Ensure lengths are numbers
      settings.cycleLength = parseInt(settings.cycleLength, 10);
      settings.periodLength = parseInt(settings.periodLength, 10);

      // Initial run
      updateCalendarStyles(settings);

      // Use a MutationObserver to detect when the calendar view changes.
      const observer = new MutationObserver((mutations) => {
         // A simple debounce to avoid rapid-fire updates
         clearTimeout(observer.debounce);
         observer.debounce = setTimeout(() => {
             console.log("Jules: Calendar DOM changed, re-applying styles.");
             updateCalendarStyles(settings);
         }, 500);
      });

      // Google Calendar's main content area is a good target.
      const targetNode = document.querySelector('[role="main"]');
      if (targetNode) {
        observer.observe(targetNode, {
          childList: true,
          subtree: true
        });
      } else {
          console.warn("Jules: Could not find target node '[role=\"main\"]' to observe.");
      }
    });
  }

  // --- Event Listeners ---

  // Listen for messages from the popup (e.g., when settings are updated)
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "settingsUpdated") {
      console.log("Jules: Received settings update from popup. Re-applying styles.");
      init(); // Re-initialize with new settings
      sendResponse({ status: "Styles updated" });
    }
  });

  // Initial load can be tricky in SPAs. We'll wait for the window to be fully loaded,
  // then give the app a moment to render its initial view.
  window.addEventListener('load', () => {
      setTimeout(init, 2000); // Wait 2 seconds for GCal to build its DOM
  });

})();