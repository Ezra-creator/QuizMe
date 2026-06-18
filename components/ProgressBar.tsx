import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import Colors from "../constants/colors";

type Props = {
  progress: number; // 0 to 1
  current: number;
  total: number;
};

export default function ProgressBar({ progress, current, total }: Props) {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const clampedProgress = Math.min(Math.max(progress, 0), 1);
    Animated.timing(animatedWidth, {
      toValue: clampedProgress * 100,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedWidth]);

  return (
    <>
      <View style={styles.track}>
        <Animated.View
          style={[styles.fill, { width: animatedWidth.interpolate({
            inputRange: [0, 100],
            outputRange: ["0%", "100%"],
          }) }]}
        />
      </View>
      <Text style={styles.count}>{current + 1} of {total}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 99,
    overflow: "hidden",
    marginBottom: 6,
  },
  fill: {
    height: "100%",
    backgroundColor: Colors.accent,
    borderRadius: 99,
  },
  count: {
    fontSize: 12,
    color: Colors.muted,
    textAlign: "right",
    marginTop: 6,
  },
});
