# FocusedMind - Privacy & Transparency

## 🔒 Your Privacy Matters

FocusedMind is designed with privacy as a core principle. Here's exactly what the extension does with your data:

### What We Access

**Website URLs Only**: FocusedMind reads the URLs of websites you visit to determine if they should be blocked during focus sessions.

### Why We Need URL Access

✅ **Block distracting sites** - Check if current website matches your blocked categories  
✅ **Apply custom rules** - Block specific URLs you've added to your custom list  
✅ **Whitelist mode** - Allow only specific sites when in whitelist mode  
✅ **Track effectiveness** - Count distractions to show session efficiency

### What We DON'T Do

❌ **No data collection** - We don't collect, store, or transmit personal data  
❌ **No browsing history** - We don't track or remember what sites you visit  
❌ **No external servers** - All data stays on your device  
❌ **No analytics** - No usage tracking or behavioral analysis  
❌ **No third parties** - No data sharing with any external services

### Data Storage

- **100% Local**: All preferences, session data, and settings are stored locally using Chrome's storage API
- **No Cloud Sync**: Your data never leaves your device
- **Easy Removal**: Uninstalling the extension removes all data

### Permissions Explained

| Permission         | Purpose                | What It Allows                                            |
| ------------------ | ---------------------- | --------------------------------------------------------- |
| `storage`          | Save your settings     | Store focus sessions, preferences, custom URLs locally    |
| `activeTab`        | Check current website  | Read URL of active tab to apply blocking rules            |
| `host_permissions` | Block across all sites | Run content script on websites for blocking functionality |

### Open Source Transparency

FocusedMind is open source - you can review the code to see exactly how it works:

- View the source code on GitHub
- Verify that no data is transmitted externally
- Confirm that URL checking happens locally only

### Your Control

- **Instant Removal**: Uninstall anytime to remove all data
- **Clear Settings**: Reset extension to default state
- **Custom Rules**: You control exactly what gets blocked
- **No Account**: No sign-up or registration required

### First-Time Notice

When you first install FocusedMind, you'll see a privacy notice explaining why URL access is needed. This ensures you're fully informed before using the extension.

---

**Questions?** FocusedMind is committed to transparency. If you have privacy questions, you can review our open source code or reach out through the Chrome Web Store.
