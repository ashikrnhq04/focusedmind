const knownSites = {
  // Entertainment
  "youtube.com": "entertainment",
  "netflix.com": "entertainment",
  "twitch.tv": "entertainment",
  "tiktok.com": "entertainment",
  "9gag.com": "entertainment",
  "imgur.com": "entertainment",
  "buzzfeed.com": "entertainment",
  "crunchyroll.com": "entertainment",
  "hulu.com": "entertainment",
  "disney.com": "entertainment",
  "disneyplus.com": "entertainment",
  "primevideo.com": "entertainment",
  "funnyordie.com": "entertainment",
  "collegehumor.com": "entertainment",
  "vimeo.com": "entertainment",
  "dailymotion.com": "entertainment",
  "vine.co": "entertainment",

  // Social Media
  "facebook.com": "social",
  "twitter.com": "social",
  "instagram.com": "social",
  "linkedin.com": "social",
  "snapchat.com": "social",
  "pinterest.com": "social",
  "telegram.org": "social",
  "whatsapp.com": "social",
  "discord.com": "social",
  "reddit.com": "social",
  "tumblr.com": "social",
  "quora.com": "social",
  "clubhouse.com": "social",
  "mastodon.social": "social",
  "threads.net": "social",

  // News - International
  "bbc.com": "news",
  "cnn.com": "news",
  "foxnews.com": "news",
  "nytimes.com": "news",
  "newyorktimes.com": "news",
  "washingtonpost.com": "news",
  "theguardian.com": "news",
  "reuters.com": "news",
  "ap.org": "news",
  "bloomberg.com": "news",
  "wsj.com": "news",
  "usatoday.com": "news",
  "npr.org": "news",
  "abcnews.go.com": "news",
  "cbsnews.com": "news",
  "nbcnews.com": "news",
  "time.com": "news",
  "newsweek.com": "news",
  "huffpost.com": "news",
  "vox.com": "news",
  "buzzfeednews.com": "news",
  "thehill.com": "news",
  "politico.com": "news",
  "axios.com": "news",
  "aljazeera.com": "news",
  "dw.com": "news",
  "euronews.com": "news",
  "france24.com": "news",

  // News - Bangladesh
  "prothomalo.com": "news",
  "prothom-alo.com": "news",
  "thedailystar.net": "news",
  "bdnews24.com": "news",
  "dhakatribune.com": "news",
  "newagebd.net": "news",
  "risingbd.com": "news",
  "kalerkantho.com": "news",
  "ittefaq.com.bd": "news",
  "jugantor.com": "news",
  "samakal.com": "news",
  "banglanews24.com": "news",
  "jagonews24.com": "news",
  "somoynews.tv": "news",
  "channeli.tv": "news",
  "ekushey-tv.com": "news",
  "independent.tv": "news",
  "businessstandard.com.bd": "news",

  // News - India
  "timesofindia.com": "news",
  "hindustantimes.com": "news",
  "thehindu.com": "news",
  "indianexpress.com": "news",
  "ndtv.com": "news",
  "zeenews.india.com": "news",
  "news18.com": "news",
  "republicworld.com": "news",
  "scroll.in": "news",
  "thewire.in": "news",

  // Adult Content
  "pornhub.com": "adult",
  "xvideos.com": "adult",
  "xnxx.com": "adult",
  "redtube.com": "adult",
  "youporn.com": "adult",
  "tube8.com": "adult",
  "spankbang.com": "adult",
  "xhamster.com": "adult",
  "brazzers.com": "adult",
  "onlyfans.com": "adult",
};

// Enhanced patterns for better categorization
const categoryPatterns = {
  news: [
    /news/i,
    /times/i,
    /post/i,
    /herald/i,
    /tribune/i,
    /daily/i,
    /gazette/i,
    /press/i,
    /journal/i,
    /reporter/i,
    /media/i,
    /channel/i,
    /radio/i,
    /prothom/i,
    /alo/i,
    /star/i,
    /express/i,
    /standard/i,
    /mirror/i,
    /bd(?![a-z])/i,
    /bangladesh/i,
    /dhaka/i,
    /chittagong/i,
    /sylhet/i,
    /rajshahi/i,
    /khulna/i,
    /barisal/i,
    /rangpur/i,
    /mymensingh/i,
    /breaking/i,
    /headline/i,
    /update/i,
    /report/i,
  ],
  social: [
    /chat/i,
    /message/i,
    /social/i,
    /connect/i,
    /community/i,
    /forum/i,
    /discussion/i,
    /talk/i,
    /meet/i,
    /friend/i,
    /network/i,
    /share/i,
    /post/i,
    /feed/i,
    /timeline/i,
    /profile/i,
    /follow/i,
  ],
  entertainment: [
    /video/i,
    /movie/i,
    /music/i,
    /game/i,
    /fun/i,
    /entertainment/i,
    /stream/i,
    /watch/i,
    /play/i,
    /comedy/i,
    /humor/i,
    /meme/i,
    /film/i,
    /show/i,
    /episode/i,
    /series/i,
    /anime/i,
    /manga/i,
    /reel/i,
    /short/i,
    /clip/i,
    /viral/i,
    /funny/i,
    /laugh/i,
  ],
  adult: [
    /porn/i,
    /xxx/i,
    /sex/i,
    /adult/i,
    /nude/i,
    /nsfw/i,
    /erotic/i,
    /cam/i,
    /live/i,
    /hot/i,
    /naked/i,
    /strip/i,
  ],
};

// Advanced content analysis
function analyzePageContent() {
  const title = document.title.toLowerCase();
  const metaDescription =
    document
      .querySelector('meta[name="description"]')
      ?.content?.toLowerCase() || "";
  const h1Text = Array.from(document.querySelectorAll("h1"))
    .map((h) => h.textContent.toLowerCase())
    .join(" ");
  const bodyText =
    document.body?.textContent?.toLowerCase().substring(0, 1000) || "";

  const combinedText = `${title} ${metaDescription} ${h1Text} ${bodyText}`;

  return combinedText;
}

function detectCategoryFromContent() {
  const content = analyzePageContent();

  // News indicators
  const newsKeywords = [
    "breaking news",
    "latest news",
    "headlines",
    "politics",
    "election",
    "government",
    "economy",
    "business news",
    "sports news",
    "weather",
    "coronavirus",
    "covid",
    "breaking:",
    "update:",
    "developing:",
    "exclusive:",
    "report:",
    "analysis:",
    "journalist",
    "correspondent",
    "newsroom",
    "editorial",
    "opinion",
  ];

  // Entertainment indicators
  const entertainmentKeywords = [
    "watch now",
    "streaming",
    "episode",
    "season",
    "movie",
    "film",
    "trailer",
    "celebrity",
    "hollywood",
    "bollywood",
    "music video",
    "album",
    "concert",
    "gaming",
    "gameplay",
    "review",
    "funny",
    "comedy",
    "meme",
    "viral",
    "entertainment",
    "show",
    "series",
    "documentary",
    "anime",
    "cartoon",
    "reels",
    "shorts",
    "tiktok",
    "instagram reels",
    "youtube shorts",
  ];

  // Social media indicators
  const socialKeywords = [
    "follow",
    "followers",
    "following",
    "like",
    "share",
    "comment",
    "post",
    "timeline",
    "feed",
    "profile",
    "message",
    "chat",
    "friend",
    "connect",
    "social network",
    "community",
    "group",
    "page",
    "status",
    "update",
  ];

  // Adult content indicators
  const adultKeywords = [
    "adult",
    "mature",
    "18+",
    "nsfw",
    "explicit",
    "sexual",
    "porn",
    "xxx",
    "erotic",
    "nude",
    "naked",
    "cam",
    "live show",
    "adult content",
  ];

  // Count keyword matches
  const newsScore = newsKeywords.reduce(
    (score, keyword) => score + (content.includes(keyword) ? 1 : 0),
    0
  );
  const entertainmentScore = entertainmentKeywords.reduce(
    (score, keyword) => score + (content.includes(keyword) ? 1 : 0),
    0
  );
  const socialScore = socialKeywords.reduce(
    (score, keyword) => score + (content.includes(keyword) ? 1 : 0),
    0
  );
  const adultScore = adultKeywords.reduce(
    (score, keyword) => score + (content.includes(keyword) ? 1 : 0),
    0
  );

  // Determine category based on highest score
  const scores = {
    news: newsScore,
    entertainment: entertainmentScore,
    social: socialScore,
    adult: adultScore,
  };

  const maxScore = Math.max(...Object.values(scores));
  if (maxScore >= 2) {
    // Minimum threshold
    return Object.keys(scores).find((key) => scores[key] === maxScore);
  }

  return null;
}

// Special check for YouTube Reels and Shorts
function isYouTubeEntertainment() {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  const url = window.location.href;

  if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
    // Check for entertainment content
    if (
      pathname.includes("/shorts/") ||
      (pathname.includes("/watch") && url.includes("&list=")) ||
      pathname.includes("/playlist") ||
      url.includes("shorts") ||
      url.includes("reels")
    ) {
      return true;
    }

    // Check page content for entertainment indicators
    const title = document.title.toLowerCase();
    const entertainmentIndicators = [
      "music",
      "funny",
      "comedy",
      "meme",
      "gaming",
      "entertainment",
      "viral",
      "trending",
    ];

    return entertainmentIndicators.some((indicator) =>
      title.includes(indicator)
    );
  }

  return false;
}

function getCategoryForDomain(domain) {
  // First check exact matches
  if (knownSites[domain]) {
    return knownSites[domain];
  }

  // Then check patterns in domain
  for (const [category, patterns] of Object.entries(categoryPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(domain)) {
        return category;
      }
    }
  }

  // Finally check page content
  return detectCategoryFromContent();
}

function domainMatches(hostname, domain) {
  // Remove www. from hostname for comparison
  const cleanHostname = hostname.replace(/^www\./, "");
  const cleanDomain = domain.replace(/^www\./, "");

  return (
    cleanHostname === cleanDomain ||
    cleanHostname.endsWith("." + cleanDomain) ||
    cleanDomain.endsWith("." + cleanHostname)
  );
}

function checkIfBlocked() {
  chrome.storage.local.get(
    [
      "focusActive",
      "endTime",
      "distractions",
      "task",
      "blockedCategories",
      "customUrls",
      "excludeSites",
      "whitelistMode",
    ],
    (data) => {
      console.log("=== FOCUS MODE DEBUG ===");
      console.log("Focus active:", data.focusActive);
      console.log("End time:", data.endTime, "Current time:", Date.now());
      console.log(
        "Time remaining:",
        data.endTime ? Math.max(0, data.endTime - Date.now()) / 1000 / 60 : 0,
        "minutes"
      );
      console.log("All focus data:", JSON.stringify(data, null, 2)); // Debug log

      if (!data.focusActive || Date.now() >= data.endTime) {
        console.log(
          "❌ Focus not active or expired - removing any existing overlay"
        );
        // Remove any existing overlay when focus is not active
        const existingOverlay = document.getElementById("focus-overlay");
        if (existingOverlay) {
          existingOverlay.remove();
          console.log(
            "🗑️ Removed existing overlay because focus is not active"
          );
        }
        return;
      }

      const hostname = window.location.hostname;
      const blockedCategories = data.blockedCategories || [];
      const customUrls = data.customUrls || [];
      const excludeSites = data.excludeSites || [];
      const whitelistMode = data.whitelistMode || false;

      console.log("🌐 Current hostname:", hostname);
      console.log("📋 Blocked categories:", blockedCategories);
      console.log("🚫 Custom URLs:", customUrls);
      console.log("✅ Exclude sites (whitelist):", excludeSites);
      console.log("🎯 Whitelist mode:", whitelistMode);

      let shouldBlock = false;
      let blockReason = "";

      // WHITELIST MODE: If exclude sites are specified, block everything except those sites
      // This mode takes priority over all other blocking rules
      if (excludeSites.length > 0) {
        console.log(
          "🔍 Whitelist mode active - checking if site is allowed..."
        );
        let isInWhitelist = false;

        for (const excludeSite of excludeSites) {
          console.log(
            `   Comparing "${hostname}" with whitelist entry "${excludeSite}"`
          );
          if (domainMatches(hostname, excludeSite)) {
            isInWhitelist = true;
            console.log("✅ Site is whitelisted:", excludeSite);
            break;
          }
        }

        if (!isInWhitelist) {
          shouldBlock = true;
          blockReason = "whitelist mode (site not in allowed list)";
          console.log(
            "🚫 BLOCKED by whitelist mode - site not in allowed list"
          );
        } else {
          console.log("✅ ALLOWED by whitelist mode");
        }
      } else {
        // NORMAL BLOCKING MODE: Use categories and custom URLs

        // Special check for YouTube entertainment content
        if (
          blockedCategories.includes("entertainment") &&
          isYouTubeEntertainment()
        ) {
          shouldBlock = true;
          blockReason = "entertainment (YouTube content)";
          console.log("Blocked YouTube entertainment content"); // Debug log
        }

        // Check custom URLs first
        if (!shouldBlock) {
          for (const url of customUrls) {
            if (domainMatches(hostname, url)) {
              shouldBlock = true;
              blockReason = "custom";
              console.log("Blocked by custom URL:", url); // Debug log
              break;
            }
          }
        }

        // Check category-based blocking
        if (!shouldBlock && blockedCategories.length > 0) {
          // First check known sites
          for (const domain in knownSites) {
            if (domainMatches(hostname, domain)) {
              const category = knownSites[domain];
              if (blockedCategories.includes(category)) {
                shouldBlock = true;
                blockReason = category;
                console.log(
                  "Blocked by known site category:",
                  category,
                  "for domain:",
                  domain
                ); // Debug log
                break;
              }
            }
          }

          // If not found in known sites, check patterns and content
          if (!shouldBlock) {
            const detectedCategory = getCategoryForDomain(hostname);
            if (
              detectedCategory &&
              blockedCategories.includes(detectedCategory)
            ) {
              shouldBlock = true;
              blockReason = detectedCategory;
              console.log(
                "Blocked by intelligent detection:",
                detectedCategory,
                "for hostname:",
                hostname
              ); // Debug log
            }
          }
        }
      }

      if (shouldBlock) {
        console.log(
          "🚨 FINAL RESULT: Showing overlay for task:",
          data.task,
          "| Block reason:",
          blockReason
        );
        injectOverlay(data.task, blockReason);
        incrementDistraction();
      } else {
        console.log("✅ FINAL RESULT: Site not blocked");
      }
      console.log("=== END DEBUG ===");
    }
  );
}

function injectOverlay(task, blockReason = "") {
  // Remove existing overlay first
  const existingOverlay = document.getElementById("focus-overlay");
  if (existingOverlay) {
    existingOverlay.remove();
  }

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      createOverlay(task, blockReason)
    );
  } else {
    createOverlay(task, blockReason);
  }
}

function createOverlay(task, blockReason = "") {
  const overlay = document.createElement("div");
  overlay.id = "focus-overlay";
  overlay.style.cssText = `
    position: fixed !important;
    top: 0 !important; 
    left: 0 !important; 
    right: 0 !important; 
    bottom: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background-color: rgba(220, 53, 69, 0.95) !important;
    color: white !important;
    font-family: Arial, sans-serif !important;
    font-size: 24px !important;
    z-index: 2147483647 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;
    padding: 20px !important;
    box-sizing: border-box !important;
    margin: 0 !important;
    border: none !important;
  `;

  const reasonText = blockReason
    ? `<p style="font-size: 14px; opacity: 0.8; margin-top: 10px;">Blocked reason: ${blockReason}</p>`
    : "";

  overlay.innerHTML = `
    <div style="max-width: 600px; padding: 40px; background-color: rgba(255, 255, 255, 0.1); border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
      <h2 style="margin-bottom: 20px; font-size: 32px; color: white; font-weight: bold;">🔴 Focus Mode Active</h2>
      <p style="margin-bottom: 15px; font-size: 20px; color: white;">You're in focus mode and should focus on the task!</p>
      <p style="margin-bottom: 20px; font-size: 18px; font-style: italic; color: #ffeb3b;">Current task: "${
        task || "Your focus task"
      }"</p>
      ${reasonText}
      <p style="font-size: 16px; opacity: 0.9; color: white; margin-bottom: 20px;">Close this tab and get back to work! 💪</p>
      <button id="close-overlay" style="margin-top: 20px; padding: 10px 20px; background-color: white; color: #dc3545; border: none; border-radius: 5px; font-size: 14px; cursor: pointer; font-weight: bold;">Got it!</button>
    </div>
  `;

  // Try to append to body, if not available, try html or document
  if (document.body) {
    document.body.appendChild(overlay);
  } else if (document.documentElement) {
    document.documentElement.appendChild(overlay);
  } else {
    document.appendChild(overlay);
  }

  console.log("Overlay injected successfully"); // Debug log

  // Add click to close functionality
  overlay.addEventListener("click", () => {
    overlay.remove();
  });

  // Add button click handler
  const closeButton = overlay.querySelector("#close-overlay");
  if (closeButton) {
    closeButton.addEventListener("click", (e) => {
      e.stopPropagation();
      overlay.remove();
    });
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "REMOVE_OVERLAY") {
    const existingOverlay = document.getElementById("focus-overlay");
    if (existingOverlay) {
      existingOverlay.remove();
      console.log("Focus overlay removed via message");
    }
    sendResponse({ success: true });
  }
});

function incrementDistraction() {
  chrome.storage.local.get("distractions", (data) => {
    let count = data.distractions || 0;
    chrome.storage.local.set({ distractions: count + 1 });
    console.log("Distraction count incremented to:", count + 1); // Debug log
  });
}

// Function to initialize checking
function initializeBlocking() {
  // Prevent duplicate initialization
  if (window.focusModeInitialized) {
    console.log("Focus mode already initialized, checking if blocked");
    checkIfBlocked();
    return;
  }

  console.log("Initializing focus mode blocking on:", window.location.hostname);
  window.focusModeInitialized = true;
  checkIfBlocked();
}

// Check immediately when script loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeBlocking);
} else {
  initializeBlocking();
}

// Also check when the page becomes visible (in case user switches tabs back)
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    console.log("Page became visible, checking if blocked"); // Debug log
    checkIfBlocked();
  }
});

// Check when page fully loads
window.addEventListener("load", () => {
  console.log("Page fully loaded, checking if blocked"); // Debug log
  checkIfBlocked();
});

// Listen for navigation changes (for SPAs)
let currentUrl = location.href;
setInterval(() => {
  if (location.href !== currentUrl) {
    currentUrl = location.href;
    console.log("URL changed, checking if blocked"); // Debug log
    setTimeout(checkIfBlocked, 100); // Small delay for SPA navigation
  }
}, 1000);
