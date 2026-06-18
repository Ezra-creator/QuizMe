import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FactCard from "../components/FactCard";
import OptionButton from "../components/OptionButton";
import ProgressBar from "../components/ProgressBar";
import Colors from "../constants/colors";
import { useQuiz } from "../hooks/useQuiz";
import type { Difficulty } from "../types/quiz";

export default function QuizScreen() {
  const router = useRouter();
  const { topic, difficulty } = useLocalSearchParams<{
    topic: string;
    difficulty: Difficulty;
  }>();

  const {
    state,
    currentQuestion,
    revealed,
    selectAnswer,
    nextQuestion,
    loadQuiz,
  } = useQuiz();

  // Spinner rotation value
  const rotationAnim = useRef(new Animated.Value(0)).current;
  // Spinner loop ref so we can stop it
  const spinnerLoop = useRef<Animated.CompositeAnimation | null>(null);
  // Guard: only call loadQuiz once on mount
  const hasFetched = useRef(false);

  // Load quiz on mount — only once
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    loadQuiz(topic ?? "Science", (difficulty as Difficulty) ?? "Easy");
  }, [loadQuiz, topic, difficulty]);

  // Drive the spinner while loading
  useEffect(() => {
    if (state.loading) {
      rotationAnim.setValue(0);
      spinnerLoop.current = Animated.loop(
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        })
      );
      spinnerLoop.current.start();
    } else {
      spinnerLoop.current?.stop();
    }
  }, [state.loading, rotationAnim]);

  const spin = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // ── LOADING STATE ──────────────────────────────────────────────
  if (state.loading) {
    return (
      <View style={styles.centered}>
        <Animated.View
          style={[styles.spinner, { transform: [{ rotate: spin }] }]}
        />
        <Text style={styles.loadingText}>Generating questions...</Text>
        <Text style={styles.loadingTopic}>{topic}</Text>
      </View>
    );
  }

  // ── ERROR STATE ────────────────────────────────────────────────
  if (state.error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorEmoji}>❌</Text>
        <Text style={styles.errorText}>{state.error}</Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => {
            hasFetched.current = false;
            loadQuiz(topic ?? "Science", (difficulty as Difficulty) ?? "Easy");
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.retryBtnText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.goBackLink} onPress={() => router.back()}>
          <Text style={styles.goBackText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── NO QUESTION (shouldn't happen after load) ─────────────────
  if (!currentQuestion) return null;

  const total = state.questions.length;
  const current = state.current;
  // progress: how many questions completed (not the current index)
  const progress = total > 0 ? current / total : 0;
  const selectedAnswer = state.answers[current]?.selected ?? null;

  const isLastQuestion = current + 1 >= total;

  const handleNext = () => {
    if (isLastQuestion) {
      // Navigate to results with all needed params
      router.push({
        pathname: "/results",
        params: {
          score: String(state.score),
          total: String(total),
          topic: topic ?? "Science",
          difficulty: difficulty ?? "Easy",
          answers: JSON.stringify(state.answers),
        },
      });
    } else {
      nextQuestion();
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Ambient glow blob */}
      <View style={styles.glowBlob} />

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <Text style={styles.topicLabel}>{topic}</Text>
        <View style={styles.difficultyBadge}>
          <Text style={styles.difficultyText}>{difficulty}</Text>
        </View>
      </View>

      {/* PROGRESS BAR */}
      <View style={styles.progressWrapper}>
        <ProgressBar progress={progress} current={current} total={total} />
      </View>

      {/* QUESTION CARD */}
      <View style={styles.questionCard}>
        <Text style={styles.questionNumber}>
          Question {current + 1}
        </Text>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>

      {/* OPTION BUTTONS */}
      <View style={styles.options}>
        {currentQuestion.options.map((opt) => {
          const isCorrect = revealed ? opt === currentQuestion.answer : null;
          const isSelected = selectedAnswer === opt;
          return (
            <OptionButton
              key={opt}
              label={opt}
              selected={isSelected}
              correct={isCorrect}
              disabled={revealed}
              onPress={() => selectAnswer(opt)}
            />
          );
        })}
      </View>

      {/* POST-ANSWER: FACT CARD + NEXT BUTTON */}
      {revealed && (
        <>
          <FactCard fact={currentQuestion.fact} />
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={handleNext}
            activeOpacity={0.9}
          >
            <Text style={styles.nextBtnText}>
              {isLastQuestion ? "See Results ✦" : "Next Question →"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // ── Shared layouts ─────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },

  // ── Ambient glow ───────────────────────────────────────────────
  glowBlob: {
    position: "absolute",
    top: -120,
    left: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: Colors.accentGlow,
    ...Platform.select({
      ios: {
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 80,
      },
    }),
  },

  // ── Loading state ──────────────────────────────────────────────
  spinner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    borderTopColor: Colors.accent,
    borderRightColor: Colors.border,
    borderBottomColor: Colors.border,
    borderLeftColor: Colors.border,
  },
  loadingText: {
    color: Colors.muted,
    fontSize: 14,
    marginTop: 16,
  },
  loadingTopic: {
    color: Colors.accentLight,
    fontSize: 13,
    marginTop: 4,
  },

  // ── Error state ────────────────────────────────────────────────
  errorEmoji: {
    fontSize: 40,
  },
  errorText: {
    color: Colors.red,
    fontSize: 15,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
  },
  retryBtn: {
    marginTop: 20,
    paddingHorizontal: 28,
    paddingVertical: 13,
    backgroundColor: Colors.accent,
    borderRadius: 12,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  retryBtnText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 14,
  },
  goBackLink: {
    marginTop: 14,
    paddingVertical: 6,
  },
  goBackText: {
    color: Colors.muted,
    fontSize: 14,
  },

  // ── Top bar ────────────────────────────────────────────────────
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  topicLabel: {
    color: Colors.muted,
    fontSize: 13,
    flex: 1,
    marginRight: 8,
  },
  difficultyBadge: {
    backgroundColor: Colors.accentGlow,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.3)",
  },
  difficultyText: {
    color: Colors.accentLight,
    fontSize: 11,
    fontWeight: "700",
  },

  // ── Progress bar wrapper ───────────────────────────────────────
  progressWrapper: {
    marginBottom: 24,
  },

  // ── Question card ──────────────────────────────────────────────
  questionCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderTopColor: "rgba(124, 58, 237, 0.25)",
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 20,
    marginBottom: 20,
    // subtle top glow
    ...Platform.select({
      ios: {
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  questionNumber: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.accentLight,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 10,
    opacity: 0.8,
  },
  questionText: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 26,
  },

  // ── Options ────────────────────────────────────────────────────
  options: {
    gap: 10,
  },

  // ── Next button ────────────────────────────────────────────────
  nextBtn: {
    height: 52,
    borderRadius: 14,
    marginTop: 16,
    backgroundColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 6,
  },
  nextBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
