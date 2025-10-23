// content.js

console.log("Jules a.k.a. Menstrual Cycle Visualizer is running.");

// Gradient colors from PRD: Burgundy → Pink → Cream → Coral → Gold → Ochre → Lilac → Indigo
const gradientColors = [
  '#800020', '#ffc0cb', '#fffdd0', '#ff7f50',
  '#ffd700', '#cc7722', '#c8a2c8', '#4b0082'
];
const periodColor = '#800020'; // Burgundy for the period days

/**
 * Converts a HEX color to an RGBA color with a given opacity.
 * @param {string} hex The hex color string.
 * @param {number} opacity The opacity value (0-1).
 * @returns {string} The RGBA color string.
 */
const hexToRgba = (hex, opacity) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Determines if a color is dark or light.
 * @param {string} hex The hex color string.
 * @returns {boolean} True if the color is dark, false otherwise.
 */
const isColorDark = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
};

/**
 * Calculates the difference in days between two dates.
 * @param {Date} date1 The first date.
 * @param {Date} date2 The second date.
 * @returns {number} The number of days between the two dates.
 */
const diffInDays = (date1, date2) => {
  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
};

/**
 * Main function to color the calendar.
 */
const colorCalendar = () => {
  chrome.storage.local.get(['startDate', 'cycleLength', 'periodLength'], (result) => {
    const { startDate: startDateStr, cycleLength = 28, periodLength = 5 } = result;

    if (!startDateStr) {
      console.log("Jules: No cycle data found.");
      return;
    }

    const startDate = new Date(startDateStr);

    const dateCells = document.querySelectorAll('div[data-datekey]');

    dateCells.forEach(cell => {
      const dateKey = cell.getAttribute('data-datekey');
      const cellDate = new Date(parseInt(dateKey, 10) * 1000);

      const dayDifference = diffInDays(startDate, cellDate);

      if (dayDifference < 0) return;

      const currentCycleDay = dayDifference % cycleLength;

      let hexColor;

      // Check if the day is within the period
      if (currentCycleDay < periodLength) {
        hexColor = periodColor;
      } else {
        // Map the remaining cycle days to the gradient
        const postPeriodDay = currentCycleDay - periodLength;
        const postPeriodLength = cycleLength - periodLength;
        const colorIndex = Math.floor((postPeriodDay / postPeriodLength) * (gradientColors.length -1)); // -1 to exclude period color
        hexColor = gradientColors[(colorIndex + 1) % gradientColors.length]; // +1 to start from the next color
      }

      cell.style.backgroundColor = hexToRgba(hexColor, 0.3);

      const dayNumberElement = cell.querySelector('span');
      if (dayNumberElement) {
        dayNumberElement.style.color = isColorDark(hexColor) ? 'white' : 'black';
        dayNumberElement.style.fontWeight = 'bold';
      }
    });
  });
};

/**
 * A MutationObserver to watch for changes.
 */
let debounceTimer;
const observer = new MutationObserver(() => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(colorCalendar, 500);
});

const targetNode = document.querySelector('div[role="main"]');
if (targetNode) {
  const config = { childList: true, subtree: true };
  observer.observe(targetNode, config);
  colorCalendar();
} else {
  window.addEventListener('load', () => {
    const fallbackNode = document.querySelector('div[role="main"]') || document.body;
    const config = { childList: true, subtree: true };
    observer.observe(fallbackNode, config);
    colorCalendar();
  });
}
