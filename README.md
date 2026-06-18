<div align="center">

# QuizMe 🧠

**AI-powered trivia. Any topic. Any time.**

[![Built with Expo](https://img.shields.io/badge/Built_with-Expo_55-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-0.83.6-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Language: TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![AI: Groq API](https://img.shields.io/badge/AI-Groq_API-F55036?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

## About

QuizMe is an intelligent mobile trivia application that generates endless, highly-specific quizzes on the fly using the **Groq API** with the **Llama 3.1 8B Instant** model. Users can pick from 8 preset topic categories — or type in any custom topic — and instantly receive a bespoke 5-question quiz tailored to their chosen difficulty level.

From a technical perspective, QuizMe showcases a seamless integration of large language models within a **React Native (Expo 55)** environment, featuring strict JSON schema enforcement for reliable AI responses, a custom `useReducer`-based state machine, smooth **Reanimated 4** animations, and a fully custom dark-mode UI rich with glow effects and micro-animations. Groq's ultra-low latency inference ensures questions are generated almost instantly.

---

## Features

- 🎯 **AI-generated questions on any topic** — powered by Groq API (Llama 3.1 8B Instant)
- ✏️ **Custom topic input** — type literally anything beyond the presets
- 🌓 **Easy / Medium / Hard difficulty modes**
- 💡 **Interesting facts revealed after each answer**
- 📊 **Detailed score breakdown and full answer review on the Results screen**
- ⚡ **File-based navigation** via Expo Router
- 🎨 **Fully custom dark UI** with glow effects, animated progress bar, and Reanimated transitions
- 📱 **Runs on iOS, Android, and Web**

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Mobile Framework** | Expo | ^55.0.24 |
| **Core Library** | React Native | 0.83.6 |
| **Language** | TypeScript | ~5.9.2 |
| **Navigation** | Expo Router | ~55.0.14 |
| **Animations** | React Native Reanimated | 4.2.1 |
| **AI Backend** | Groq API (`llama-3.1-8b-instant`) | — |
| **State Management** | React Hooks (`useReducer`) | — |
| **Styling** | React Native StyleSheet (Custom Dark Theme) | — |

---

## Project Structure

```text
QuizMe/
├── app/
│   ├── _layout.tsx        # Root Expo Router layout
│   ├── index.tsx          # Entry point redirect
│   ├── home.tsx           # Home screen (topic & difficulty selection)
│   ├── quiz.tsx           # Quiz screen (question + answer flow)
│   └── results.tsx        # Results screen (score + answer review)
│
├── components/
│   ├── FactCard.tsx        # Animated fact reveal card
│   ├── OptionButton.tsx    # Answer option button with correct/wrong states
│   ├── ProgressBar.tsx     # Animated question progress indicator
│   ├── ScoreCard.tsx       # Individual answer review card
│   └── TopicChip.tsx       # Tappable preset topic chip
│
├── constants/
│   ├── colors.ts           # Global dark-theme color palette
│   ├── difficulties.ts     # Difficulty level definitions (Easy/Medium/Hard)
│   └── topics.ts           # Preset topic list with emoji icons
│
├── hooks/
│   └── useQuiz.ts          # Core quiz state machine (useReducer)
│
├── services/
│   └── aiApi.ts            # Anthropic Claude API integration & prompt engineering
│
└── types/
    └── quiz.ts             # Shared TypeScript interfaces and type definitions
```

---

## Preset Topics

| Topic | Icon |
|---|---|
| Science | 🔬 |
| History | 🏛️ |
| Geography | 🌍 |
| Technology | 💻 |
| Sports | ⚽ |
| Art & Music | 🎨 |
| Movies & TV | 🎬 |
| Literature | 📚 |

> **Custom topics are fully supported** — type anything on the Home screen to quiz yourself on it.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)
- [Expo Go](https://expo.dev/go) app on your iOS or Android device
- A [Groq API key](https://console.groq.com/) (free tier available)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Ezra-creator/QuizMe.git
cd QuizMe

# 2. Install dependencies
npm install

# 3. Create your environment file
echo "EXPO_PUBLIC_GROQ_API_KEY=your_key_here" > .env

# 4. Start the development server
npx expo start
```

Then scan the QR code with **Expo Go** on your phone, or press:
- `a` — open on Android emulator
- `i` — open on iOS simulator
- `w` — open in web browser

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `EXPO_PUBLIC_GROQ_API_KEY` | Your Groq API key for AI question generation via Llama 3.1 8B Instant | ✅ Yes |

> **Note:** The `EXPO_PUBLIC_` prefix is required by Expo to expose the variable to the client bundle. Get a free Groq API key at [console.groq.com](https://console.groq.com/). Never commit your `.env` file — it is already included in `.gitignore`.

---

## How It Works

```
User selects topic & difficulty
        ↓
aiApi.ts sends structured prompt to Groq API (llama-3.1-8b-instant)
        ↓
Groq returns a strict JSON quiz object (5 questions)
        ↓
useQuiz hook parses & manages quiz state via useReducer
        ↓
quiz.tsx renders questions with animations & fact reveals
        ↓
results.tsx shows score breakdown & full answer review
```

---

## Building for Production

QuizMe uses [EAS Build](https://docs.expo.dev/build/introduction/) for production builds.

```bash
# Install EAS CLI
npm install -g eas-cli

# Build for Android (APK for internal testing)
eas build --platform android --profile preview

# Build for iOS (simulator)
eas build --platform ios --profile preview

# Production build (both platforms)
eas build --platform all --profile production
```

---

## Author

Built by **Ezra** · GitHub: [@Ezra-creator](https://github.com/Ezra-creator)

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
