import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

type Props = {
  fact: string;
};

export default function FactCard({ fact }: Props) {
  const slideAnim = useRef(new Animated.Value(20)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.label}>💡 Did you know?</Text>
      </View>
      <Text style={styles.fact}>{fact}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0A1628",
    borderWidth: 1,
    borderColor: "#1E3A5F",
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#3B82F6",
  },
  header: {
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#60A5FA",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  fact: {
    fontSize: 13,
    color: "#93C5FD",
    lineHeight: 20,
  },
});
