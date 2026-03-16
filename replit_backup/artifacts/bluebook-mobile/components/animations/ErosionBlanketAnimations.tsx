import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

const W = 300;
const H = 220;
const SOIL = "#7B5E3A";
const BLANKET = "#D6C9A8";
const PEG_C = "#5D4E37";
const GREEN = "#2D6A4F";
const LABEL_BG = "rgba(45,106,79,0.9)";
const SKY = "#EAF4F8";

// Anchor trench at slope crest
export function BlanketAnchorTrenchAnimation() {
  const trenchO = useRef(new Animated.Value(0)).current;
  const blanketDrop = useRef(new Animated.Value(0)).current;
  const fillO = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(trenchO, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.delay(400),
        Animated.timing(blanketDrop, { toValue: 1, duration: 900, useNativeDriver: false }),
        Animated.delay(300),
        Animated.timing(fillO, { toValue: 1, duration: 700, useNativeDriver: false }),
        Animated.delay(2000),
        Animated.parallel([
          Animated.timing(trenchO, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(blanketDrop, { toValue: 0, duration: 500, useNativeDriver: false }),
          Animated.timing(fillO, { toValue: 0, duration: 400, useNativeDriver: false }),
        ]),
        Animated.delay(600),
      ])
    );
    a.start();
    return () => a.stop();
  }, []);

  const CREST = 70;
  const TRENCH_DEPTH = 28;
  const blanketH = blanketDrop.interpolate({ inputRange: [0, 1], outputRange: [0, 100] });
  const fillH = fillO.interpolate({ inputRange: [0, 1], outputRange: [0, TRENCH_DEPTH] });

  return (
    <View style={[styles.container, { backgroundColor: SKY }]}>
      <Text style={styles.topLabel}>Slope crest cross-section</Text>

      {/* Slope */}
      <View style={{ position: "absolute", left: 0, top: CREST, right: 0, bottom: 0, backgroundColor: SOIL }} />

      {/* Trench */}
      <Animated.View
        style={{
          position: "absolute",
          left: 60,
          top: CREST,
          width: 30,
          height: TRENCH_DEPTH,
          backgroundColor: "#5D4037",
          opacity: trenchO,
        }}
      />

      {/* Blanket rolling down slope */}
      <Animated.View
        style={{
          position: "absolute",
          left: 60,
          top: CREST,
          right: 20,
          height: blanketH,
          backgroundColor: BLANKET,
          opacity: 0.85,
        }}
      />

      {/* Backfill */}
      <Animated.View
        style={{
          position: "absolute",
          left: 60,
          top: CREST,
          width: 30,
          height: fillH,
          backgroundColor: SOIL,
          opacity: 0.9,
        }}
      />

      {/* Label */}
      <Animated.View style={[styles.measureLabel, { left: 96, top: CREST - 2, opacity: fillO }]}>
        <Text style={styles.measureLabelText}>300 mm deep{"\n"}anchor trench</Text>
      </Animated.View>

      <View style={styles.specRow}>
        <View style={styles.specDot} />
        <Text style={styles.specText}>Anchor trench at slope crest — blanket buried 300 mm and backfilled</Text>
      </View>
    </View>
  );
}

// Peg grid — 1m spacing
export function BlanketPegGridAnimation() {
  const pegO = useRef(new Animated.Value(0)).current;
  const labelO = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(pegO, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(labelO, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.delay(2400),
        Animated.parallel([
          Animated.timing(pegO, { toValue: 0, duration: 500, useNativeDriver: true }),
          Animated.timing(labelO, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]),
        Animated.delay(500),
      ])
    );
    a.start();
    return () => a.stop();
  }, []);

  const PEG_POSITIONS = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 5; col++) {
      PEG_POSITIONS.push({ x: 30 + col * 56, y: 40 + row * 44 });
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: "#F0E8D0" }]}>
      {/* Blanket background */}
      <View style={{ position: "absolute", top: 26, left: 16, right: 16, bottom: 36, backgroundColor: BLANKET, borderRadius: 4 }} />

      {/* Grid lines */}
      {[40, 84, 128, 172].map((y) => (
        <View key={y} style={{ position: "absolute", left: 16, right: 16, top: y, height: 1, backgroundColor: "rgba(93,78,55,0.3)" }} />
      ))}
      {[30, 86, 142, 198, 254].map((x) => (
        <View key={x} style={{ position: "absolute", top: 26, bottom: 36, left: x, width: 1, backgroundColor: "rgba(93,78,55,0.3)" }} />
      ))}

      {/* Pegs */}
      {PEG_POSITIONS.map((pos, i) => (
        <Animated.View
          key={i}
          style={{
            position: "absolute",
            left: pos.x - 5,
            top: pos.y - 5,
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: PEG_C,
            opacity: pegO,
          }}
        />
      ))}

      {/* Spacing label */}
      <Animated.View style={[styles.measureLabel, { top: 44, left: 30, opacity: labelO }]}>
        <Text style={styles.measureLabelText}>1 m grid</Text>
      </Animated.View>
      <Animated.View
        style={{
          position: "absolute",
          top: 40,
          left: 30,
          width: 56,
          height: 1.5,
          backgroundColor: GREEN,
          opacity: labelO,
        }}
      />

      <View style={styles.specRow}>
        <View style={styles.specDot} />
        <Text style={styles.specText}>U-shaped pegs at minimum 1 m grid — holds blanket against soil surface</Text>
      </View>
    </View>
  );
}

// Joint overlap 150/300mm
export function BlanketJointOverlapAnimation() {
  const overlapAnim = useRef(new Animated.Value(0)).current;
  const labelO = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(overlapAnim, { toValue: 1, duration: 1200, useNativeDriver: false }),
        Animated.timing(labelO, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.delay(2400),
        Animated.parallel([
          Animated.timing(overlapAnim, { toValue: 0, duration: 500, useNativeDriver: false }),
          Animated.timing(labelO, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]),
        Animated.delay(500),
      ])
    );
    a.start();
    return () => a.stop();
  }, []);

  const sheet2Left = overlapAnim.interpolate({ inputRange: [0, 1], outputRange: [280, 150] });

  return (
    <View style={[styles.container, { backgroundColor: "#F0E8D0" }]}>
      <Text style={styles.topLabel}>Top-down view — horizontal joint</Text>

      {/* Sheet 1 */}
      <View style={{ position: "absolute", left: 16, top: 44, width: 220, height: 70, backgroundColor: BLANKET, borderRadius: 4, opacity: 0.9 }}>
        <Text style={{ position: "absolute", bottom: 6, left: 8, fontSize: 10, color: "#5D4E37", fontWeight: "600" }}>Sheet 1</Text>
      </View>

      {/* Sheet 2 (animated to overlap) */}
      <Animated.View style={{ position: "absolute", left: sheet2Left, top: 94, width: 220, height: 70, backgroundColor: "#C9B896", borderRadius: 4, opacity: 0.9 }}>
        <Text style={{ position: "absolute", top: 6, right: 8, fontSize: 10, color: "#5D4E37", fontWeight: "600" }}>Sheet 2</Text>
      </Animated.View>

      {/* Overlap indicator */}
      <Animated.View style={{ position: "absolute", left: sheet2Left, top: 44, width: 80, height: 120, opacity: labelO }}>
        <View style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, backgroundColor: "rgba(45,106,79,0.25)", borderWidth: 1.5, borderColor: GREEN, borderRadius: 2 }} />
        <View style={[styles.measureLabel, { top: 40, left: 2 }]}>
          <Text style={styles.measureLabelText}>150–300 mm{"\n"}overlap</Text>
        </View>
      </Animated.View>

      <View style={styles.specRow}>
        <View style={styles.specDot} />
        <Text style={styles.specText}>Horizontal overlaps 150 mm · Vertical joints 300 mm · post-supported</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: W, height: H, overflow: "hidden", borderRadius: 12 },
  measureLabel: {
    position: "absolute",
    backgroundColor: LABEL_BG,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  measureLabelText: { color: "#fff", fontSize: 10, fontWeight: "700", lineHeight: 14 },
  topLabel: { position: "absolute", top: 8, alignSelf: "center", color: "#5A6B5E", fontSize: 11, fontStyle: "italic" },
  specRow: {
    position: "absolute",
    bottom: 6,
    left: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  specDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: GREEN, marginTop: 4 },
  specText: { fontSize: 11, color: "#5A6B5E", flex: 1, lineHeight: 15 },
});
