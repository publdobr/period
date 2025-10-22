// popup.js

document.addEventListener('DOMContentLoaded', () => {
  const startDateInput = document.getElementById('startDate');
  const cycleLengthInput = document.getElementById('cycleLength');
  const periodLengthInput = document.getElementById('periodLength');
  const saveButton = document.getElementById('saveButton');
  const statusMessage = document.getElementById('statusMessage');

  // Load saved settings from storage
  const loadSettings = () => {
    chrome.storage.local.get(['startDate', 'cycleLength', 'periodLength'], (result) => {
      if (result.startDate) {
        startDateInput.value = result.startDate;
      }
      if (result.cycleLength) {
        cycleLengthInput.value = result.cycleLength;
      }
      if (result.periodLength) {
        periodLengthInput.value = result.periodLength;
      }
    });
  };

  // Save settings to storage
  const saveSettings = () => {
    const startDate = startDateInput.value;
    const cycleLength = cycleLengthInput.value;
    const periodLength = periodLengthInput.value;

    if (!startDate) {
      statusMessage.textContent = 'Please select a start date.';
      statusMessage.style.color = 'red';
      return;
    }

    chrome.storage.local.set({
      startDate,
      cycleLength,
      periodLength
    }, () => {
      statusMessage.textContent = 'Settings saved!';
      statusMessage.style.color = 'green';
      setTimeout(() => {
        statusMessage.textContent = '';
      }, 3000);
    });
  };

  saveButton.addEventListener('click', saveSettings);
  loadSettings();
});
