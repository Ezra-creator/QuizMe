import { useCallback, useReducer } from "react";
import { fetchQuestions } from "../services/aiApi";
import type { Answer, Difficulty, Question, QuizState } from "../types/quiz";

type QuizAction =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS"; questions: Question[] }
  | { type: "LOAD_ERROR"; error: string }
  | { type: "SELECT_ANSWER"; answer: Answer }
  | { type: "NEXT_QUESTION" }
  | { type: "RESET" };

const initialState: QuizState = {
  questions: [],
  current: 0,
  score: 0,
  answers: [],
  loading: false,
  error: null,
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "LOAD_START":
      return { ...initialState, loading: true, error: null };
    case "LOAD_SUCCESS":
      return { ...state, questions: action.questions, loading: false, error: null };
    case "LOAD_ERROR":
      return { ...state, loading: false, error: action.error };
    case "SELECT_ANSWER":
      return {
        ...state,
        score: action.answer.correct ? state.score + 1 : state.score,
        answers: [...state.answers, action.answer],
      };
    case "NEXT_QUESTION":
      return { ...state, current: state.current + 1 };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function useQuiz() {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const revealed = state.answers.length > state.current;
  const currentQuestion = state.questions[state.current] ?? null;

  const loadQuiz = useCallback(async (topic: string, difficulty: Difficulty) => {
    dispatch({ type: "LOAD_START" });
    try {
      const questions = await fetchQuestions(topic, difficulty);
      dispatch({ type: "LOAD_SUCCESS", questions });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load questions";
      dispatch({ type: "LOAD_ERROR", error: message });
    }
  }, []);

  const selectAnswer = useCallback((option: string) => {
    if (revealed || !currentQuestion) return;

    const correct = option === currentQuestion.answer;
    const answer: Answer = {
      question: currentQuestion.question,
      selected: option,
      answer: currentQuestion.answer,
      correct,
    };

    dispatch({ type: "SELECT_ANSWER", answer });
  }, [revealed, currentQuestion]);

  const nextQuestion = useCallback(() => {
    dispatch({ type: "NEXT_QUESTION" });
  }, []);

  const resetQuiz = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return {
    state,
    loadQuiz,
    selectAnswer,
    nextQuestion,
    resetQuiz,
    revealed,
    currentQuestion,
  };
}
