# CalorAI — Taste Profile Assignment

A **React Native / Expo** mobile app that lets users build a food preference profile by swiping through food cards — right to like, left to dislike, up to superlike, down if unsure. After swiping through all foods, the app generates a personalised Taste Profile with detected personas and lifestyle traits.

---

## 📱 Try the App — Live on Expo Go

> **Requires [Expo Go](https://expo.dev/client) installed on your device.**
>
> This project uses **EAS Update** — the JS bundle is hosted on Expo's CDN and loads directly inside Expo Go without any build step.

### How to open

**Option 1 — Deep link (tap on your device)**

```
exp://u.expo.dev/a925ee3c-804f-43f1-808b-da64ec46bda2/group/9d76efc9-c45a-4a8f-a3bb-f77529abe508
```

**Option 2 — Scan this QR code with Expo Go**

![Scan with Expo Go](./assets/qr.png)

> Scan with the **Expo Go** app (Android) or the **Camera app** (iOS)

| Field | Value |
|---|---|
| **Expo project** | `@shivankgupta/calorai` |
| **Branch** | `main` (always latest) |
| **Runtime version** | `exposdk:54.0.0` |
| **Latest update group** | `9d76efc9-c45a-4a8f-a3bb-f77529abe508` |
| **EAS Dashboard** | [View on expo.dev](https://expo.dev/accounts/shivankgupta/projects/calorai/updates/9d76efc9-c45a-4a8f-a3bb-f77529abe508) |
| **Platform** | iOS + Android |

> ✅ Uses `runtimeVersion: { policy: "sdkVersion" }` — fully compatible with Expo Go out of the box. Just scan and go.

---

## Screens

| Screen | Description |
|---|---|
| **Intro** | Landing screen with a glassmorphism card, CTA to start swiping, and a bottom nav |
| **Swipe** | Tinder-style card stack with 4-directional swipe gestures + action buttons with haptic feedback |
| **Results** | Taste Profile breakdown — personas, lifestyle traits, food categories as a swipeable carousel |
| **FAQ** | Dummy FAQ screen accessible from the bottom nav |

---

## Setup & Installation

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Expo Go](https://expo.dev/client) installed on your physical device (iOS or Android)
- Or an iOS Simulator / Android Emulator

### Steps

```bash
# 1. Clone the repo
git clone <repo-url>
cd caloraiassignment

# 2. Install dependencies
npm install

# 3. Start the dev server
npx expo start
```

4. Scan the QR code with **Expo Go** (Android) or the **Camera app** (iOS)

> **Note:** This project targets **Expo SDK 54** for compatibility with the current Expo Go version. If you see a version mismatch warning, make sure your Expo Go app is up-to-date.

---

## Libraries Used & Why

| Library | Version | Why |
|---|---|---|
| `expo` | ~54.0.35 | Base SDK — provides a managed workflow and compatibility with Expo Go |
| `react-navigation/native` + `native-stack` | ^7.x | Stack-based navigation between Intro → Swipe → Results → FAQ. Native stack used for zero-overhead transitions |
| `expo-linear-gradient` | ~15.0.8 | Core to the glassmorphism design — used to render gradient borders (shimmer effect) and dark card fills since `BlurView` is unreliable cross-platform in Expo Go |
| `expo-blur` | ~15.0.8 | Imported but intentionally kept as a fallback reference; replaced by `LinearGradient` for consistent cross-platform rendering |
| `expo-haptics` | ~15.0.8 | Provides tactile feedback on swipe — Medium for like/superlike, Light for dislike/unsure |
| `react-native-svg` | 15.12.1 | Renders custom SVG icons (home, heart, star, cross, question, carrot, search) as proper vector assets |
| `react-native-svg-transformer` | ^1.5.3 | Enables importing `.svg` files directly as React components in Metro |
| `react-native-gesture-handler` | ~2.28.0 | Required peer dependency for React Navigation; provides the gesture context |
| `react-native-reanimated` | ~3.16.7 | Installed as a peer dependency for navigation animations. Note: pinned to 3.16.7 (not 4.x) to remain compatible with Expo SDK 54 / Expo Go |
| `react-native-safe-area-context` | ~5.6.0 | Handles notches and home indicator insets consistently on iOS and Android |
| `react-native-screens` | ~4.16.0 | Enables native screen components for better performance with React Navigation |
| `TypeScript` | ~5.9.2 | Full type safety across props, navigation params, food data, and swipe results |

---

## Architecture

```
caloraiassignment/
├── App.tsx                  # Root: NavigationContainer + SafeAreaProvider + 4 stack screens
├── Food.json                # Static food data (30 items with id, name, category, tags)
├── assets/icons/            # SVG icon files (heart, star, cross, question, home, carrot, search)
├── src/
│   ├── constants.ts         # Design tokens — Colors, Typography, Spacing, Radius, Glass, Swipe
│   ├── types.ts             # TypeScript interfaces — Food, SwipeResult, TasteProfile, nav params
│   ├── data.ts              # Loads Food.json, exports emoji map, getCardText(), globalResults[]
│   ├── screens/
│   │   ├── IntroScreen.tsx
│   │   ├── SwipeScreen.tsx
│   │   ├── ResultsScreen.tsx
│   │   └── FAQScreen.tsx
│   └── components/
│       ├── GlassCard.tsx    # Reusable glassmorphism card (gradient border + dark fill)
│       ├── FoodCard.tsx     # Swipeable card — PanResponder, 4-direction, animated badges
│       ├── CardStack.tsx    # Renders top 3 cards as a visual stack
│       ├── ActionButton.tsx # Circular button with SVG icon + optional gradient bg
│       ├── BottomNav.tsx    # Pill-shaped glass nav bar + separate search button
│       ├── ProgressBar.tsx  # Animated progress indicator across the swipe session
│       └── BackgroundBlobs.tsx  # SVG radial gradient blobs for ambient depth
```

---

## Glassmorphism Implementation

React Native does not support `backdrop-filter` (CSS blur-behind), and `expo-blur`'s `BlurView` behaves differently on iOS vs Android in Expo Go — on Android it often shows as a plain dark rectangle.

**Solution used:** A pure `LinearGradient` approach that works identically on both platforms:

1. **Outer gradient** — `rgba(255,255,255,0.5) → transparent → transparent → rgba(255,255,255,0.5)` at 1px padding creates a shimmering glass border
2. **Inner fill** — A dark `#18181A → #0A0A0A` gradient gives the deep glass-like surface
3. **Shadow** — `shadowColor: '#000'`, `elevation: 12` adds the floating-card depth

This pattern is applied consistently to `GlassCard`, `FoodCard`, `BottomNav`, and all back-buttons.

---

## Platform Differences — iOS vs Android

| Area | iOS | Android |
|---|---|---|
| **Typography** | `fontFamily: 'System'` (SF Pro) | `fontFamily: 'Roboto'` |
| **BlurView** | Works natively with hardware blur | Replaced by `LinearGradient` (BlurView falls back to a solid overlay in Expo Go) |
| **Shadows** | `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius` | `elevation` (Android uses a single elevation value) |
| **Safe Area** | Notch + dynamic island insets handled via `react-native-safe-area-context` | Notch + status bar insets handled the same way |
| **Haptics** | Full `ImpactFeedbackStyle` support | Works on most modern Android devices; gracefully no-ops on unsupported hardware |
| **Font sizes** | `adjustsFontSizeToFit` used on heading labels to prevent overflow | Same prop respected; Android clips differently so `numberOfLines={1}` added as guard |

The `Platform.select()` call in `constants.ts` centralises all platform branching for typography, so no per-screen `Platform.OS` checks are needed for fonts.

---

## Assumptions & Trade-offs

| Decision | Reasoning |
|---|---|
| **No `BlurView` on cards** | `expo-blur` works on iOS but renders as a solid dark box on Android in Expo Go. Using `LinearGradient` instead achieves a near-identical visual with 100% cross-platform reliability |
| **`globalResults` mutable array** | Rather than threading swipe results through navigation params at every step, a module-level array stores the completed profile so ResultsScreen can access it without re-navigation |
| **`PanResponder` instead of Gesture Handler** | `react-native-gesture-handler` requires a `GestureHandlerRootView` wrapper and had conflict issues on certain Expo Go versions. `PanResponder` (built into React Native) solved the gesture detection reliably |
| **Expo SDK 54 (pinned)** | Expo SDK 55+ requires a newer Expo Go version not widely available. Pinned to 54 to ensure the QR-scan workflow works immediately without any build steps |
| **Static food data via JSON** | No backend is needed for a taste profile prototype. `Food.json` loads at bundle time with zero network latency |
| **`forwardRef` on FoodCard** | The action buttons (Cross, Heart, Star, Question) need to programmatically trigger a swipe on the top card. `forwardRef` + `useImperativeHandle` exposes a `triggerSwipe()` method cleanly without lifting state |
| **Dynamic card height in ResultsScreen** | The swipeable food category carousel uses `onLayout` to measure each slide's true height, then `scrollX.interpolate()` to animate the container height as you swipe — avoids both a fixed min-height and jarring layout jumps |

---

## Time Breakdown

| Phase | Time | Notes |
|---|---|---|
| Project setup, Expo config, TypeScript, SVG pipeline | ~30 min | Created project, set up metro.config.js for SVG, installed all deps, downgraded to SDK 54 |
| Food data + type definitions | ~20 min | Designed `Food.json` schema, wrote TypeScript interfaces, emoji map |
| Swipe card — PanResponder, animations, badges | ~60 min | Gesture detection, 4-direction flyOff, Animated interpolations for badges; switched from Gesture Handler to PanResponder after z-index / conflict issues |
| Glassmorphism design system | ~40 min | Designed `GlassCard`, gradient border pattern, `constants.ts` design tokens |
| Bottom Nav + SVG icons | ~30 min | Pill nav, search button, icon imports, active state, platform font fallback |
| Action buttons + progress bar | ~25 min | Gradient button variants, SVG icon colouring, animated progress fill |
| Background blobs | ~15 min | SVG radial gradient ambient blobs |
| Intro screen | ~20 min | Glassmorphism CTA card, back button pattern |
| Results screen | ~60 min | Personas algorithm, lifestyle traits, swipeable carousel with dynamic height, lifestyle card |
| FAQ screen | ~15 min | Consistent layout with Intro, bottom nav |
| Debugging & polish | ~45 min | Card z-index stacking, last card edge case, results navigation timing, font size overflow, Android elevation |
| **Total** | **~6 hrs** | |

---

## AI Tool Usage

| Tool | How it helped |
|---|---|
| **Antigravity (Google DeepMind IDE assistant)** | Primary development tool throughout. Used for: scaffolding component structure, writing `PanResponder` gesture logic, designing the `LinearGradient` glassmorphism pattern as a `BlurView` cross-platform replacement, the `scrollX.interpolate()` dynamic height technique on the carousel, the `forwardRef`/`useImperativeHandle` pattern for programmatic card swipes, and debugging z-index stacking issues with the card stack |
| **Cursor / Copilot (minor)** | Used occasionally for boilerplate — `StyleSheet.create` blocks, TypeScript interface stubs |

AI assistance was particularly valuable for:
- **Cross-platform blur workaround** — quickly exploring why `BlurView` breaks on Android in Expo Go and identifying the `LinearGradient` border pattern as a reliable substitute
- **Dynamic height interpolation** — the `onLayout` + `scrollX.interpolate` approach for the carousel height was an AI suggestion that saved significant debugging time
- **Gesture debugging** — diagnosing why `react-native-gesture-handler` caused `onStartShouldSetPanResponder` to never fire and switching to native `PanResponder`

All code was reviewed, understood, and manually adjusted to fit the project's design system.

---

