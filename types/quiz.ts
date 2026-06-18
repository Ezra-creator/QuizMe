export type Difficulty = "Easy" | "Medium" | "Hard";

export type Topic = {
  label: string;
  icon: string;
};

export type Question = {
  question: string;
  options: string[];
  answer: string;
  fact: string;
};

export type Answer = {
  question: string;
  selected: string;
  answer: string;
  correct: boolean;
};

export type QuizState = {
  questions: Question[];
  current: number;
  score: number;
  answers: Answer[];
  loading: boolean;
  error: string | null;
};
