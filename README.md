# ISAACIFY CRM Manager (Mobile)

Native mobile application for **ISAACIFY CRM Manager** built with Expo, React Native, TypeScript, and Expo Router.

> *"Your projects. Your clients. One place."*

---

## 📱 Features Implemented

- **Splash Screen**:
  - Recreated approved splash design faithfully matching the official reference (`412 × 917` base).
  - Native light theme (`#FAF9FD`) with subtle, broad lavender glow behind central branding.
  - Custom vector isometric 3D cube logo component (`IsaacifyLogo`) rendered via `react-native-svg` with shaded purple faces and white vertex dot.
  - Bundled **DM Sans** fonts (Bold for title, Medium for subtitle, Regular for tagline).
  - Animated pulsing loading dots (`LoadingDots`) with staggered opacity loops and clean teardown.
  - Coordinated native OS splash dismissal via `expo-splash-screen`.

---

## 📁 Project Structure

```
ISAACIFY-Mobile/
├── app.json                  # Expo application configuration & plugins
├── package.json              # Dependencies and start scripts
├── tsconfig.json             # TypeScript config with @/* path alias
├── design-references/        # Design screenshots and assets
│   └── splash-reference.png  # Source of truth for Splash screen
├── assets/
│   ├── fonts/                # Bundled DM Sans font files
│   ├── images/
│   └── icons/
├── src/
│   ├── app/                  # Expo Router file-based routes
│   │   ├── _layout.tsx       # Root layout, font loading & splash handling
│   │   └── index.tsx         # Initial route rendering SplashScreen
│   ├── features/
│   │   ├── auth/
│   │   │   └── screens/
│   │   │       └── SplashScreen.tsx  # Native Splash screen implementation
│   │   ├── clients/
│   │   ├── projects/
│   │   ├── messages/
│   │   ├── invoices/
│   │   ├── payments/
│   │   └── settings/
│   ├── components/
│   │   ├── branding/
│   │   │   └── IsaacifyLogo.tsx      # SVG 3D geometric purple cube
│   │   └── ui/
│   │       └── LoadingDots.tsx       # Animated 3-dot loading indicator
│   ├── theme/
│   │   ├── colors.ts         # Color palette tokens
│   │   ├── typography.ts     # DM Sans font tokens and sizes
│   │   └── spacing.ts        # Layout spacing and offsets
│   ├── services/
│   ├── hooks/
│   ├── types/
│   └── utils/
└── docs/                     # Project documentation
```

---

## 🛠️ Prerequisites

1. **Node.js**: v18 or later (tested on v24.19.0).
2. **npm**: v9 or later (tested on v11.17.0).
3. **Android Studio & SDK** (for Android Emulator):
   - Set environment variable `ANDROID_HOME` to `%LOCALAPPDATA%\Android\Sdk`.
   - Add `%LOCALAPPDATA%\Android\Sdk\platform-tools` and `%LOCALAPPDATA%\Android\Sdk\emulator` to your `PATH`.
   - Create an Android Virtual Device (AVD), such as `Pixel_8`.
4. **Expo Go** (optional, for physical Android/iOS devices):
   - Install from Google Play Store or Apple App Store.

---

## 🚀 Installation & Setup

1. Clone or open the repository:
   ```bash
   cd "e:\Web Dev\ISAACIFY-Mobile"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## 📲 Running and Previewing

### 1. Start the Expo Development Server
```bash
npx expo start
```
*(On Windows PowerShell, use `npx.cmd expo start` if script execution is restricted).*

### 2. Launch on Android Emulator
Make sure an AVD (e.g. `Pixel_8`) is available or already running:
```bash
# Start emulator manually if needed:
%LOCALAPPDATA%\Android\Sdk\emulator\emulator.exe -avd Pixel_8

# In your project terminal:
npx expo start --android
```
Or press `a` in the Expo interactive terminal.

### 3. Preview on Physical Device with Expo Go
1. Start the server with LAN or tunnel:
   ```bash
   npx expo start
   ```
2. Scan the displayed QR code using the Expo Go app on your Android device (or Camera on iOS).

---

## 💻 Opening in Antigravity or VS Code

- **Google Antigravity**:
  Open folder: `File -> Open Folder -> e:\Web Dev\ISAACIFY-Mobile`.
  All path aliases (`@/*`) and Expo configurations are pre-indexed.
- **VS Code**:
  Open the project directly:
  ```bash
  code .
  ```
  Recommended extensions:
  - *Expo Tools*
  - *ESLint*
  - *Prettier - Code formatter*

---

## 🔄 Next Steps

- Connect authentication and onboarding flow routes when the next screen is implemented.
- The three loading dots currently provide a faithful visual preview of the startup design.
