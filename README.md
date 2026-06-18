<div align="center">
  
# QuizMe 🧠

**AI-powered trivia. Any topic. Any time.**

[![Built with Expo](https://img.shields.io/badge/Built_with-Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Language: TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![AI: Claude API](https://img.shields.io/badge/AI-Claude_API-D97757?style=for-the-badge&logo=anthropic&logoColor=white)](https://www.anthropic.com/api)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

## About

QuizMe is an intelligent mobile trivia application that generates endless, highly-specific quizzes on the fly using the Anthropic Claude API. Designed for curious minds and lifelong learners, the app allows users to input any topic imaginable and instantly receive a bespoke 5-question quiz tailored to their chosen difficulty. From a technical perspective, QuizMe showcases a seamless integration of large language models within a React Native (Expo) environment, featuring strict JSON schema enforcement for reliable AI responses, a robust custom React state management system, and a highly polished, immersive dark-mode UI rich with micro-animations.

## Features

- 🎯 **AI-generated questions on any topic via Claude API**
- 🌓 **Easy / Medium / Hard difficulty modes**
- 💡 **Interesting facts revealed after each answer**
- 📊 **Detailed score breakdown and answer review**
- ⚡ **Built with Expo Router for fast file-based navigation**
- 🎨 **Fully custom dark UI with glow effects and animations**

## Tech Stack

| Layer | Technology |
|---|---|
| **Mobile Framework** | React Native (Expo) |
| **Language** | TypeScript |
| **Navigation** | Expo Router |
| **AI Backend** | Anthropic Claude API |
| **State Management** | React Hooks (`useReducer`) |
| **Styling** | React Native StyleSheet (Custom Theme) |

## Project Structure

```text
QuizMe/
├── app/                  # Expo Router screens (_layout, index, home, quiz, results)
├── components/           # Reusable UI components (FactCard, OptionButton, ScoreCard, etc.)
├── constants/            # Theming and static data (colors, difficulties, topics)
├── hooks/                # Custom React hooks (useQuiz)
├── services/             # External API integrations (aiApi)
└── types/                # TypeScript interfaces and type definitions
```

## Getting Started

1. **Prerequisites**: Node.js 18+, Expo CLI, Anthropic API key
2. **Clone the repo**: `git clone https://github.com/yourusername/quizme.git`
3. **Install dependencies**: `npm install`
4. **Create .env file** and add `EXPO_PUBLIC_ANTHROPIC_API_KEY=your_key_here`
5. **Start the app**: `npx expo start`
6. **Scan QR code** with Expo Go app on your phone

## Environment Variables

| Variable Name | Description | Required |
|---|---|---|
| `EXPO_PUBLIC_ANTHROPIC_API_KEY` | Your Anthropic Claude API key for question generation | Yes |

## How It Works

1. **User Input**: The user selects or types a topic and chooses a difficulty level.
2. **AI Generation**: The app sends a highly structured prompt to the Anthropic Claude API, requesting a 5-question quiz in a strict JSON format.
3. **Parsing**: The API returns the generated JSON, which is parsed and validated.
4. **Interactive Quiz**: The Quiz screen renders the questions with dynamic animations, glow effects, and fact reveals, culminating in a detailed Results screen.

## Screenshots

<!-- Add screenshots here -->

## Author

Built by [Your Name] · GitHub: [@yourusername]

## License

This project is licensed under the MIT License.
