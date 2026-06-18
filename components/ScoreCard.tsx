import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import Colors from "../constants/colors";

type Props = {
  score: number;
  total: number;
};

export default function ScoreCard({ score, total }: Props) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const wrong = total - score;

  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(barAnim, {
      toValue: pct,
      duration: 800,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [pct, barAnim]);

  const fillColor =
    pct >= 80 ? Colors.green : pct >= 60 ? Colors.gold : Colors.red;

  return (
    <View style={styles.card}>
      {/* Score number: big split typography */}
      <View style={styles.scoreRow}>
        <Text style={styles.scoreNum}>{score}</Text>
        <Text style={styles.scoreDenom}>/{total}</Text>
      </View>

      <Text style={styles.pctLabel}>{pct}% correct</Text>

      {/* Animated fill bar */}
      <View style={styles.barTrack}>
        <Animated.View
          style={[
            styles.barFill,
            {
              backgroundColor: fillColor,
              width: barAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>

      {/* Stat row */}
      <View style={styles.statRow}>
        <View style={styles.stat}>
          <Text style={[styles.statNum, { color: Colors.green }]}>{score}</Text>
          <Text style={styles.statLabel}>Correct</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={[styles.statNum, { color: Colors.red }]}>{wrong}</Text>
          <Text style={styles.statLabel}>Wrong</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statNum}>{total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: "center",
  },

  // Score typography
  scoreRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  scoreNum: {
    fontSize: 60,
    fontWeight: "900",
    color: Colors.accentLight,
    lineHeight: 64,
    letterSpacing: -2,
  },
  scoreDenom: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.muted,
    marginBottom: 6,
    marginLeft: 2,
  },
  pctLabel: {
    fontSize: 14,
    color: Colors.muted,
    marginTop: 4,
    marginBottom: 20,
  },

  // Animated bar
  barTrack: {
    width: "100%",
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 99,
    overflow: "hidden",
    marginBottom: 8,
  },
  barFill: {
    height: "100%",
    borderRadius: 99,
  },

  // Stat row
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    width: "100%",
    justifyContent: "space-evenly",
  },
  stat: {
    alignItems: "center",
    flex: 1,
  },
  statNum: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 3,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
  },
});
