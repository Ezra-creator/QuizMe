import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ScoreCard from "../components/ScoreCard";
import Colors from "../constants/colors";
import type { Answer, Difficulty } from "../types/quiz";

// ── Helpers ────────────────────────────────────────────────────────────────

function getPct(score: number, total: number) {
  return total > 0 ? Math.round((score / total) * 100) : 0;
}

function getEmoji(pct: number): string {
  if (pct === 100) return "🏆";
  if (pct >= 80) return "🎯";
  if (pct >= 60) return "⭐";
  if (pct >= 40) return "💪";
  return "📚";
}

function getTitle(pct: number): string {
  if (pct === 100) return "Perfect Score!";
  if (pct >= 80) return "Outstanding!";
  if (pct >= 60) return "Well Done!";
  if (pct >= 40) return "Keep Going!";
  return "Room to Grow!";
}

// ── Screen ─────────────────────────────────────────────────────────────────

export default function ResultsScreen() {
  const router = useRouter();
  const { score, total, topic, difficulty, answers: answersParam } =
    useLocalSearchParams<{
      score: string;
      total: string;
      topic: string;
      difficulty: Difficulty;
      answers: string;
    }>();

  // Entrance animation
  const enterAnim = useRef(new Animated.Value(0)).current;
  const translateY = enterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  useEffect(() => {
    Animated.timing(enterAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [enterAnim]);

  // ── Parse answers safely ───────────────────────────────────────
  let parsedAnswers: Answer[] = [];
  let parseError = false;
  try {
    parsedAnswers = answersParam ? JSON.parse(answersParam) : [];
    if (!Array.isArray(parsedAnswers)) throw new Error("Not an array");
  } catch {
    parseError = true;
  }

  if (parseError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorEmoji}>⚠️</Text>
        <Text style={styles.errorText}>
          Couldn't load your results. Something went wrong.
        </Text>
        <TouchableOpacity
          style={styles.errorBtn}
          onPress={() => router.replace("/home")}
          activeOpacity={0.85}
        >
          <Text style={styles.errorBtnText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const scoreNum = Number(score ?? 0);
  const totalNum = Number(total ?? 0);
  const pct = getPct(scoreNum, totalNum);
  const emoji = getEmoji(pct);
  const title = getTitle(pct);
  const topicStr = topic ?? "Quiz";
  const difficultyStr = (difficulty as Difficulty) ?? "Medium";

  const handlePlayAgain = () => {
    router.push({
      pathname: "/quiz",
      params: {
        topic: topicStr,
        difficulty: difficultyStr,
      },
    });
  };

  const handleChangeTopic = () => {
    router.replace("/home");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Ambient glow */}
      <View style={styles.glowBlob} />

      <Animated.View
        style={{ opacity: enterAnim, transform: [{ translateY }] }}
      >
        {/* ── HERO SECTION ─────────────────────────────────── */}
        <View style={styles.hero}>
          <View style={styles.emojiCircle}>
            <Text style={styles.emojiText}>{emoji}</Text>
          </View>
          <Text style={styles.heroTitle}>{title}</Text>
          <Text style={styles.heroTopic}>{topicStr}</Text>
        </View>

        {/* ── SCORE CARD ────────────────────────────────────── */}
        <View style={styles.scoreCardWrapper}>
          <ScoreCard score={scoreNum} total={totalNum} />
        </View>

        {/* ── ANSWER REVIEW ─────────────────────────────────── */}
        <View style={styles.reviewSection}>
          <Text style={styles.sectionLabel}>Review Answers</Text>
          {parsedAnswers.map((a, i) => (
            <View
              key={i}
              style={[
                styles.reviewCard,
                a.correct ? styles.reviewCorrect : styles.reviewWrong,
              ]}
            >
              <Text style={styles.reviewIcon}>{a.correct ? "✅" : "❌"}</Text>
              <View style={styles.reviewBody}>
                <Text style={styles.reviewQ}>
                  {i + 1}. {a.question}
                </Text>
                {!a.correct && (
                  <Text style={styles.reviewCorrectAnswer}>
                    Correct: {a.answer}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* ── ACTION BUTTONS ────────────────────────────────── */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handlePlayAgain}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryBtnText}>Play Again ↺</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={handleChangeTopic}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryBtnText}>Change Topic</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Ambient glow blob
  glowBlob: {
    position: "absolute",
    top: -60,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: Colors.accentGlow,
    ...Platform.select({
      ios: {
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 90,
      },
    }),
  },

  // ── Error fallback ─────────────────────────────────────────────
  errorContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorEmoji: {
    fontSize: 48,
  },
  errorText: {
    color: Colors.muted,
    fontSize: 15,
    textAlign: "center",
    marginTop: 16,
    lineHeight: 22,
  },
  errorBtn: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 13,
    backgroundColor: Colors.accent,
    borderRadius: 12,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  errorBtnText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 15,
  },

  // ── Hero ───────────────────────────────────────────────────────
  hero: {
    alignItems: "center",
    paddingTop: 48,
    paddingHorizontal: 20,
  },
  emojiCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accentGlow,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  emojiText: {
    fontSize: 36,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: Colors.text,
    letterSpacing: -0.5,
    marginTop: 16,
    textAlign: "center",
    ...Platform.select({
      ios: { fontFamily: "Georgia" },
      android: { fontFamily: "serif" },
    }),
  },
  heroTopic: {
    fontSize: 13,
    color: Colors.muted,
    marginTop: 4,
  },

  // ── Score card wrapper ─────────────────────────────────────────
  scoreCardWrapper: {
    marginTop: 28,
    marginHorizontal: 20,
    marginBottom: 8,
  },

  // ── Review section ─────────────────────────────────────────────
  reviewSection: {
    marginTop: 28,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: Colors.muted,
    marginBottom: 12,
  },
  reviewCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  reviewCorrect: {
    borderColor: "rgba(16, 185, 129, 0.35)",
    backgroundColor: "rgba(16, 185, 129, 0.05)",
  },
  reviewWrong: {
    borderColor: "rgba(239, 68, 68, 0.35)",
    backgroundColor: "rgba(239, 68, 68, 0.05)",
  },
  reviewIcon: {
    fontSize: 18,
    marginRight: 12,
    marginTop: 1,
  },
  reviewBody: {
    flex: 1,
  },
  reviewQ: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.text,
    lineHeight: 19,
  },
  reviewCorrectAnswer: {
    fontSize: 12,
    color: Colors.green,
    marginTop: 4,
    fontWeight: "500",
  },

  // ── Action buttons ─────────────────────────────────────────────
  actions: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 40,
    gap: 10,
  },
  primaryBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 6,
  },
  primaryBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  secondaryBtn: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  secondaryBtnText: {
    color: Colors.muted,
    fontSize: 14,
    fontWeight: "500",
  },
});
