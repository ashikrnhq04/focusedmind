# HTML Entity Icons Reference

This document lists all the HTML entity icons used in the FocusedMind extension for consistency and reference.

## Icons Used in the Extension

### Main UI Icons

- **📝 Note/Memo** - `&#128221;` - Used in whitelist notice
- **🎯 Target** - `&#127919;` - Used for "Excellent" efficiency rating
- **👍 Thumbs Up** - `&#128077;` - Used for "Good" efficiency rating
- **⚡ Lightning** - `&#9889;` - Used for "Fair" efficiency rating
- **⚠️ Warning** - `&#9888;` - Used for "Poor" efficiency rating
- **🚨 Rotating Light** - `&#128680;` - Used for "Critical" efficiency rating
- **🚀 Rocket** - `&#128640;` - Used for "Starting Strong" message
- **🎉 Party** - `&#127881;` - Used for session completion message

### Overlay Icons

- **🔴 Red Circle** - `&#128308;` - Used in Focus Mode Active overlay
- **💪 Muscle** - `&#128170;` - Used in "get back to work" message

## Usage Guidelines

1. **Consistency**: Always use HTML entities instead of Unicode emojis
2. **Fallback**: HTML entities provide better cross-platform compatibility
3. **Accessibility**: HTML entities are more accessible for screen readers
4. **Extension Compatibility**: Works better in Chrome extension context

## Why HTML Entities?

- **Compatibility**: Works across all browsers and operating systems
- **Reliability**: Not dependent on system emoji support
- **Consistency**: Ensures uniform appearance across different platforms
- **Performance**: Loads faster than icon libraries or image files

## Adding New Icons

When adding new icons to the extension:

1. Use https://www.toptal.com/designers/htmlarrows/symbols/ to find HTML entity codes
2. Test the icon in the extension context
3. Update this reference document
4. Use descriptive comments in code: `&#128170; // 💪 muscle icon`
