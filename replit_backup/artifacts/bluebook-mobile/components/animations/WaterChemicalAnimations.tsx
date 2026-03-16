import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

const W = 300;
const H = 220;
const SOIL = "#7B5E3A";
const CONCRETE_GREY = "#9E9E9E";
const WATER_LIGHT = "#4FC3F7";
const ALERT_RED = "#D62828";
const GREEN = "#2D6A4F";
const LABEL_BG = "rgba(45,106,79,0.9)";
const SKY = "#EAF4F8";
const POLY_BLUE = "#B3E5FC";

// ──────────────────────────────────────────────────
// CONCRETE WASHOUT: Lined pit with bund walls
// ──────────────────────────────────────────────────
export function ConcreteWashoutLinerAnimation() {
  const linerO = useRef(new Animated.Value(0)).current;
  const washwaterH = useRef(new Animated.Value(0)).current;
  const warnO = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.timing(linerO, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.delay(400),
        Animated.timing(washwaterH, { toValue: 1, duration: 1600, useNativeDriver: false }),
        Animated.delay(600),
        Animated.timing(warnO, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.delay(1800),
        Animated.parallel([
          Animated.timing(linerO, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(washwaterH, { toValue: 0, duration: 500, useNativeDriver: false }),
          Animated.timing(warnO, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]),
        Animated.delay(500),
      ])
    );
    a.start();
    return () => a.stop();
  }, []);

  const PIT_LEFT = 60;
  const PIT_TOP = 50;
  const PIT_W = 180;
  const PIT_H = 100;
  const BUND_H = 16;

  const waterH = washwaterH.interpolate({ inputRange: [0, 1], outputRange: [0, PIT_H - 24] });

  return (
    <View style={[styles.container, { backgroundColor: "#F5F3EE" }]}>
      {/* Ground */}
      <View style={[styles.ground, { top: PIT_TOP + PIT_H + BUND_H, backgroundColor: SOIL }]} />

      {/* Liner (animated) */}
      <Animated.View
        style={{
          position: "absolute",
          left: PIT_LEFT - 4,
          top: PIT_TOP - 4,
          width: PIT_W + 8,
          height: PIT_H + 8,
          backgroundColor: POLY_BLUE,
          borderRadius: 6,
          opacity: linerO,
        }}
      />

      {/* Pit walls */}
      <View style={{ position: "absolute", left: PIT_LEFT, top: PIT_TOP, width: PIT_W, height: PIT_H, borderWidth: 3, borderColor: CONCRETE_GREY, backgroundColor: "transparent" }} />

      {/* Earth bunds (sides) */}
      <View style={{ position: "absolute", left: PIT_LEFT - 16, top: PIT_TOP + PIT_H - 4, width: 16, height: BUND_H + 4, backgroundColor: SOIL, borderRadius: 3 }} />
      <View style={{ position: "absolute", left: PIT_LEFT + PIT_W, top: PIT_TOP + PIT_H - 4, width: 16, height: BUND_H + 4, backgroundColor: SOIL, borderRadius: 3 }} />

      {/* Wash water filling */}
      <Animated.View
        style={{
          position: "absolute",
          left: PIT_LEFT + 3,
          bottom: H - (PIT_TOP + PIT_H) + 3,
          width: PIT_W - 6,
          height: waterH,
          backgroundColor: "rgba(189,189,189,0.7)",
        }}
      />

      {/* Liner label */}
      <Animated.View style={[styles.measureLabel, { top: PIT_TOP - 20, left: PIT_LEFT, opacity: linerO }]}>
        <Text style={styles.measureLabelText}>200µm poly liner</Text>
      </Animated.View>

      {/* No drain sign */}
      <Animated.View style={[styles.callout, { bottom: 36, right: 10, opacity: warnO }]}>
        <Text style={[styles.calloutText, { color: ALERT_RED }]}>✗ No stormwater drain connection</Text>
      </Animated.View>

      <View style={styles.specRow}>
        <View style={styles.specDot} />
        <Text style={styles.specText}>200µm impermeable liner · bunded all sides · no drain outlet inside</Text>
      </View>
    </View>
  );
}

// 50m distance from waterway
export function WashoutDistanceAnimation() {
  const distO = useRef(new Animated.Value(0)).current;
  const arrowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.timing(distO, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(arrowAnim, { toValue: 1, duration: 1000, useNativeDriver: false }),
        Animated.delay(2400),
        Animated.parallel([
          Animated.timing(distO, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(arrowAnim, { toValue: 0, duration: 400, useNativeDriver: false }),
        ]),
        Animated.delay(500),
      ])
    );
    a.start();
    return () => a.stop();
  }, []);

  const arrowW = arrowAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 120] });

  return (
    <View style={[styles.container, { backgroundColor: "#E8F5E9" }]}>
      {/* Waterway */}
      <View style={{ position: "absolute", left: 0, top: 70, width: 60, bottom: 0, backgroundColor: WATER_LIGHT, opacity: 0.8 }}>
        <Text style={{ color: "#fff", fontSize: 9, fontWeight: "700", textAlign: "center", marginTop: 8 }}>WATERWAY</Text>
      </View>

      {/* Buffer zone */}
      <Animated.View
        style={{
          position: "absolute",
          left: 60,
          top: 70,
          width: arrowW,
          bottom: 0,
          backgroundColor: "rgba(244,162,97,0.25)",
          borderLeftWidth: 2,
          borderRightWidth: 2,
          borderColor: "#F4A261",
          opacity: distO,
        }}
      />

      {/* 50m label */}
      <Animated.View style={[styles.measureLabel, { top: 82, left: 90, opacity: distO }]}>
        <Text style={styles.measureLabelText}>Min. 50 m</Text>
      </Animated.View>

      {/* Washout area */}
      <Animated.View
        style={{
          position: "absolute",
          left: 60,
          left: arrowAnim.interpolate({ inputRange: [0, 1], outputRange: [60, 190] }),
          top: 80,
          width: 80,
          height: 60,
          backgroundColor: "#9E9E9E",
          borderRadius: 6,
          alignItems: "center",
          justifyContent: "center",
          opacity: distO,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 9, fontWeight: "700", textAlign: "center" }}>CONCRETE{"\n"}WASHOUT</Text>
      </Animated.View>

      <View style={styles.specRow}>
        <View style={styles.specDot} />
        <Text style={styles.specText}>Minimum 50 m from any waterway, drain, or stormwater inlet</Text>
      </View>
    </View>
  );
}

// ──────────────────────────────────────────────────
// FUEL BUNDING: 110% capacity rule
// ──────────────────────────────────────────────────
export function FuelBund110Animation() {
  const containerO = useRef(new Animated.Value(0)).current;
  const spillH = useRef(new Animated.Value(0)).current;
  const labelO = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.timing(containerO, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.delay(400),
        Animated.timing(spillH, { toValue: 1, duration: 1400, useNativeDriver: false }),
        Animated.timing(labelO, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.delay(2000),
        Animated.parallel([
          Animated.timing(containerO, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(spillH, { toValue: 0, duration: 500, useNativeDriver: false }),
          Animated.timing(labelO, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]),
        Animated.delay(600),
      ])
    );
    a.start();
    return () => a.stop();
  }, []);

  const BUND_LEFT = 40;
  const BUND_TOP = 40;
  const BUND_W = 220;
  const BUND_H = 110;
  const CONTAINER_H = 70;

  const fuelH = spillH.interpolate({ inputRange: [0, 1], outputRange: [0, BUND_H - 16] });
  const fuelColour = spillH.interpolate({
    inputRange: [0, 0.8, 0.81, 1],
    outputRange: ["#F4A261", "#F4A261", ALERT_RED, ALERT_RED],
  });

  return (
    <View style={[styles.container, { backgroundColor: "#F5F3EE" }]}>
      {/* Ground */}
      <View style={[styles.ground, { top: BUND_TOP + BUND_H + 4, backgroundColor: SOIL }]} />

      {/* Bund walls */}
      <Animated.View
        style={{
          position: "absolute",
          left: BUND_LEFT,
          top: BUND_TOP,
          width: BUND_W,
          height: BUND_H,
          borderWidth: 4,
          borderColor: CONCRETE_GREY,
          borderRadius: 4,
          backgroundColor: "transparent",
          opacity: containerO,
        }}
      />

      {/* Fuel container (IBC) */}
      <Animated.View
        style={{
          position: "absolute",
          left: BUND_LEFT + 70,
          top: BUND_TOP + BUND_H - CONTAINER_H - 4,
          width: 80,
          height: CONTAINER_H,
          backgroundColor: "#455A64",
          borderRadius: 4,
          opacity: containerO,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>FUEL</Text>
      </Animated.View>

      {/* Spilled fuel in bund */}
      <Animated.View
        style={{
          position: "absolute",
          left: BUND_LEFT + 4,
          bottom: H - (BUND_TOP + BUND_H) + 4,
          width: BUND_W - 8,
          height: fuelH,
          backgroundColor: fuelColour,
          opacity: 0.6,
        }}
      />

      {/* 110% label */}
      <Animated.View style={[styles.measureLabel, { top: BUND_TOP - 22, left: BUND_LEFT, opacity: labelO }]}>
        <Text style={styles.measureLabelText}>Bund holds 110% of largest container</Text>
      </Animated.View>

      <View style={styles.specRow}>
        <View style={styles.specDot} />
        <Text style={styles.specText}>Bund capacity ≥ 110% of the largest single container stored within</Text>
      </View>
    </View>
  );
}

// DUST: Water cart coverage animation
export function DustWaterCartAnimation() {
  const cartX = useRef(new Animated.Value(0)).current;
  const wetW = useRef(new Animated.Value(0)).current;
  const dustO = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.delay(400),
        Animated.parallel([
          Animated.timing(cartX, { toValue: 1, duration: 2000, useNativeDriver: false }),
          Animated.timing(wetW, { toValue: 1, duration: 2200, useNativeDriver: false }),
          Animated.timing(dustO, { toValue: 0, duration: 1800, useNativeDriver: true }),
        ]),
        Animated.delay(800),
        Animated.parallel([
          Animated.timing(cartX, { toValue: 0, duration: 0, useNativeDriver: false }),
          Animated.timing(wetW, { toValue: 0, duration: 0, useNativeDriver: false }),
          Animated.timing(dustO, { toValue: 1, duration: 0, useNativeDriver: true }),
        ]),
        Animated.delay(400),
      ])
    );
    a.start();
    return () => a.stop();
  }, []);

  const GROUND_Y = 130;
  const cartLeft = cartX.interpolate({ inputRange: [0, 1], outputRange: [20, 220] });
  const wetWidth = wetW.interpolate({ inputRange: [0, 1], outputRange: [0, 200] });

  return (
    <View style={[styles.container, { backgroundColor: SKY }]}>
      {/* Ground / road */}
      <View style={{ position: "absolute", left: 0, right: 0, top: GROUND_Y, height: 40, backgroundColor: "#B0BEC5" }} />
      <View style={{ position: "absolute", left: 0, right: 0, top: GROUND_Y + 40, bottom: 0, backgroundColor: SOIL }} />

      {/* Dust cloud */}
      <Animated.View style={{ position: "absolute", top: 50, left: 40, opacity: dustO }}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={{
              position: "absolute",
              left: i * 50,
              top: i * 8,
              width: 60,
              height: 30,
              borderRadius: 30,
              backgroundColor: "rgba(193,154,107,0.5)",
            }}
          />
        ))}
      </Animated.View>

      {/* Wet road trail */}
      <Animated.View
        style={{
          position: "absolute",
          left: 20,
          top: GROUND_Y,
          width: wetWidth,
          height: 40,
          backgroundColor: "rgba(79,195,247,0.4)",
        }}
      />

      {/* Water cart */}
      <Animated.View style={{ position: "absolute", left: cartLeft, top: GROUND_Y - 28 }}>
        <View style={{ width: 50, height: 28, backgroundColor: "#1565C0", borderRadius: 4 }}>
          <Text style={{ color: "#fff", fontSize: 8, fontWeight: "700", textAlign: "center", marginTop: 8 }}>WATER</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 2 }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#212121" }} />
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#212121" }} />
        </View>
      </Animated.View>

      {/* Spray droplets */}
      <Animated.View style={{ position: "absolute", left: cartLeft, top: GROUND_Y - 10, opacity: 0.7 }}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={{ position: "absolute", left: i * 10 - 5, top: 0, width: 4, height: 12, backgroundColor: WATER_LIGHT, borderRadius: 2, transform: [{ rotate: "15deg" }] }} />
        ))}
      </Animated.View>

      <View style={styles.specRow}>
        <View style={styles.specDot} />
        <Text style={styles.specText}>Water cart suppresses dust on haul roads — minimum every 2 hours</Text>
      </View>
    </View>
  );
}

// DRAIN PROTECTION: Filter bag over pit
export function DrainFilterBagAnimation() {
  const bagDrop = useRef(new Animated.Value(0)).current;
  const sedO = useRef(new Animated.Value(0)).current;
  const filterO = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(bagDrop, { toValue: 1, duration: 900, useNativeDriver: false }),
        Animated.delay(300),
        Animated.timing(sedO, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(filterO, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.delay(1600),
        Animated.parallel([
          Animated.timing(bagDrop, { toValue: 0, duration: 500, useNativeDriver: false }),
          Animated.timing(sedO, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(filterO, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]),
        Animated.delay(500),
      ])
    );
    a.start();
    return () => a.stop();
  }, []);

  const PIT_LEFT = 80;
  const PIT_TOP = 60;
  const PIT_W = 140;
  const PIT_H = 80;

  const bagTop = bagDrop.interpolate({ inputRange: [0, 1], outputRange: [PIT_TOP - 60, PIT_TOP - 2] });

  return (
    <View style={[styles.container, { backgroundColor: "#F5F3EE" }]}>
      {/* Road surface */}
      <View style={{ position: "absolute", left: 0, right: 0, top: PIT_TOP - 8, height: 8, backgroundColor: "#B0BEC5" }} />
      <View style={{ position: "absolute", left: 0, right: 0, top: PIT_TOP + PIT_H, bottom: 0, backgroundColor: SOIL }} />

      {/* Stormwater pit */}
      <View
        style={{
          position: "absolute",
          left: PIT_LEFT,
          top: PIT_TOP,
          width: PIT_W,
          height: PIT_H,
          backgroundColor: "#455A64",
          borderRadius: 4,
          borderWidth: 3,
          borderColor: "#37474F",
        }}
      >
        <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 9, fontWeight: "700", textAlign: "center", marginTop: 10 }}>STORMWATER PIT</Text>
      </View>

      {/* Runoff flow arrows */}
      {[0, 1].map((i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            left: 30 + i * 190,
            top: PIT_TOP - 22,
            width: 4,
            height: 16,
            backgroundColor: WATER_LIGHT,
            borderRadius: 2,
          }}
        />
      ))}

      {/* Filter bag */}
      <Animated.View
        style={{
          position: "absolute",
          left: PIT_LEFT + 10,
          top: bagTop,
          width: PIT_W - 20,
          height: 28,
          backgroundColor: "#D6C9A8",
          borderRadius: 4,
          borderWidth: 2,
          borderColor: "#A8956A",
          zIndex: 2,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 9, color: "#5D4E37", fontWeight: "700" }}>FILTER BAG</Text>
      </Animated.View>

      {/* ✓ label */}
      <Animated.View style={[styles.measureLabel, { bottom: 36, right: 12, opacity: filterO }]}>
        <Text style={styles.measureLabelText}>✓ Sediment captured</Text>
      </Animated.View>

      <View style={styles.specRow}>
        <View style={styles.specDot} />
        <Text style={styles.specText}>Filter bag secured over pit inlet — clean when 50% full</Text>
      </View>
    </View>
  );
}

// DIVERSION DRAIN: upslope clean run-on diversion
export function DiversionDrainAnimation() {
  const flow1O = useRef(new Animated.Value(0)).current;
  const flow2O = useRef(new Animated.Value(0)).current;
  const drainO = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.timing(drainO, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(flow1O, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.delay(200),
        Animated.timing(flow2O, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.delay(1600),
        Animated.parallel([
          Animated.timing(drainO, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(flow1O, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(flow2O, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]),
        Animated.delay(500),
      ])
    );
    a.start();
    return () => a.stop();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: "#E8F5E9" }]}>
      <Text style={styles.topLabel}>Top-down view</Text>

      {/* Slope bands */}
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={{ position: "absolute", top: 28 + i * 40, left: 0, right: 0, height: 38, backgroundColor: i % 2 === 0 ? "#C8E6C9" : "#A5D6A7" }} />
      ))}

      {/* DISTURBED AREA */}
      <View style={{ position: "absolute", left: 100, top: 60, width: 120, height: 100, backgroundColor: "#D4A853", opacity: 0.6, borderRadius: 4 }}>
        <Text style={{ textAlign: "center", fontSize: 9, color: "#5D4037", fontWeight: "700", marginTop: 40 }}>DISTURBED{"\n"}AREA</Text>
      </View>

      {/* Diversion drain (upslope) */}
      <Animated.View
        style={{
          position: "absolute",
          left: 30,
          top: 54,
          width: 240,
          height: 12,
          backgroundColor: WATER_LIGHT,
          borderRadius: 3,
          opacity: drainO,
        }}
      />
      <Animated.View style={[styles.measureLabel, { top: 36, left: 40, opacity: drainO }]}>
        <Text style={styles.measureLabelText}>Diversion drain (upslope)</Text>
      </Animated.View>

      {/* Clean flow diverted around */}
      <Animated.View style={{ position: "absolute", top: 54, left: 20, opacity: flow1O }}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={{ position: "absolute", left: i * 28, top: 4, width: 16, height: 4, backgroundColor: WATER_LIGHT, borderRadius: 2 }} />
        ))}
      </Animated.View>

      {/* Flow going around disturbed area */}
      <Animated.View style={{ position: "absolute", top: 80, left: 20, opacity: flow2O }}>
        <View style={{ width: 4, height: 80, backgroundColor: WATER_LIGHT, borderRadius: 2 }} />
        <View style={[styles.callout, { top: 20, left: 12 }]}>
          <Text style={styles.calloutText}>Clean flow{"\n"}diverted around</Text>
        </View>
      </Animated.View>

      <View style={styles.specRow}>
        <View style={styles.specDot} />
        <Text style={styles.specText}>Installed upslope — diverts clean run-on around disturbed areas</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: W, height: H, overflow: "hidden", borderRadius: 12 },
  ground: { position: "absolute", left: 0, right: 0, bottom: 0 },
  measureLabel: {
    position: "absolute",
    backgroundColor: LABEL_BG,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 5,
  },
  measureLabelText: { color: "#fff", fontSize: 10, fontWeight: "700", lineHeight: 14 },
  topLabel: { position: "absolute", top: 8, alignSelf: "center", color: "#5A6B5E", fontSize: 11, fontStyle: "italic" },
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
