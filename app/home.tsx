import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Colors from "../constants/colors";
import difficulties from "../constants/difficulties";
import topics from "../constants/topics";
import type { Difficulty, Topic } from "../types/quiz";

export default function HomeScreen() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [customTopic, setCustomTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("Medium");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const effectiveTopic = customTopic.trim() || selectedTopic?.label || "";
  const canStart = effectiveTopic.length > 0;

  const handleStart = () => {
    if (!canStart) return;
    router.push({
      pathname: "/quiz",
      params: {
        topic: effectiveTopic,
        difficulty: selectedDifficulty,
      },
    });
  };

  const handleTopicPress = (topic: Topic) => {
    setSelectedTopic(topic);
    setCustomTopic("");
  };

  const handleCustomInputChange = (text: string) => {
    setCustomTopic(text);
    setSelectedTopic(null);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.glowBlob} />

      <View style={styles.header}>
        <View style={styles.brainCircle}>
          <Text style={styles.brainEmoji}>🧠</Text>
        </View>
        <Text style={styles.title}>QuizMe</Text>
        <Text style={styles.subtitle}>AI-powered trivia. Any topic. Any time.</Text>
      </View>

      <Text style={styles.sectionLabel}>Choose a Topic</Text>
      <View style={styles.topicsGrid}>
        {topics.map((topic) => (
          <TouchableOpacity
            key={topic.label}
            style={[
              styles.topicChip,
              selectedTopic?.label === topic.label && styles.topicChipSelected,
            ]}
            onPress={() => handleTopicPress(topic)}
            activeOpacity={0.7}
          >
            {selectedTopic?.label === topic.label && <View style={styles.topicChipGlow} />}
            <Text style={styles.topicIcon}>{topic.icon}</Text>
            <Text
              style={[
                styles.topicLabel,
                selectedTopic?.label === topic.label && styles.topicLabelSelected,
              ]}
            >
              {topic.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={[
          styles.customInput,
          isInputFocused && styles.customInputFocused,
        ]}
        placeholder="Or type your own topic..."
        placeholderTextColor={Colors.muted}
        value={customTopic}
        onChangeText={handleCustomInputChange}
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
      />

      <Text style={styles.sectionLabel}>Difficulty</Text>
      <View style={styles.difficultyRow}>
        {difficulties.map((d) => (
          <TouchableOpacity
            key={d}
            style={[
              styles.difficultyBtn,
              selectedDifficulty === d && styles.difficultyBtnSelected,
            ]}
            onPress={() => setSelectedDifficulty(d)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.difficultyText,
                selectedDifficulty === d && styles.difficultyTextSelected,
              ]}
            >
              {d}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.startBtn, !canStart && styles.startBtnDisabled]}
        onPress={handleStart}
        disabled={!canStart}
        activeOpacity={0.9}
      >
        <Text style={styles.startBtnText}>Start Quiz ✦</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 40,
  },
  glowBlob: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Colors.accentGlow,
    ...Platform.select({
      ios: {
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 100,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  header: {
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 32,
  },
  brainCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.accentGlow,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  brainEmoji: {
    fontSize: 36,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: Colors.text,
    letterSpacing: -1,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
    }),
  },
  subtitle: {
    fontSize: 14,
    color: Colors.muted,
    marginTop: 6,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: Colors.muted,
    marginBottom: 12,
  },
  topicsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  topicChip: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    position: "relative",
    overflow: "hidden",
  },
  topicChipSelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  topicChipGlow: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 18,
    backgroundColor: Colors.accent,
    opacity: 0.3,
  },
  topicIcon: {
    fontSize: 18,
  },
  topicLabel: {
    fontSize: 13,
    color: Colors.muted,
    marginLeft: 8,
  },
  topicLabelSelected: {
    color: Colors.white,
    fontWeight: "600",
  },
  customInput: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: Colors.text,
    fontSize: 14,
    marginBottom: 24,
  },
  customInputFocused: {
    borderColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  difficultyRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  difficultyBtn: {
    flex: 1,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  difficultyBtnSelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  difficultyText: {
    fontSize: 13,
    color: Colors.muted,
  },
  difficultyTextSelected: {
    color: Colors.white,
    fontWeight: "700",
  },
  startBtn: {
    height: 56,
    borderRadius: 16,
    marginTop: 8,
    backgroundColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  startBtnDisabled: {
    backgroundColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
    opacity: 0.6,
  },
  startBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.white,
  },
});
