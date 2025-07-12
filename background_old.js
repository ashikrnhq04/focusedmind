// Background script for Focus Mode Extension

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "START_FOCUS") {
    // Set badge to show focus is active
    chrome.action.setBadgeText({ text: "ON" });
    chrome.action.setBadgeBackgroundColor({ color: "#28a745" });
    
    // Send message to all content scripts to reset distraction tracking
    // Content scripts will handle this via runtime.sendMessage
    await resetDistractionTracking();
  } else if (message.type === "STOP_FOCUS") {
    // Clear badge
    chrome.action.setBadgeText({ text: "" });
    
    // Send message to all content scripts to remove overlays and reset tracking
    await resetDistractionTracking();
  }
});

// Function to remove overlays from all existing tabs
async function removeOverlaysFromAllTabs() {
  try {
    const tabs = await chrome.tabs.query({});

    for (const tab of tabs) {
      // Skip chrome:// pages and other restricted pages
      if (
        tab.url.startsWith("chrome://") ||
        tab.url.startsWith("chrome-extension://") ||
        tab.url.startsWith("edge://") ||
        tab.url.startsWith("about:") ||
        tab.url.startsWith("moz-extension://")
      ) {
        continue;
      }

      try {
        // Execute script to remove overlay
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: removeOverlay,
        });
      } catch (error) {
        // Failed to remove overlay from tab
      }
    }
  } catch (error) {
    // Error removing overlays
  }
}

// Function to be injected into tabs to remove overlay
function removeOverlay() {
  const existingOverlay = document.getElementById("focus-overlay");
  if (existingOverlay) {
    existingOverlay.remove();
  }
}

// Function to inject content script into all existing tabs
async function injectContentScriptIntoAllTabs() {
  try {
    const tabs = await chrome.tabs.query({});

    for (const tab of tabs) {
      // Skip chrome:// pages and other restricted pages
      if (
        tab.url.startsWith("chrome://") ||
        tab.url.startsWith("chrome-extension://") ||
        tab.url.startsWith("edge://") ||
        tab.url.startsWith("about:") ||
        tab.url.startsWith("moz-extension://")
      ) {
        continue;
      }

      try {
        // Try to inject the content script
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content.js"],
        });
      } catch (error) {
        // Failed to inject into tab
      }
    }
  } catch (error) {
    // Error injecting content scripts
  }
}

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

    // Remove all overlays from all tabs
    await removeOverlaysFromAllTabs();
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

      // Remove all overlays from all tabs
      await removeOverlaysFromAllTabs();
    }
  }
});

// Function to reset distraction tracking across all tabs
async function resetDistractionTracking() {
  try {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            // Clear session storage for distraction tracking
            if (typeof sessionStorage !== "undefined") {
              sessionStorage.removeItem("focusedmind_last_blocked");
              sessionStorage.removeItem("focusedmind_last_check_time");
            }
          },
        });
      } catch (error) {
        // Failed to reset tracking for this tab (might be a chrome:// or extension page)
      }
    }
  } catch (error) {
    // Error resetting distraction tracking
  }
}
