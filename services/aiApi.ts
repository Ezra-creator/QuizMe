import type { Question, Difficulty } from "../types/quiz";

export async function fetchQuestions(
  topic: string,
  difficulty: Difficulty
): Promise<Question[]> {
  const API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
  if (!API_KEY) {
    throw new Error("Groq API key is missing. Add EXPO_PUBLIC_GROQ_API_KEY to your .env file");
  }

  const prompt = `Generate exactly 5 multiple choice trivia questions about '${topic}' at '${difficulty}' difficulty level.

Return ONLY a raw JSON array. No markdown. No code blocks. No explanation. No preamble.

The array must follow this exact structure:
[
  {
    "question": "Full question text ending with a question mark?",
    "options": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
    "answer": "A) First option",
    "fact": "One interesting sentence about the correct answer."
  }
]

Rules:
- Exactly 5 questions
- Exactly 4 options each, prefixed A) B) C) D)
- The answer field must exactly match one of the options strings
- The fact must be engaging and surprising, not just restate the answer
- Vary question styles: some definition, some which of these, some historical, some numerical`;

  const API_URL = "https://api.groq.com/openai/v1/chat/completions";

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    let errorMessage = "Groq API request failed";
    try {
      const errorJson = await response.json();
      if (errorJson?.error?.message) {
        errorMessage = errorJson.error.message;
      }
    } catch {
      // Ignored
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  const contentText = data?.choices?.[0]?.message?.content;

  if (!contentText || contentText.trim() === "") {
    throw new Error("Empty response received from Groq");
  }

  let parsed: any;
  try {
    const cleaned = contentText.replace(/```json\n?|```\n?/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Could not parse questions from Groq response");
  }

  if (!Array.isArray(parsed) || parsed.length !== 5) {
    throw new Error("Invalid format — Groq did not return exactly 5 questions");
  }

  return parsed as Question[];
}
