import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

const W = 300;
const H = 220;
const SOIL = "#7B5E3A";
const FABRIC = "#D6C9A8";
const POST = "#5D4E37";
const GREEN = "#2D6A4F";
const WATER = "#4FC3F7";
const LABEL_BG = "rgba(45,106,79,0.9)";
const SKY = "#EAF4F8";

// Across slope contour — flow arrows + fence perpendicular
export function SiltFenceContourAnimation() {
  const arrowX = useRef(new Animated.Value(-40)).current;
  const fenceO = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(arrowX, { toValue: 260, duration: 1800, useNativeDriver: true }),
          Animated.timing(fenceO, { toValue: 1, duration: 600, useNativeDriver: true }),
        ]),
        Animated.delay(600),
        Animated.parallel([
          Animated.timing(arrowX, { toValue: -40, duration: 0, useNativeDriver: true }),
          Animated.timing(fenceO, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]),
      ])
    );
    a.start();
    return () => a.stop();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: "#E8F5E9" }]}>
      <Text style={styles.topLabel}>Top-down view — slope runs left to right</Text>

      {/* Slope gradient bands */}
      {[0, 1, 2, 3].map((i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            top: 40 + i * 36,
            left: 0,
            right: 0,
            height: 35,
            backgroundColor: i % 2 === 0 ? "#C8E6C9" : "#A5D6A7",
          }}
        />
      ))}

      {/* Flow arrows */}
      {[50, 100, 150].map((y) => (
        <Animated.View
          key={y}
          style={{
            position: "absolute",
            top: y,
            left: 0,
            transform: [{ translateX: arrowX }],
          }}
        >
          <View style={styles.flowArrow} />
        </Animated.View>
      ))}

      {/* Silt fence — vertical line across slope */}
      <Animated.View
        style={{
          position: "absolute",
          left: 160,
          top: 36,
          width: 6,
          height: 148,
          backgroundColor: FABRIC,
          borderRadius: 2,
          opacity: fenceO,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 2,
        }}
      />
      {/* Posts */}
      {[40, 70, 100, 130, 160].map((y) => (
        <Animated.View
          key={y}
          style={{
            position: "absolute",
            left: 158,
            top: 36 + y,
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: POST,
            opacity: fenceO,
          }}
        />
      ))}

      <Animated.View style={[styles.callout, { top: 50, left: 170, opacity: fenceO }]}>
        <Text style={styles.calloutText}>Silt fence{"\n"}(across contour)</Text>
      </Animated.View>

      <View style={styles.specRow}>
        <View style={styles.specDot} />
        <Text style={styles.specText}>Installed across the slope — perpendicular to flow direction</Text>
      </View>
    </View>
  );
}

// Post spacing 1.8m
export function SiltFencePostSpacingAnimation() {
  const post2X = useRef(new Animated.Value(0)).current;
  const labelO = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(post2X, { toValue: 1, duration: 900, easing: Easing.out(Easing.back(1.5)), useNativeDriver: false }),
        Animated.timing(labelO, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.delay(2200),
        Animated.parallel([
          Animated.timing(post2X, { toValue: 0, duration: 500, useNativeDriver: false }),
          Animated.timing(labelO, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]),
        Animated.delay(500),
      ])
    );
    a.start();
    return () => a.stop();
  }, []);

  const GROUND = 140;
  const P1 = 40;
  const P2_FINAL = 196; // 1.8m apart visually

  const p2X = post2X.interpolate({ inputRange: [0, 1], outputRange: [P1, P2_FINAL] });

  return (
    <View style={[styles.container, { backgroundColor: SKY }]}>
      <View style={[styles.ground, { top: GROUND, backgroundColor: SOIL }]} />

      {/* Fabric */}
      <Animated.View
        style={{
          position: "absolute",
          left: P1 + 3,
          top: GROUND - 60,
          height: 60,
          width: post2X.interpolate({ inputRange: [0, 1], outputRange: [0, P2_FINAL - P1] }),
          backgroundColor: FABRIC,
          opacity: 0.85,
        }}
      />

      {/* Post 1 — fixed */}
      <View style={[styles.post, { left: P1, top: GROUND - 80 }]} />

      {/* Post 2 — animates into position */}
      <Animated.View style={[styles.post, { left: p2X, top: GROUND - 80 }]} />

      {/* Spacing label */}
      <Animated.View
        style={{
          position: "absolute",
          top: GROUND - 100,
          left: P1,
          opacity: labelO,
          width: P2_FINAL - P1,
          alignItems: "center",
        }}
      >
        <View style={styles.measureLabel}>
          <Text style={styles.measureLabelText}>1.8 m max spacing</Text>
        </View>
        {/* Horizontal arrow */}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4, width: "100%" }}>
          <View style={{ flex: 1, height: 1.5, backgroundColor: GREEN }} />
        </View>
      </Animated.View>

      {/* Anchor trench hint */}
      <View style={[styles.callout, { bottom: 36, right: 10 }]}>
        <Text style={styles.calloutText}>Posts driven{"\n"}450 mm deep</Text>
      </View>

      <View style={styles.specRow}>
        <View style={styles.specDot} />
        <Text style={styles.specText}>Posts max 1.8 m apart · driven min 450 mm into ground</Text>
      </View>
    </View>
  );
}

// Anchor trench cross-section
export function SiltFenceAnchorTrenchAnimation() {
  const fabricDrop = useRef(new Animated.Value(0)).current;
  const soilFill = useRef(new Animated.Value(0)).current;
  const labelO = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(fabricDrop, { toValue: 1, duration: 1000, useNativeDriver: false }),
        Animated.timing(soilFill, { toValue: 1, duration: 800, useNativeDriver: false }),
        Animated.timing(labelO, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.delay(2400),
        Animated.parallel([
          Animated.timing(fabricDrop, { toValue: 0, duration: 500, useNativeDriver: false }),
          Animated.timing(soilFill, { toValue: 0, duration: 500, useNativeDriver: false }),
          Animated.timing(labelO, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]),
        Animated.delay(500),
      ])
    );
    a.start();
    return () => a.stop();
  }, []);

  const SURFACE = 80;
  const TRENCH_DEPTH = 36;
  const FABRIC_MAX = 100;

  const aboveH = fabricDrop.interpolate({ inputRange: [0, 1], outputRange: [0, FABRIC_MAX] });
  const belowH = fabricDrop.interpolate({ inputRange: [0, 1], outputRange: [0, TRENCH_DEPTH] });
  const fillH = soilFill.interpolate({ inputRange: [0, 1], outputRange: [0, TRENCH_DEPTH] });

  return (
    <View style={[styles.container, { backgroundColor: SKY }]}>
      <Text style={styles.topLabel}>Cross-section view</Text>

      {/* Sky / ground surface */}
      <View style={{ position: "absolute", left: 0, right: 0, top: SURFACE, height: 4, backgroundColor: "#9E9E9E" }} />
      <View style={[styles.ground, { top: SURFACE + 4, backgroundColor: SOIL }]} />

      {/* Trench opening */}
      <View
        style={{
          position: "absolute",
          left: 130,
          top: SURFACE,
          width: 30,
          height: TRENCH_DEPTH + 4,
          backgroundColor: "#5D4037",
        }}
      />

      {/* Fabric above ground */}
      <Animated.View
        style={{
          position: "absolute",
          left: 143,
          top: SURFACE,
          width: 6,
          height: aboveH,
          backgroundColor: FABRIC,
          zIndex: 2,
        }}
      >
        <View style={{ position: "absolute", top: 0, left: -30, width: 4, height: 30, backgroundColor: POST }} />
      </Animated.View>

      {/* Fabric below (in trench) */}
      <Animated.View
        style={{
          position: "absolute",
          left: 143,
          top: SURFACE,
          width: 6,
          height: belowH,
          backgroundColor: FABRIC,
          opacity: 0.7,
          transform: [{ translateY: 4 }],
          zIndex: 1,
        }}
      />

      {/* Backfill */}
      <Animated.View
        style={{
          position: "absolute",
          left: 130,
          top: SURFACE + 4,
          width: 30,
          height: fillH,
          backgroundColor: SOIL,
          opacity: 0.85,
          zIndex: 3,
        }}
      />

      {/* Measurement label: 150-200mm burial */}
      <Animated.View style={[styles.measureLabel, { position: "absolute", left: 172, top: SURFACE + 2, opacity: labelO }]}>
        <Text style={styles.measureLabelText}>150–200 mm{"\n"}buried</Text>
      </Animated.View>

      {/* Vertical arrow */}
      <Animated.View
        style={{
          position: "absolute",
          left: 168,
          top: SURFACE,
          width: 2,
          height: TRENCH_DEPTH,
          backgroundColor: GREEN,
          opacity: labelO,
        }}
      />

      {/* 600mm above label */}
      <Animated.View style={[styles.callout, { top: 90, left: 12, opacity: labelO }]}>
        <Text style={styles.calloutText}>600 mm{"\n"}above ground</Text>
      </Animated.View>

      <View style={styles.specRow}>
        <View style={styles.specDot} />
        <Text style={styles.specText}>Fabric buried 150–200 mm in anchor trench · 600 mm above ground</Text>
      </View>
    </View>
  );
}

// Sediment accumulation — remove at 1/3 height
export function SiltFenceSedimentLevelAnimation() {
  const fillLevel = useRef(new Animated.Value(0)).current;
  const warnO = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const FABRIC_H = 60;
    const THRESHOLD = 20; // 1/3 of 60

    const a = Animated.loop(
      Animated.sequence([
        Animated.timing(fillLevel, { toValue: 1, duration: 2400, useNativeDriver: false }),
        Animated.timing(warnO, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.delay(1600),
        Animated.parallel([
          Animated.timing(fillLevel, { toValue: 0, duration: 600, useNativeDriver: false }),
          Animated.timing(warnO, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]),
        Animated.delay(600),
      ])
    );
    a.start();
    return () => a.stop();
  }, []);

  const GROUND = 140;
  const FABRIC_H = 60;
  const THRESHOLD_Y = FABRIC_H / 3;

  const sedH = fillLevel.interpolate({ inputRange: [0, 1], outputRange: [0, FABRIC_H * 0.8] });
  const sedColour = fillLevel.interpolate({
    inputRange: [0, 0.42, 0.43, 1],
    outputRange: ["#C4A882", "#C4A882", "#D62828", "#D62828"],
  });

  return (
    <View style={[styles.container, { backgroundColor: SKY }]}>
      <View style={[styles.ground, { top: GROUND, backgroundColor: SOIL }]} />

      {/* Fabric */}
      <View
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: GROUND - FABRIC_H,
          height: FABRIC_H,
          backgroundColor: FABRIC,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
        }}
      />

      {/* Posts */}
      {[80, 144, 208].map((x) => (
        <View
          key={x}
          style={{
            position: "absolute",
            left: x - 3,
            top: GROUND - FABRIC_H - 14,
            width: 6,
            height: FABRIC_H + 14,
            backgroundColor: POST,
            borderRadius: 2,
          }}
        />
      ))}

      {/* Sediment build-up */}
      <Animated.View
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: H - GROUND,
          height: sedH,
          backgroundColor: sedColour,
          borderRadius: 2,
        }}
      />

      {/* 1/3 threshold line */}
      <View
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: GROUND - THRESHOLD_Y,
          height: 1.5,
          backgroundColor: "#D62828",
          borderStyle: "dashed",
        }}
      />
      <View style={[styles.callout, { top: GROUND - THRESHOLD_Y - 22, left: 10 }]}>
        <Text style={[styles.calloutText, { color: "#D62828" }]}>⚠ Remove at 1/3 height</Text>
      </View>

      {/* Warning */}
      <Animated.View
        style={[
          styles.measureLabel,
          {
            top: 60,
            left: 80,
            right: 80,
            opacity: warnO,
            backgroundColor: "rgba(214,40,40,0.9)",
            alignItems: "center",
          },
        ]}
      >
        <Text style={styles.measureLabelText}>CLEAN OUT NOW</Text>
      </Animated.View>

      <View style={styles.specRow}>
        <View style={styles.specDot} />
        <Text style={styles.specText}>Remove sediment when it reaches 1/3 of fabric height</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: W, height: H, overflow: "hidden", borderRadius: 12 },
  ground: { position: "absolute", left: 0, right: 0, bottom: 0 },
  post: {
    position: "absolute",
    width: 8,
    height: 84,
    backgroundColor: POST,
    borderRadius: 3,
  },
  measureLabel: {
    position: "absolute",
    backgroundColor: LABEL_BG,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  measureLabelText: { color: "#fff", fontSize: 10, fontWeight: "700", lineHeight: 14 },
  topLabel: {
    position: "absolute",
    top: 8,
    alignSelf: "center",
    color: "#5A6B5E",
    fontSize: 11,
    fontStyle: "italic",
  },
  callout: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.88)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#DDD9D0",
  },
  calloutText: { fontSize: 10, color: "#1A2E1E", lineHeight: 14 },
  flowArrow: { width: 24, height: 10, backgroundColor: "rgba(79,195,247,0.7)", borderRadius: 4 },
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
