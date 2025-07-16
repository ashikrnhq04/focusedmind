# Changelog - FocusedMind Extension

## Version 1.4.3 (Latest)

### 🔒 Privacy & Transparency Improvements

- **Privacy Notice**: Added first-time privacy notice explaining URL access requirement
- **Enhanced Description**: Updated manifest description to clearly state URL reading requirement
- **Privacy Policy**: Added comprehensive privacy policy documentation
- **User Control**: Added "Learn More" option for detailed privacy information
- **Fixed Privacy Modal Icons**: Replaced broken Unicode characters with HTML entities

### 🐛 Bug Fixes

- **Privacy Modal Icons**: Fixed broken icons in "Learn More" popup by using HTML entities
- **Improved Privacy UX**: Replaced basic alert with proper modal dialog for privacy details

### 🆕 New Features

- **Enhanced Task Display**: Active session now shows task name with session duration
  - Format: "Focusing on: [Task Name] ([Duration] mins session)"
  - Example: "Focusing on: Reading docs (20 mins session)"

## Version 1.0.2

### 🆕 New Features

- Added completion view with session statistics
- Implemented contextual motivational messages
- Added incognito mode support
- Implemented whitelist mode with UI logic
- **Enhanced Task Display**: Active session now shows task name with session duration
  - Format: "Focusing on: [Task Name] ([Duration] mins session)"
  - Example: "Focusing on: Reading docs (20 mins session)"

### 🔒 Security Improvements

- Reduced permissions for Enhanced Safe Browsing compliance
- Removed `tabs` and `scripting` permissions
- Limited host permissions to `http://*/*` and `https://*/*`
- Eliminated dynamic script injection for improved security
- Uses storage events for communication instead of direct tab manipulation

### 🐛 Bug Fixes

- Fixed automatic session completion not showing completion view
- Fixed distraction count incrementing on network requests
- Added iframe protection to prevent duplicate blocking checks
- Improved session expiry handling

### 🔧 Technical Changes

- Updated manifest.json for better security compliance
- Refactored background script to use minimal permissions
- Added storage change listeners for secure communication
- Improved content script isolation and performance

## Version 1.0.1

### 🆕 Initial Features

- Website blocking by categories (Entertainment, Social Media, News, Adult Content)
- Custom URL blocking
- Focus session tracking with countdown timer
- Distraction counting
- Motivational overlay messages
- Chrome extension popup interface
