# WhichEmail

WhichEmail helps you track which email address you used to sign up for websites and apps. Stop the "forgot password" cycle!

## Overview
Have you ever tried to log in and wondered: “Did I use my work email or my personal one?” WhichEmail lets you quickly record and search the email you used for each service so you never guess again.

## Features
- Track which email you used for each website/app
- Quick search across saved services
- Clean, modern UI built with NativeWind (Tailwind CSS for React Native)
- Secure by design: planned support for optional password storage with biometrics

## Tech Stack
- Expo + React Native
- Expo Router (file-based navigation)
- NativeWind (Tailwind CSS)
- React Query
- AsyncStorage (with Appwrite planned for auth and sync)

## Getting Started
1. Install dependencies
   ```bash
   npm install
   ```
2. Start the app (choose device/simulator or Expo Go)
   ```bash
   npx expo start
   ```

The entry uses Expo Router. Initial navigation shows a Welcome screen on first launch, then routes to Auth or Tabs (Services/Settings).

## Project Structure
- `app/` — screens and routes (Expo Router)
  - `welcome.tsx` — onboarding screen
  - `(auth)/` — authentication routes (login/register)
  - `(tabs)/` — main app tabs (services, settings)
- `components/` — shared UI components
- `assets/` — images and icons

## Development Notes
- Tailwind/NativeWind is configured via `tailwind.config.js` and `babel.config.js`.
- Web builds import `app/globals.css` for Tailwind utilities.
- If styles don’t show after changes, clear cache: `npx expo start -c`.

## Roadmap
- Appwrite integration for auth and cloud sync
- Biometric protection for sensitive fields
- Service import/export

## License
MIT
