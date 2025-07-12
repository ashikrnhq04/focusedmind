// Background script for Focus Mode Extension

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "START_FOCUS") {
    // Set badge to show focus is active
    chrome.action.setBadgeText({ text: "ON" });
    chrome.action.setBadgeBackgroundColor({ color: "#28a745" });

    // Send message to all content scripts to reset distraction tracking
    await resetDistractionTracking();
  } else if (message.type === "STOP_FOCUS") {
    // Clear badge
    chrome.action.setBadgeText({ text: "" });

    // Send message to all content scripts to remove overlays and reset tracking
    await resetDistractionTracking();
  }
});

// Check for expired sessions periodically
setInterval(async () => {
  const data = await chrome.storage.local.get(["focusActive", "endTime"]);

  if (data.focusActive && data.endTime && Date.now() >= data.endTime) {
    // Session has expired - mark as completed but not yet shown to user
    await chrome.storage.local.set({
      focusActive: false,
      sessionCompleted: true, // Flag to show completion view
      // Keep all other data (task, startTime, endTime, distractions, etc.)
    });

    // Clear badge
    chrome.action.setBadgeText({ text: "" });
  }
}, 5000); // Check every 5 seconds

// Handle extension startup - check if there's an active session
chrome.runtime.onStartup.addListener(async () => {
  const data = await chrome.storage.local.get(["focusActive", "endTime"]);

  if (data.focusActive && data.endTime) {
    if (Date.now() < data.endTime) {
      // Session is still active
      chrome.action.setBadgeText({ text: "ON" });
      chrome.action.setBadgeBackgroundColor({ color: "#28a745" });
    } else {
      // Session has expired - mark as completed but not yet shown to user
      await chrome.storage.local.set({
        focusActive: false,
        sessionCompleted: true, // Flag to show completion view
        // Keep all other data (task, startTime, endTime, distractions, etc.)
      });
    }
  }
});

// Function to reset distraction tracking across all tabs
async function resetDistractionTracking() {
  // Since we can't directly access tabs anymore, content scripts will
  // handle distraction tracking reset via storage changes
  // The content scripts listen for storage changes and reset accordingly
  try {
    // This will trigger storage change events that content scripts can listen to
    await chrome.storage.local.set({
      resetDistractionTracking: Date.now(),
    });
  } catch (error) {
    // Error setting storage
  }
}
