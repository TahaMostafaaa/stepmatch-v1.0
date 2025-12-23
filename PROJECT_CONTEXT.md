# Ditto - React Native Expo Dating App Template

## Project Overview
- **Name:** Ditto - React Native Expo Dating Mobile App Template
- **Version:** 1.0.0
- **Framework:** React Native with Expo
- **Language:** TypeScript
- **Last Updated:** November 11, 2025

## Project Structure

```
package/
├── app/
│   ├── assets/          # Images, fonts, and other resources
│   ├── components/      # Reusable UI components
│   ├── constants/       # Theme, colors, fonts, icons, images
│   ├── layout/          # Header and sidebar layouts
│   ├── Navigations/     # Navigation configuration
│   ├── pages/           # Screen components (Auth, Chats, Explore, Profile, etc.)
│   └── Screens/         # Additional screen components
├── assets/              # App icons and splash screens
├── app.json             # Expo configuration
├── App.tsx              # Main app entry point
└── package.json         # Dependencies
```

## Key Files & Locations

### Theme & Styling
- **Theme Configuration:** `./package/app/constants/theme.tsx`
  - Contains: COLORS, SIZES, FONTS, ICONS, IMAGES
  - Color palette: Primary, Primary Light, Secondary, Success, Danger, Warning, Info, Text, Title, Dark
  - Dynamic theme switching via `themeContext`

### Navigation
- **Main Navigation:** `./package/app/Navigations/Routes.tsx`
- **Stack Navigator:** `./package/app/Navigations/StackNavigator.tsx`
- **Bottom Navigation:** `./package/app/Navigations/BottomNavigation.tsx`
- **App Entry:** `./package/App.tsx`

### Configuration
- **Expo Config:** `./package/app.json`
  - App name: `"name": "Ditto"`
  - Android package: `"package": "com.deepeshgour.ditto"`
  - Icons location: `./package/assets/`

## Customization Guidelines

### 1. Changing Colors
**Location:** `./package/app/constants/theme.tsx`
- Modify the `COLORS` object
- Colors automatically apply throughout the app via theme context

### 2. Adding Fonts
**Steps:**
1. Add `.ttf` files to `./package/app/assets/fonts/`
2. Run: `npx react-native-asset`
3. Update font references in:
   - `./package/App.tsx` (useFonts hook)
   - `./package/app/constants/theme.tsx` (FONTS object)

**Current Fonts:**
- Nunito (Regular, Bold, SemiBold, Medium, BoldItalic)
- OleoScript-Bold

### 3. Changing App Name & Icon
**App Name:**
- Edit `./package/app.json` → change `"name": "Ditto"`

**App Icon:**
- Replace files in `./package/assets/`:
  - `icon.png` (1024x1024px)
  - `adaptive-icon.png`
  - `splash-icon.png`

### 4. Adding New Screens
**Steps:**
1. Create screen component in `./package/app/pages/[ScreenName]/`
2. Register in `./package/app/Navigations/StackNavigator.tsx`
3. Add route to appropriate navigation type (Stack/Bottom/Drawer)

### 5. Package Name (Android)
**Location:** `./package/app.json`
- Change `"package": "com.deepeshgour.ditto"` to your package name

## Installation & Setup

### Android
1. Install Node.js
2. `cd ./package` → `npm install`
3. `npx expo start -c`
4. Press "a" to open Android emulator

### iOS
1. Install Node.js
2. `cd ./package` → `npm install`
3. `npx expo start`
4. Press "i" to open iOS simulator

## Component Structure

### Common Components (`./package/app/components/`)
- **Buttons:** Button, ButtonLg, ButtonSm, ButtonOutline, ButtonLight
- **Inputs:** CustomInput
- **Action Sheets:** LoginSheet, RegisterSheet, NotifySelectorSheet, SuccessSheet
- **Modals:** Various modal components
- **Charts:** BarChart, LineChart, PieChart
- **Other:** Tabs, Toggles, Accordions, Tables, etc.

### Pages/Screens (`./package/app/pages/`)
- Auth (Login/Register)
- Chats
- Explore
- Home
- Profile
- Likes
- Notifications
- Settings
- Subscription
- Splash

## Technical Stack

- **React Native:** 0.81.5
- **Expo:** ~54.0.23
- **React Navigation:** 7.x
- **TypeScript:** ~5.9.2
- **React:** 19.1.0
- **React Native Paper:** ^5.14.5 (Material Design)

## Key Dependencies

- `@react-navigation/native` - Navigation
- `expo-font` - Font loading
- `expo-camera` - Camera functionality
- `expo-location` - Location services
- `expo-notifications` - Push notifications
- `react-native-paper` - UI components
- `react-native-reanimated` - Animations

## Development Workflow

1. **Theme Changes:** Modify `./package/app/constants/theme.tsx`
2. **Navigation Changes:** Update files in `./package/app/Navigations/`
3. **New Screens:** Add to `./package/app/pages/` and register in navigation
4. **Components:** Reusable components in `./package/app/components/`
5. **Assets:** Images in `./package/app/assets/images/`, fonts in `./package/app/assets/fonts/`

## Important Notes

- After adding fonts, always run `npx react-native-asset`
- Theme changes are dynamic via `themeContext`
- Navigation structure is defined in `StackNavigator.tsx`
- All screens should be registered in navigation files
- App configuration is centralized in `app.json`

## File Path Reference

### Constants
- Theme: `./package/app/constants/theme.tsx`
- Theme Context: `./package/app/constants/themeContext.tsx`
- StyleSheet: `./package/app/constants/StyleSheet.tsx`

### Navigation Files
- Routes: `./package/app/Navigations/Routes.tsx`
- Stack Navigator: `./package/app/Navigations/StackNavigator.tsx`
- Bottom Navigation: `./package/app/Navigations/BottomNavigation.tsx`
- Drawer Navigation: `./package/app/Navigations/DrawerNavigation.tsx`
- Custom Navigation: `./package/app/Navigations/CustomNavigation.tsx`
- Type Definitions: `./package/app/Navigations/RootStackParamList.tsx`, `BottomTabParamList.tsx`, `DrawerParamList.tsx`

### Main Entry Points
- App Entry: `./package/App.tsx`
- Index: `./package/index.ts`
- Expo Config: `./package/app.json`

### Asset Locations
- Images: `./package/app/assets/images/`
- Fonts: `./package/app/assets/fonts/`
- App Icons: `./package/assets/`



