let customUrls = [];
let countdownInterval;

// Initialize popup when loaded
document.addEventListener("DOMContentLoaded", async () => {
  await loadCustomUrls();
  await loadFormData(); // Load saved form data
  await checkFocusStatus();
  setupEventListeners();
});

// Save form data to storage
async function saveFormData() {
  const task = document.getElementById("task").value.trim();
  const duration = document.getElementById("duration").value;
  const excludeSites = document.getElementById("exclude-input").value.trim();
  const selectedCategories = Array.from(
    document.querySelectorAll('#categories input[type="checkbox"]:checked')
  ).map((cb) => cb.value);

  await chrome.storage.local.set({
    formData: {
      task,
      duration,
      selectedCategories,
      customUrls,
      excludeSites,
    },
  });
}

// Load form data from storage
async function loadFormData() {
  const data = await chrome.storage.local.get(["formData"]);

  if (data.formData) {
    // Restore task
    if (data.formData.task) {
      document.getElementById("task").value = data.formData.task;
    }

    // Restore duration
    if (data.formData.duration) {
      document.getElementById("duration").value = data.formData.duration;
    }

    // Restore exclude sites
    if (data.formData.excludeSites) {
      document.getElementById("exclude-input").value =
        data.formData.excludeSites;
    }

    // Restore selected categories
    if (data.formData.selectedCategories) {
      const checkboxes = document.querySelectorAll(
        '#categories input[type="checkbox"]'
      );
      checkboxes.forEach((checkbox) => {
        checkbox.checked = data.formData.selectedCategories.includes(
          checkbox.value
        );
      });
    }

    // Custom URLs are already loaded in loadCustomUrls function
  }
}

// Clear form data from storage (when focus starts)
async function clearFormData() {
  await chrome.storage.local.remove(["formData"]);
}

function setupEventListeners() {
  document.getElementById("start").addEventListener("click", startFocus);
  document.getElementById("stop").addEventListener("click", () => {
    stopFocus(true, true); // showCompletion=true, isManualStop=true
  });
  document.getElementById("reset").addEventListener("click", resetToSetup);
  document.getElementById("add-url").addEventListener("click", async () => {
    await addCustomUrl();
  });

  // Use blur instead of input for duration to allow typing
  document
    .getElementById("duration")
    .addEventListener("blur", validateDuration);
  document
    .getElementById("duration")
    .addEventListener("change", validateDuration);

  // Add input validation to catch edge cases
  document.getElementById("duration").addEventListener("input", (e) => {
    const value = e.target.value;
    if (value && (parseInt(value) > 30 || parseInt(value) < 15)) {
      validateDuration();
      saveFormData(); // Save on input change
    }
  });

  // Use blur instead of input for task to allow typing
  document.getElementById("task").addEventListener("blur", validateTask);

  // Save form data when inputs change
  document.getElementById("task").addEventListener("input", saveFormData);
  document.getElementById("duration").addEventListener("change", saveFormData);
  document
    .getElementById("exclude-input")
    .addEventListener("input", saveFormData);

  // Save when checkboxes change
  document
    .querySelectorAll('#categories input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", saveFormData);
    });

  // Allow adding URL with Enter key
  document
    .getElementById("url-input")
    .addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        await addCustomUrl();
      }
    });
}

async function loadCustomUrls() {
  const data = await chrome.storage.local.get(["customUrls"]);
  customUrls = data.customUrls || [];
  renderUrlList();
}

function renderUrlList() {
  const urlList = document.getElementById("url-list");
  urlList.innerHTML = "";

  customUrls.forEach((url, index) => {
    const urlItem = document.createElement("div");
    urlItem.className = "url-item";

    const urlSpan = document.createElement("span");
    urlSpan.textContent = url;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.type = "button";
    removeButton.addEventListener("click", async () => {
      await removeCustomUrl(index);
    });

    urlItem.appendChild(urlSpan);
    urlItem.appendChild(removeButton);
    urlList.appendChild(urlItem);
  });
}

async function addCustomUrl() {
  const urlInput = document.getElementById("url-input");
  const url = urlInput.value.trim();

  if (!url) return;

  // Extract domain from URL
  let domain;
  try {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      domain = url.replace(/^www\./, "");
    } else {
      const urlObj = new URL(url);
      domain = urlObj.hostname.replace(/^www\./, "");
    }
  } catch (e) {
    // Show inline error instead of alert
    urlInput.style.borderColor = "#dc3545";
    urlInput.title = "Please enter a valid URL";
    setTimeout(() => {
      urlInput.style.borderColor = "";
      urlInput.title = "";
    }, 3000);
    return;
  }

  if (!customUrls.includes(domain)) {
    customUrls.push(domain);
    await chrome.storage.local.set({ customUrls });
    renderUrlList();
    urlInput.style.borderColor = "";
    urlInput.title = "";
    await saveFormData(); // Save form data after adding URL
  }

  urlInput.value = "";
}

async function removeCustomUrl(index) {
  customUrls.splice(index, 1);
  await chrome.storage.local.set({ customUrls });
  renderUrlList();
  await saveFormData(); // Save form data after removing URL
}

function validateDuration() {
  const durationInput = document.getElementById("duration");
  let duration = parseInt(durationInput.value);
  const errorDiv = document.getElementById("duration-error");

  // Handle empty/blank input
  if (
    durationInput.value === "" ||
    durationInput.value === null ||
    durationInput.value === undefined
  ) {
    errorDiv.textContent = "Please enter a duration between 15-30 minutes.";
    errorDiv.style.display = "block";
    return false;
  }

  // Handle negative numbers by converting to positive
  if (duration < 0) {
    duration = Math.abs(duration);
    durationInput.value = duration;
  }

  if (isNaN(duration)) {
    errorDiv.textContent = "Please enter a valid number for duration.";
    errorDiv.style.display = "block";
    return false;
  }

  if (duration > 30) {
    errorDiv.textContent = "Focus for 15 to 30 mins is most effective.";
    errorDiv.style.display = "block";
    return true;
  } else if (duration < 15) {
    errorDiv.textContent = "A focus session should be at least 15 minutes.";
    errorDiv.style.display = "block";
    return false;
  } else {
    errorDiv.style.display = "none";
    return true;
  }
}

function validateTask() {
  const task = document.getElementById("task").value.trim();
  const errorDiv = document.getElementById("task-error");

  // Check for meaningful task (at least 3 characters and not just numbers/symbols)
  const meaningfulTaskRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9\s\-_.,!?]{3,}$/;

  if (!task) {
    errorDiv.textContent = "Please enter a task to focus on.";
    errorDiv.style.display = "block";
    return false;
  } else if (!meaningfulTaskRegex.test(task)) {
    errorDiv.textContent =
      "Please enter a meaningful task title (at least 3 characters with letters).";
    errorDiv.style.display = "block";
    return false;
  } else {
    errorDiv.style.display = "none";
    return true;
  }
}

function clearAllErrors() {
  document.getElementById("task-error").style.display = "none";
  document.getElementById("duration-error").style.display = "none";
}

// Calculate efficiency rating based on distraction count and session duration
function calculateEfficiency(distractionCount, sessionDuration) {
  // Calculate efficiency based on total distractions vs time elapsed
  // More distractions = worse efficiency

  console.log(
    `Efficiency calc: ${distractionCount} distractions in ${sessionDuration.toFixed(
      1
    )} minutes`
  );

  let rating, message, emoji;

  // Simple threshold based on total distractions (easier to understand)
  if (distractionCount <= 2) {
    rating = "excellent";
    message = "Excellent";
    emoji = "&#127919;"; // 🎯 target emoji as HTML entity
  } else if (distractionCount <= 4) {
    rating = "good";
    message = "Good";
    emoji = "&#128077;"; // 👍 thumbs up as HTML entity
  } else if (distractionCount <= 7) {
    rating = "average";
    message = "Average";
    emoji = "&#9889;"; // ⚡ lightning as HTML entity
  } else if (distractionCount <= 12) {
    rating = "poor";
    message = "Needs Focus";
    emoji = "&#9888;"; // ⚠️ warning as HTML entity
  } else {
    rating = "distracted";
    message = "Very Distracted";
    emoji = "&#128680;"; // 🚨 rotating light as HTML entity
  }

  return { rating, message, emoji };
}

// Update efficiency display
function updateEfficiencyDisplay(distractionCount, sessionDuration) {
  const efficiency = calculateEfficiency(distractionCount, sessionDuration);
  const efficiencyElement = document.getElementById("efficiency-rating");
  const efficiencyDisplay = document.getElementById("efficiency-display");

  // Remove all existing rating classes
  efficiencyElement.className = "";
  efficiencyElement.classList.add(efficiency.rating);

  // Update the display text
  efficiencyDisplay.innerHTML = `${efficiency.message} ${efficiency.emoji}`;

  console.log(
    `Efficiency: ${efficiency.message} (${distractionCount} distractions in ${sessionDuration} min session)`
  );
}

async function startFocus() {
  clearAllErrors();

  const task = document.getElementById("task").value.trim();
  const durationInput = document.getElementById("duration");
  const duration = parseInt(durationInput.value);
  const excludeSitesInput = document
    .getElementById("exclude-input")
    .value.trim();

  // Validate inputs
  const taskValid = validateTask();
  const durationValid = validateDuration();

  if (!taskValid || !durationValid) {
    return; // Stop if validation fails
  }

  // Check the duration input. If below 15 mins, set to 15 mins.

  durationInput.value = 15; // Set to minimum 15 minutes
  if (isNaN(duration) || duration < 15) {
    const errorDiv = document.getElementById("duration-error");
    errorDiv.textContent =
      "Focus for 15 to 30 mins is practical. Can't set a session lower than 15 minutes.";
    errorDiv.style.display = "block";
    return;
  }

  // If duration is above 30 mins, show error but allow it to be set
  if (duration > 30) {
    const errorDiv = document.getElementById("duration-error");
    errorDiv.textContent =
      "Focus for 15 to 30 mins is practical. Can't set a session longer than 30 minutes.";
    errorDiv.style.display = "block";
  }

  // Process exclude sites (parse comma-separated URLs)
  let excludeSites = [];
  if (excludeSitesInput) {
    excludeSites = excludeSitesInput
      .split(",")
      .map((site) => site.trim())
      .filter((site) => site.length > 0)
      .map((site) => {
        // Clean the URL (remove protocol, www, etc.)
        try {
          if (site.startsWith("http://") || site.startsWith("https://")) {
            return new URL(site).hostname.replace(/^www\./, "");
          } else {
            return site.replace(/^www\./, "");
          }
        } catch (e) {
          return site.replace(/^www\./, "");
        }
      });
  }

  // Get selected categories
  const selectedCategories = Array.from(
    document.querySelectorAll('#categories input[type="checkbox"]:checked')
  ).map((cb) => cb.value);

  const startTime = Date.now();
  const endTime = startTime + duration * 60 * 1000;

  console.log("=== STARTING FOCUS SESSION ===");
  console.log("Task:", task);
  console.log("Duration:", duration, "minutes");
  console.log("Selected categories:", selectedCategories);
  console.log("Custom URLs:", customUrls);
  console.log("Exclude sites (whitelist):", excludeSites);
  console.log("Whitelist mode:", excludeSites.length > 0);
  console.log("FORCE RESETTING distractions to 0");
  console.log("================================");

  // First clear the entire storage related to focus session
  await chrome.storage.local.remove([
    "distractions",
    "focusActive",
    "task",
    "startTime",
    "endTime",
    "blockedCategories",
    "customUrls",
    "excludeSites",
    "whitelistMode",
  ]);

  // Then set fresh values
  await chrome.storage.local.set({
    focusActive: true,
    task,
    startTime,
    endTime,
    distractions: 0, // Explicitly reset distraction count
    blockedCategories: selectedCategories,
    customUrls: customUrls,
    excludeSites: excludeSites,
    whitelistMode: excludeSites.length > 0, // Enable whitelist mode if exclude sites are specified
  });

  // Verify the reset worked
  const verifyData = await chrome.storage.local.get(["distractions"]);
  console.log(
    "✅ Verified distraction count after reset:",
    verifyData.distractions
  );

  chrome.runtime.sendMessage({ type: "START_FOCUS" });

  // Clear saved form data since focus has started successfully
  await clearFormData();

  switchToActiveView();
  startCountdown();
}

async function stopFocus(showCompletion = false, isManualStop = false) {
  console.log("🛑 Stopping focus session and resetting distraction count");

  // Get current session data before clearing
  const sessionData = await chrome.storage.local.get([
    "task",
    "startTime",
    "endTime",
    "distractions",
  ]);

  // Add the manual stop flag to session data
  sessionData.isManualStop = isManualStop;

  // First clear all focus-related data
  await chrome.storage.local.remove([
    "distractions",
    "focusActive",
    "task",
    "startTime",
    "endTime",
    "blockedCategories",
    "customUrls",
    "excludeSites",
    "whitelistMode",
  ]);

  // Then set clean default values
  await chrome.storage.local.set({
    focusActive: false,
    task: "",
    startTime: 0,
    endTime: 0,
    distractions: 0, // Reset distraction count
    blockedCategories: [],
    customUrls: [],
    excludeSites: [],
    whitelistMode: false,
  });

  // Verify the reset worked
  const verifyData = await chrome.storage.local.get(["distractions"]);
  console.log(
    "✅ Verified distraction count after stop:",
    verifyData.distractions
  );

  chrome.runtime.sendMessage({ type: "STOP_FOCUS" });

  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  // Show completion view if the session ended naturally or if requested
  if (showCompletion) {
    switchToCompletionView(sessionData);
  } else {
    switchToSetupView();
  }
}

async function resetToSetup() {
  // Clear any remaining session data
  await chrome.storage.local.remove([
    "distractions",
    "focusActive",
    "task",
    "startTime",
    "endTime",
    "blockedCategories",
    "customUrls",
    "excludeSites",
    "whitelistMode",
  ]);

  switchToSetupView();
}

async function checkFocusStatus() {
  const data = await chrome.storage.local.get([
    "focusActive",
    "endTime",
    "task",
    "distractions",
    "startTime",
  ]);

  if (data.focusActive && data.endTime && Date.now() < data.endTime) {
    switchToActiveView();
    startCountdown();
  } else if (data.focusActive && data.endTime && Date.now() >= data.endTime) {
    // Focus session has ended naturally - show completion view
    data.isManualStop = false; // Natural completion
    switchToCompletionView(data);
    await stopFocus(false, false); // Don't show completion again, not manual stop
  }
}

function switchToActiveView() {
  document.getElementById("setup-view").style.display = "none";
  document.getElementById("active-view").style.display = "block";
  document.body.classList.add("focus-active");

  chrome.storage.local.get(["task", "distractions"], (data) => {
    document.getElementById(
      "task-display"
    ).textContent = `Focusing on: ${data.task}`;
    const distractionCount = data.distractions || 0;
    console.log(
      "🎯 Switching to active view - distraction count:",
      distractionCount
    );
    document.getElementById("distraction-number").textContent =
      distractionCount + " times";

    // Initialize efficiency display
    const efficiencyElement = document.getElementById("efficiency-rating");
    const efficiencyDisplay = document.getElementById("efficiency-display");
    efficiencyElement.className = "excellent";
    efficiencyDisplay.innerHTML = "Starting Strong &#128640;"; // 🚀 rocket as HTML entity
  });
}

function switchToSetupView() {
  document.getElementById("setup-view").style.display = "block";
  document.getElementById("active-view").style.display = "none";
  document.getElementById("completion-view").style.display = "none";
  document.body.classList.remove("focus-active");
  document.body.classList.remove("focus-completed");
}

function switchToCompletionView(sessionData) {
  document.getElementById("setup-view").style.display = "none";
  document.getElementById("active-view").style.display = "none";
  document.getElementById("completion-view").style.display = "block";
  document.body.classList.remove("focus-active");
  document.body.classList.add("focus-completed");

  // Update the title based on whether it was manual stop or natural completion
  const completionTitle = document.querySelector("#completion-view h1");
  if (sessionData.isManualStop) {
    completionTitle.textContent = "Incomplete Session";
    completionTitle.classList.add("incomplete");
  } else {
    completionTitle.textContent = "Session Complete!";
    completionTitle.classList.remove("incomplete");
  }

  // Calculate session duration
  const sessionDurationMs = sessionData.endTime - sessionData.startTime;
  const sessionDurationMin = Math.floor(sessionDurationMs / 60000);
  const distractionCount = sessionData.distractions || 0;

  // Update completion view content
  document.getElementById(
    "completion-task-display"
  ).textContent = `Task: ${sessionData.task}`;

  document.getElementById(
    "completion-duration"
  ).textContent = `Session Duration: ${sessionDurationMin} minutes`;

  document.getElementById("completion-distraction-number").textContent =
    distractionCount + " times";

  // Calculate and display final efficiency
  const efficiency = calculateEfficiency(distractionCount, sessionDurationMin);
  const completionEfficiencyElement = document.getElementById(
    "completion-efficiency-rating"
  );
  const completionEfficiencyDisplay = document.getElementById(
    "completion-efficiency-display"
  );

  // Remove all existing rating classes and add the current one
  completionEfficiencyElement.className = "";
  completionEfficiencyElement.classList.add(efficiency.rating);
  completionEfficiencyDisplay.innerHTML = `${efficiency.message} ${efficiency.emoji}`;

  // Add motivational message based on whether it was manual stop or natural completion
  let message = "";

  if (sessionData.isManualStop) {
    // Messages for manual stops - more encouraging and understanding
    if (efficiency.rating === "excellent") {
      message =
        "Great start! You stopped early but maintained excellent focus. Building this habit will lead to amazing productivity gains.";
    } else if (efficiency.rating === "good") {
      message =
        "Good effort! Focusing on a task can be challenging initially. Over time you'll develop better concentration and become more productive.";
    } else if (efficiency.rating === "average") {
      message =
        "Keep going! Building focus is like building muscle - it takes practice. Each session gets you closer to mastering concentration.";
    } else if (efficiency.rating === "poor") {
      message =
        "Every journey starts with a single step. Focusing on a task can be challenging initially, but with practice you'll develop stronger concentration skills.";
    } else {
      message =
        "Don't worry, everyone starts somewhere! Focus is a skill that improves with practice. Try eliminating distractions and starting with shorter sessions.";
    }
  } else {
    // Messages for natural completion - more congratulatory
    if (efficiency.rating === "excellent") {
      message =
        "Outstanding focus! Congratulations on completing your session with excellent concentration. You're building incredible productivity habits!";
    } else if (efficiency.rating === "good") {
      message =
        "Congratulations! Great job completing your session with good focus. You stayed on track with minimal distractions.";
    } else if (efficiency.rating === "average") {
      message =
        "Well done on completing your session! You maintained decent focus. Try to minimize distractions in your next session for even better results.";
    } else if (efficiency.rating === "poor") {
      message =
        "Congratulations on finishing your session! Building focus takes practice. Consider removing more distractions from your environment next time.";
    } else {
      message =
        "You completed the session - that's progress! Focus takes practice, but you're on the right track. Try shorter sessions and eliminate more distractions.";
    }
  }

  document.getElementById("completion-message").textContent = message;
}

function startCountdown() {
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
}

async function updateCountdown() {
  const data = await chrome.storage.local.get([
    "endTime",
    "distractions",
    "startTime",
  ]);
  const now = Date.now();
  const timeLeft = data.endTime - now;

  if (timeLeft <= 0) {
    // Session completed naturally - show completion view
    document.getElementById("countdown").innerHTML =
      '<span style="color: #28a745; font-weight: bold;">🎉 Focus session completed!</span>';

    // Get final session data before stopping
    const finalSessionData = await chrome.storage.local.get([
      "task",
      "startTime",
      "endTime",
      "distractions",
    ]);

    // Add flag to indicate natural completion
    finalSessionData.isManualStop = false;

    switchToCompletionView(finalSessionData);
    await stopFocus(false, false); // Don't show completion again, not manual stop
    return;
  }

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  document.getElementById("countdown").textContent = `${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  // Update distraction count
  const distractionCount = data.distractions || 0;
  console.log("📊 Current distraction count from storage:", distractionCount);
  document.getElementById("distraction-number").textContent =
    distractionCount + " times";

  // Calculate session duration in minutes (how much time has passed)
  const totalSessionTime = (data.endTime - data.startTime) / 60000; // Total session length in minutes
  const elapsedTime = (data.endTime - timeLeft) / 60000; // Time elapsed in minutes

  console.log(
    "⏱️ Session timing - Elapsed:",
    elapsedTime.toFixed(1),
    "min, Total:",
    totalSessionTime.toFixed(1),
    "min"
  );

  // Only show efficiency after at least 2 minutes have passed
  if (elapsedTime >= 2) {
    updateEfficiencyDisplay(distractionCount, elapsedTime);
  } else {
    // Show initial excellent rating
    const efficiencyElement = document.getElementById("efficiency-rating");
    const efficiencyDisplay = document.getElementById("efficiency-display");
    efficiencyElement.className = "excellent";
    efficiencyDisplay.innerHTML = "Starting Strong &#128640;"; // 🚀 rocket as HTML entity
  }
}
