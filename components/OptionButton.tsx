import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constants/colors";

type Props = {
  label: string;
  selected: boolean;
  correct: boolean | null; // null = not yet revealed
  disabled: boolean;
  onPress: () => void;
};

export default function OptionButton({
  label,
  selected,
  correct,
  disabled,
  onPress,
}: Props) {
  const getContainerStyle = () => {
    if (correct === null) {
      return styles.optionDefault;
    }
    if (correct) return styles.optionCorrect;
    if (selected && !correct) return styles.optionWrong;
    return styles.optionDimmed;
  };

  const getCircleStyle = () => {
    if (correct === null) {
      return styles.circleDefault;
    }
    if (correct) return styles.circleCorrect;
    if (selected && !correct) return styles.circleWrong;
    return styles.circleDimmed;
  };

  const getCircleTextStyle = () => {
    if (correct === null) {
      return styles.circleTextDefault;
    }
    if (correct || (selected && !correct)) return styles.circleTextWhite;
    return styles.circleTextDimmed;
  };

  const getOptionTextStyle = () => {
    if (correct === null) {
      return styles.optionTextDefault;
    }
    if (correct) return styles.optionTextCorrect;
    if (selected && !correct) return styles.optionTextWrong;
    return styles.optionTextDimmed;
  };

  const getGlowStyle = () => {
    if (correct === null) return null;
    if (correct) return styles.glowGreen;
    if (selected && !correct) return styles.glowRed;
    return null;
  };

  const getLetter = () => {
    if (label.startsWith("A)")) return "A";
    if (label.startsWith("B)")) return "B";
    if (label.startsWith("C)")) return "C";
    if (label.startsWith("D)")) return "D";
    return label[0];
  };

  const getOptionText = () => {
    return label.replace(/^[A-D]\)\s*/, "");
  };

  const isRevealed = correct !== null;

  return (
    <TouchableOpacity
      style={[styles.base, getContainerStyle(), getGlowStyle()]}
      onPress={onPress}
      disabled={disabled || isRevealed}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={[styles.circle, getCircleStyle()]}>
          <Text style={[styles.circleText, getCircleTextStyle()]}>{getLetter()}</Text>
        </View>
        <Text style={[styles.optionText, getOptionTextStyle()]}>{getOptionText()}</Text>
        {isRevealed && correct && <Text style={styles.checkmark}>✓</Text>}
        {isRevealed && selected && !correct && <Text style={styles.crossmark}>✗</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  circleDefault: {
    backgroundColor: Colors.border,
  },
  circleCorrect: {
    backgroundColor: Colors.green,
  },
  circleWrong: {
    backgroundColor: Colors.red,
  },
  circleDimmed: {
    backgroundColor: Colors.border,
  },
  circleText: {
    fontSize: 13,
    fontWeight: "700",
  },
  circleTextDefault: {
    color: Colors.muted,
  },
  circleTextWhite: {
    color: Colors.white,
  },
  circleTextDimmed: {
    color: Colors.muted,
  },
  optionText: {
    fontSize: 14,
    flex: 1,
    marginLeft: 12,
    lineHeight: 20,
  },
  optionTextDefault: {
    color: Colors.text,
  },
  optionTextCorrect: {
    color: Colors.green,
  },
  optionTextWrong: {
    color: Colors.red,
  },
  optionTextDimmed: {
    color: Colors.text,
  },
  optionDefault: {
    backgroundColor: Colors.card,
    borderColor: Colors.border,
  },
  optionCorrect: {
    backgroundColor: "#0D2A1F",
    borderColor: Colors.green,
    borderWidth: 1.5,
  },
  optionWrong: {
    backgroundColor: "#2A0D0D",
    borderColor: Colors.red,
    borderWidth: 1.5,
  },
  optionDimmed: {
    backgroundColor: Colors.card,
    borderColor: Colors.border,
    opacity: 0.4,
  },
  glowGreen: {
    shadowColor: Colors.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 5,
  },
  glowRed: {
    shadowColor: Colors.red,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 5,
  },
  checkmark: {
    color: Colors.green,
    fontSize: 16,
    fontWeight: "700",
  },
  crossmark: {
    color: Colors.red,
    fontSize: 16,
    fontWeight: "700",
  },
});
