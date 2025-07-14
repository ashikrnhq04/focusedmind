# Privacy Policy - FocusedMind Extension

## Data Access and Usage

### What Data We Access

**Website URLs**: FocusedMind reads the URLs of websites you visit to determine if they should be blocked during focus sessions.

**Why We Need This**:

- ✅ Block distracting websites based on your selected categories
- ✅ Apply custom URL blocking rules you've set
- ✅ Implement whitelist mode for allowed sites only
- ✅ Track focus session effectiveness

### What We DON'T Do

❌ **We don't collect personal data** - No names, emails, or personal information
❌ **We don't send data to servers** - Everything stays on your device
❌ **We don't track your browsing history** - We only check if current site should be blocked
❌ **We don't share data** - No third-party access to your information

### Data Storage

- **Local Only**: All data is stored locally in your browser using Chrome's storage API
- **No Cloud Sync**: Your focus sessions, custom URLs, and preferences stay on your device
- **No Analytics**: We don't collect usage statistics or behavioral data

### Permissions Explained

| Permission         | Why We Need It                              | What It Does                                                   |
| ------------------ | ------------------------------------------- | -------------------------------------------------------------- |
| `storage`          | Save your preferences and session data      | Stores focus sessions, custom URLs, blocked categories locally |
| `activeTab`        | Check current website during focus sessions | Determines if the active tab should be blocked                 |
| `host_permissions` | Block websites across all domains           | Allows content script to run on websites for blocking          |

### Your Control

- **Uninstall anytime** - Removes all stored data
- **Clear data** - Reset extension to remove all preferences
- **Customize blocking** - Choose exactly which categories/sites to block

### Contact

Questions about privacy? The extension is open source - you can review the code to see exactly how your data is handled.

**Last Updated**: July 2025
