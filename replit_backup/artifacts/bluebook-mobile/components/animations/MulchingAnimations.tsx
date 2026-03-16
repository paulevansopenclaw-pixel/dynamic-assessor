import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

const W = 300;
const H = 220;

const SOIL = "#7B5E3A";
const STRAW = "#C9973A";
const STRAW_DARK = "#A8782A";
const HYDRO = "#6DAB6D";
const SKY = "#EAF4F8";
const GREEN_DARK = "#2D6A4F";
const LABEL_BG = "rgba(45,106,79,0.9)";

// ─────────────────────────────────────────────────────────────
// Animation 1: Straw Mulch Thickness (50 mm)
// ─────────────────────────────────────────────────────────────
export function MulchThicknessAnimation() {
  const mulchHeight = useRef(new Animated.Value(0)).current;
  const arrowOpacity = useRef(new Animated.Value(0)).current;
  const labelOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(400),
        Animated.parallel([
          Animated.timing(mulchHeight, {
            toValue: 1,
            duration: 1400,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
          }),
        ]),
        Animated.delay(400),
        Animated.parallel([
          Animated.timing(arrowOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(labelOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]),
        Animated.delay(2200),
        Animated.parallel([
          Animated.timing(mulchHeight, { toValue: 0, duration: 600, useNativeDriver: false }),
          Animated.timing(arrowOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(labelOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]),
        Animated.delay(600),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const GROUND_Y = 140;
  const MAX_MULCH_H = 54;

  const mulchH = mulchHeight.interpolate({ inputRange: [0, 1], outputRange: [0, MAX_MULCH_H] });
  const mulchY = mulchHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [GROUND_Y, GROUND_Y - MAX_MULCH_H],
  });

  return (
    <View style={[styles.container, { backgroundColor: SKY }]}>
      {/* Ground */}
      <View style={[styles.ground, { top: GROUND_Y, backgroundColor: SOIL }]} />

      {/* Straw Mulch Layer (grows upward) */}
      <Animated.View
        style={{
          position: "absolute",
          left: 20,
          right: 20,
          height: mulchH,
          top: mulchY,
          backgroundColor: STRAW,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          overflow: "hidden",
        }}
      >
        {/* Straw texture strips */}
        {[0, 10, 20, 30, 40].map((i) => (
          <View
            key={i}
            style={{
              position: "absolute",
              left: i * 52,
              top: 6,
              width: 40,
              height: 3,
              backgroundColor: STRAW_DARK,
              borderRadius: 2,
              opacity: 0.6,
            }}
          />
        ))}
        {[0, 10, 20, 30, 40].map((i) => (
          <View
            key={`b${i}`}
            style={{
              position: "absolute",
              left: i * 52 + 26,
              top: 18,
              width: 30,
              height: 3,
              backgroundColor: STRAW_DARK,
              borderRadius: 2,
              opacity: 0.5,
            }}
          />
        ))}
      </Animated.View>

      {/* Measurement arrow */}
      <Animated.View style={{ position: "absolute", right: 18, opacity: arrowOpacity }}>
        <Animated.View style={{ top: mulchY }}>
          <View style={styles.measureLine} />
          <View style={styles.measureArrowUp} />
        </Animated.View>
      </Animated.View>

      {/* 50mm label */}
      <Animated.View
        style={[
          styles.measureLabel,
          { right: 22, top: GROUND_Y - MAX_MULCH_H / 2 - 10, opacity: labelOpacity },
        ]}
      >
        <Text style={styles.measureLabelText}>50 mm</Text>
      </Animated.View>

      {/* Ground label */}
      <View style={[styles.groundLabel, { top: GROUND_Y + 8 }]}>
        <Text style={styles.groundLabelText}>Soil surface</Text>
      </View>

      {/* Bottom spec */}
      <View style={styles.specRow}>
        <View style={styles.specDot} />
        <Text style={styles.specText}>Min. 50 mm thickness · approx. 2.5 t/ha</Text>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Animation 2: Tack / Crimp on Slopes
// ─────────────────────────────────────────────────────────────
export function MulchTackCrimpAnimation() {
  const tackProgress = useRef(new Animated.Value(0)).current;
  const crimpY = useRef(new Animated.Value(0)).current;
  const crimpOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(400),
        Animated.parallel([
          Animated.timing(tackProgress, { toValue: 1, duration: 1600, useNativeDriver: false }),
          Animated.timing(crimpY, { toValue: 130, duration: 1800, useNativeDriver: false }),
          Animated.timing(crimpOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        ]),
        Animated.delay(2200),
        Animated.parallel([
          Animated.timing(tackProgress, { toValue: 0, duration: 500, useNativeDriver: false }),
          Animated.timing(crimpY, { toValue: 0, duration: 500, useNativeDriver: false }),
          Animated.timing(crimpOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]),
        Animated.delay(500),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const tackW = tackProgress.interpolate({ inputRange: [0, 1], outputRange: [0, 110] });
  const sprayOpacity = tackProgress.interpolate({ inputRange: [0, 0.3, 0.7, 1], outputRange: [0, 1, 1, 0] });

  return (
    <View style={[styles.container, { backgroundColor: SKY, flexDirection: "row" }]}>
      {/* LEFT PANEL: Tacked */}
      <View style={{ flex: 1, alignItems: "center", paddingTop: 10 }}>
        <View style={styles.panelLabel}>
          <Text style={styles.panelLabelText}>TACKED</Text>
        </View>
        {/* Slope background */}
        <View style={{ width: 130, height: 140, position: "relative", marginTop: 8 }}>
          <View style={[styles.slopeGround, { backgroundColor: SOIL }]} />
          {/* Mulch on slope */}
          <View style={[styles.slopeMulch, { backgroundColor: STRAW, opacity: 0.9 }]} />
          {/* Spray dots */}
          <Animated.View style={{ position: "absolute", top: 30, left: 10, opacity: sprayOpacity }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <View key={i} style={[styles.sprayDot, { left: i * 22, top: i % 2 === 0 ? 0 : 10 }]} />
            ))}
          </Animated.View>
          {/* Tack coverage bar */}
          <Animated.View
            style={{
              position: "absolute",
              bottom: 30,
              left: 8,
              height: 6,
              width: tackW,
              backgroundColor: "rgba(45,106,79,0.7)",
              borderRadius: 3,
            }}
          />
        </View>
        <Text style={styles.methodDesc}>Spray adhesive bonds{"\n"}mulch to slope</Text>
      </View>

      {/* Divider */}
      <View style={{ width: 1, backgroundColor: "#DDD9D0", marginVertical: 30 }} />

      {/* RIGHT PANEL: Crimped */}
      <View style={{ flex: 1, alignItems: "center", paddingTop: 10 }}>
        <View style={[styles.panelLabel, { backgroundColor: "#B45309" }]}>
          <Text style={styles.panelLabelText}>CRIMPED</Text>
        </View>
        <View style={{ width: 130, height: 140, position: "relative", marginTop: 8 }}>
          <View style={[styles.slopeGround, { backgroundColor: SOIL }]} />
          <View style={[styles.slopeMulch, { backgroundColor: STRAW, opacity: 0.9 }]} />
          {/* Crimp roller */}
          <Animated.View
            style={{
              position: "absolute",
              top: crimpY,
              left: 40,
              opacity: crimpOpacity,
            }}
          >
            <View style={styles.roller} />
            <View style={styles.rollerHandle} />
          </Animated.View>
          {/* Crimp marks */}
          <Animated.View style={{ position: "absolute", bottom: 28, left: 10, opacity: crimpOpacity }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <View key={i} style={[styles.crimpMark, { left: i * 20 }]} />
            ))}
          </Animated.View>
        </View>
        <Text style={styles.methodDesc}>Roller presses mulch{"\n"}into soil surface</Text>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Animation 3: Hydromulch Layers
// ─────────────────────────────────────────────────────────────
export function HydromulchLayersAnimation() {
  const layer1H = useRef(new Animated.Value(0)).current;
  const layer2H = useRef(new Animated.Value(0)).current;
  const layer3H = useRef(new Animated.Value(0)).current;
  const label1O = useRef(new Animated.Value(0)).current;
  const label2O = useRef(new Animated.Value(0)).current;
  const label3O = useRef(new Animated.Value(0)).current;
  const sprayO = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const LAYER_DUR = 800;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(300),
        Animated.timing(sprayO, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(layer1H, { toValue: 1, duration: LAYER_DUR, useNativeDriver: false }),
        Animated.timing(label1O, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(200),
        Animated.timing(layer2H, { toValue: 1, duration: LAYER_DUR, useNativeDriver: false }),
        Animated.timing(label2O, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(200),
        Animated.timing(layer3H, { toValue: 1, duration: LAYER_DUR, useNativeDriver: false }),
        Animated.timing(label3O, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(2000),
        Animated.parallel([
          Animated.timing(layer1H, { toValue: 0, duration: 500, useNativeDriver: false }),
          Animated.timing(layer2H, { toValue: 0, duration: 500, useNativeDriver: false }),
          Animated.timing(layer3H, { toValue: 0, duration: 500, useNativeDriver: false }),
          Animated.timing(label1O, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.timing(label2O, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.timing(label3O, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.timing(sprayO, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]),
        Animated.delay(600),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const GROUND_Y = 148;
  const LAYER_MAX = 18;
  const l1H = layer1H.interpolate({ inputRange: [0, 1], outputRange: [0, LAYER_MAX] });
  const l2H = layer2H.interpolate({ inputRange: [0, 1], outputRange: [0, LAYER_MAX] });
  const l3H = layer3H.interpolate({ inputRange: [0, 1], outputRange: [0, LAYER_MAX] });

  const LAYERS = [
    { h: l1H, op: label1O, colour: "#8BC34A", label: "Layer 1", yOff: 0 },
    { h: l2H, op: label2O, colour: "#66BB6A", label: "Layer 2", yOff: LAYER_MAX },
    { h: l3H, op: label3O, colour: "#4CAF50", label: "Layer 3", yOff: LAYER_MAX * 2 },
  ];

  return (
    <View style={[styles.container, { backgroundColor: SKY }]}>
      {/* Spray nozzle */}
      <Animated.View style={{ position: "absolute", top: 20, left: 120, opacity: sprayO }}>
        <View style={styles.sprayNozzle} />
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.sprayLine,
              {
                transform: [{ rotate: `${-30 + i * 20}deg` }],
                top: 14,
                left: 4 + i * 4,
              },
            ]}
          />
        ))}
        <Text style={[styles.specText, { marginTop: 6, color: "#457B9D" }]}>Hydromulch spray</Text>
      </Animated.View>

      {/* Ground */}
      <View style={[styles.ground, { top: GROUND_Y, backgroundColor: SOIL }]} />

      {/* Layers grow upward */}
      {LAYERS.map((layer, idx) => (
        <Animated.View
          key={idx}
          style={{
            position: "absolute",
            left: 30,
            right: 80,
            height: layer.h,
            top: GROUND_Y - (idx + 1) * LAYER_MAX,
            backgroundColor: layer.colour,
            opacity: 0.88,
          }}
        />
      ))}

      {/* Layer labels */}
      {LAYERS.map((layer, idx) => (
        <Animated.View
          key={`lbl${idx}`}
          style={[
            styles.measureLabel,
            {
              right: 14,
              top: GROUND_Y - (idx + 1) * LAYER_MAX - 4,
              opacity: layer.op,
            },
          ]}
        >
          <Text style={styles.measureLabelText}>{layer.label}</Text>
        </Animated.View>
      ))}

      <View style={styles.specRow}>
        <View style={styles.specDot} />
        <Text style={styles.specText}>2–3 layers per manufacturer spec</Text>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Animation 4: Timing — Apply within 24–48 hours of grading
// ─────────────────────────────────────────────────────────────
export function MulchTimingAnimation() {
  const step1O = useRef(new Animated.Value(0)).current;
  const step2O = useRef(new Animated.Value(0)).current;
  const step3O = useRef(new Animated.Value(0)).current;
  const step4O = useRef(new Animated.Value(0)).current;
  const clockAnim = useRef(new Animated.Value(0)).current;
  const warnO = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const STEP = 800;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(step1O, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.delay(STEP),
        Animated.timing(step2O, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.delay(STEP),
        Animated.parallel([
          Animated.timing(step3O, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(clockAnim, { toValue: 1, duration: 1500, useNativeDriver: false }),
          Animated.timing(warnO, { toValue: 1, duration: 800, useNativeDriver: true }),
        ]),
        Animated.delay(STEP),
        Animated.timing(step4O, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.delay(1800),
        Animated.parallel([
          Animated.timing(step1O, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(step2O, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(step3O, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(step4O, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(clockAnim, { toValue: 0, duration: 400, useNativeDriver: false }),
          Animated.timing(warnO, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]),
        Animated.delay(600),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const clockW = clockAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });

  const steps = [
    { opacity: step1O, icon: "⛏", label: "Final grading\ncompleted", colour: "#457B9D" },
    { opacity: step2O, icon: "🏜", label: "Bare soil\nexposed", colour: "#B45309" },
    { opacity: step3O, icon: "⏱", label: "24–48 hr\nwindow", colour: "#D62828" },
    { opacity: step4O, icon: "✅", label: "Mulch\napplied", colour: GREEN_DARK },
  ];

  return (
    <View style={[styles.container, { backgroundColor: SKY, paddingHorizontal: 10, paddingTop: 16 }]}>
      <Text style={[styles.specText, { textAlign: "center", fontWeight: "700", marginBottom: 14, color: GREEN_DARK }]}>
        Timing Sequence
      </Text>

      <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 12 }}>
        {steps.map((step, idx) => (
          <Animated.View key={idx} style={{ alignItems: "center", opacity: step.opacity, width: 64 }}>
            <View style={[styles.stepCircle, { borderColor: step.colour }]}>
              <Text style={{ fontSize: 18 }}>{step.icon}</Text>
            </View>
            <Text style={[styles.methodDesc, { color: step.colour, marginTop: 4, textAlign: "center" }]}>
              {step.label}
            </Text>
          </Animated.View>
        ))}
      </View>

      {/* Progress bar: 24-48hr clock */}
      <Animated.View style={{ opacity: step3O }}>
        <View style={[styles.progressTrack]}>
          <Animated.View style={[styles.progressFill, { width: clockW }]} />
        </View>
        <Animated.View style={{ opacity: warnO }}>
          <View style={[styles.specRow, { marginTop: 6 }]}>
            <View style={[styles.specDot, { backgroundColor: "#D62828" }]} />
            <Text style={[styles.specText, { color: "#D62828" }]}>
              After 48 hours, erosion risk increases significantly
            </Text>
          </View>
        </Animated.View>
      </Animated.View>

      <View style={styles.specRow}>
        <View style={styles.specDot} />
        <Text style={styles.specText}>Apply within 24–48 hours of final grading</Text>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Shared styles
// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { width: W, height: H, overflow: "hidden", borderRadius: 12 },
  ground: { position: "absolute", left: 0, right: 0, bottom: 0, height: 80 },
  measureLine: { width: 2, height: 54, backgroundColor: GREEN_DARK, alignSelf: "center" },
  measureArrowUp: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: GREEN_DARK,
    alignSelf: "center",
    marginTop: -54,
  },
  measureLabel: {
    position: "absolute",
    backgroundColor: LABEL_BG,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  measureLabelText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  groundLabel: { position: "absolute", left: 10 },
  groundLabelText: { color: "rgba(255,255,255,0.7)", fontSize: 11 },
  specRow: {
    position: "absolute",
    bottom: 6,
    left: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  specDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: GREEN_DARK, marginTop: 4 },
  specText: { fontSize: 11, color: "#5A6B5E", flex: 1, lineHeight: 15 },

  // Panels
  panelLabel: {
    backgroundColor: GREEN_DARK,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  panelLabelText: { color: "#fff", fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
  methodDesc: { fontSize: 10, color: "#5A6B5E", textAlign: "center", lineHeight: 14 },

  slopeGround: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    borderTopLeftRadius: 8,
  },
  slopeMulch: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 58,
    height: 18,
    borderTopLeftRadius: 4,
  },
  sprayDot: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(69,123,157,0.8)",
  },
  roller: { width: 40, height: 16, borderRadius: 8, backgroundColor: "#616161" },
  rollerHandle: { width: 4, height: 20, backgroundColor: "#424242", alignSelf: "center" },
  crimpMark: {
    position: "absolute",
    top: 0,
    width: 3,
    height: 12,
    backgroundColor: STRAW_DARK,
    borderRadius: 1,
  },

  // Hydromulch
  sprayNozzle: { width: 20, height: 30, backgroundColor: "#546E7A", borderRadius: 4 },
  sprayLine: { position: "absolute", width: 2, height: 20, backgroundColor: "rgba(69,123,157,0.6)", borderRadius: 1 },

  // Timeline
  stepCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  progressTrack: {
    height: 8,
    backgroundColor: "#DDD9D0",
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  progressFill: { height: 8, backgroundColor: "#D62828", borderRadius: 4 },
});
