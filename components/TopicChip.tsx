import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Colors from "../constants/colors";
import type { Topic } from "../types/quiz";

type Props = {
  topic: Topic;
  selected: boolean;
  onPress: () => void;
};

export default function TopicChip({ topic, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.icon}>{topic.icon}</Text>
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {topic.label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: Colors.accentGlow,
    borderColor: Colors.accent,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.muted,
  },
  labelSelected: {
    color: Colors.accentLight,
  },
});
