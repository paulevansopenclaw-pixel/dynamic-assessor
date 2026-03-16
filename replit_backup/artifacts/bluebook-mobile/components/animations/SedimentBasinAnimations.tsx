import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

const W = 300;
const H = 220;
const SOIL = "#7B5E3A";
const WATER_DARK = "#1565C0";
const WATER_LIGHT = "#4FC3F7";
const GREEN = "#2D6A4F";
const LABEL_BG = "rgba(45,106,79,0.9)";
const SKY = "#EAF4F8";

// Basin cross-section: outlet 300mm above sediment zone
export function BasinOutletLevelAnimation() {
  const waterRise = useRef(new Animated.Value(0)).current;
  const labelO = useRef(new Animated.Value(0)).current;
  const outletPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(waterRise, { toValue: 1, duration: 1800, useNativeDriver: false }),
        Animated.timing(labelO, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(outletPulse, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(outletPulse, { toValue: 0, duration: 600, useNativeDriver: true }),
        Animated.timing(outletPulse, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.delay(1000),
        Animated.parallel([
          Animated.timing(waterRise, { toValue: 0, duration: 700, useNativeDriver: false }),
          Animated.timing(labelO, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(outletPulse, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]),
        Animated.delay(500),
      ])
    );
    a.start();
    return () => a.stop();
  }, []);

  const BASIN_TOP = 40;
  const BASIN_H = 120;
  const SED_ZONE = 30;
  const OUTLET_Y = BASIN_TOP + BASIN_H - SED_ZONE - 20; // 300mm above sediment zone

  const waterH = waterRise.interpolate({ inputRange: [0, 1], outputRange: [0, BASIN_H - SED_ZONE - 22] });
  const waterTop = waterRise.interpolate({
    inputRange: [0, 1],
    outputRange: [BASIN_TOP + BASIN_H, OUTLET_Y],
  });

  return (
    <View style={[styles.container, { backgroundColor: SKY }]}>
      <Text style={styles.topLabel}>Basin cross-section</Text>

      {/* Basin walls */}
      <View style={{ position: "absolute", left: 30, top: BASIN_TOP, width: 240, height: BASIN_H, borderWidth: 3, borderColor: SOIL, borderRadius: 4, backgroundColor: "transparent" }} />

      {/* Sediment storage zone */}
      <View style={{ position: "absolute", left: 33, top: BASIN_TOP + BASIN_H - SED_ZONE, width: 234, height: SED_ZONE - 2, backgroundColor: "#C4A882", borderRadius: 2 }}>
        <View style={[styles.label, { top: 6 }]}><Text style={styles.labelT}>Sediment storage zone (0.5 m)</Text></View>
      </View>

      {/* Water rising */}
      <Animated.View
        style={{
          position: "absolute",
          left: 33,
          width: 234,
          top: waterTop,
          height: waterH,
          backgroundColor: "rgba(79,195,247,0.55)",
        }}
      />

      {/* Outlet pipe */}
      <Animated.View
        style={{
          position: "absolute",
          right: 28,
          top: OUTLET_Y - 6,
          width: 14,
          height: 12,
          backgroundColor: "#616161",
          borderRadius: 3,
          opacity: outletPulse.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }),
        }}
      />

      {/* Outlet label */}
      <Animated.View style={[styles.measureLabel, { right: 50, top: OUTLET_Y - 14, opacity: labelO }]}>
        <Text style={styles.measureLabelText}>Outlet: 300 mm{"\n"}above sed. zone</Text>
      </Animated.View>

      {/* Vertical measurement line */}
      <Animated.View
        style={{
          position: "absolute",
          right: 46,
          top: BASIN_TOP + BASIN_H - SED_ZONE - 20,
          width: 2,
          height: 20,
          backgroundColor: GREEN,
          opacity: labelO,
        }}
      />

      <View style={styles.specRow}>
        <View style={styles.specDot} />
        <Text style={styles.specText}>Outlet structure minimum 300 mm above the sediment storage zone</Text>
      </View>
    </View>
  );
}

// Sediment fill gauge — clean at 50%
export function BasinFillGaugeAnimation() {
  const fillLevel = useRef(new Animated.Value(0)).current;
  const warnO = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.timing(fillLevel, { toValue: 1, duration: 2800, useNativeDriver: false }),
        Animated.timing(warnO, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.delay(1800),
        Animated.parallel([
          Animated.timing(fillLevel, { toValue: 0.05, duration: 600, useNativeDriver: false }),
          Animated.timing(warnO, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]),
        Animated.delay(800),
      ])
    );
    a.start();
    return () => a.stop();
  }, []);

  const GAUGE_H = 130;
  const GAUGE_LEFT = 100;

  const fillH = fillLevel.interpolate({ inputRange: [0, 1], outputRange: [0, GAUGE_H] });
  const fillColour = fillLevel.interpolate({
    inputRange: [0, 0.5, 0.51, 1],
    outputRange: ["#4FC3F7", "#4FC3F7", "#D62828", "#D62828"],
  });

  return (
    <View style={[styles.container, { backgroundColor: SKY }]}>
      {/* Gauge column */}
      <View
        style={{
          position: "absolute",
          left: GAUGE_LEFT,
          top: 28,
          width: 60,
          height: GAUGE_H + 8,
          borderWidth: 2.5,
          borderColor: "#616161",
          borderRadius: 6,
          overflow: "hidden",
          backgroundColor: "#E0E0E0",
        }}
      >
        {/* Fill */}
        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: fillH,
            backgroundColor: fillColour,
          }}
        />
      </View>

      {/* 50% threshold line */}
      <View
        style={{
          position: "absolute",
          left: GAUGE_LEFT - 12,
          right: 100,
          top: 28 + GAUGE_H / 2,
          height: 2,
          backgroundColor: "#D62828",
        }}
      />
      <View style={[styles.callout, { left: 8, top: 28 + GAUGE_H / 2 - 14 }]}>
        <Text style={[styles.calloutText, { color: "#D62828" }]}>50% → Clean out!</Text>
      </View>

      {/* 100% label */}
      <Text style={[styles.specText, { position: "absolute", left: 168, top: 28, color: "#5A6B5E" }]}>100% ←</Text>
      <Text style={[styles.specText, { position: "absolute", left: 168, top: 28 + GAUGE_H - 14, color: "#5A6B5E" }]}>0% ←</Text>

      {/* Warning */}
      <Animated.View
        style={[
          styles.measureLabel,
          {
            top: 110,
            left: 32,
            right: 32,
            alignItems: "center",
            opacity: warnO,
            backgroundColor: "rgba(214,40,40,0.9)",
          },
        ]}
      >
        <Text style={styles.measureLabelText}>SEDIMENT STORAGE ZONE FULL — EXCAVATE NOW</Text>
      </Animated.View>

      <View style={styles.specRow}>
        <View style={styles.specDot} />
        <Text style={styles.specText}>Remove sediment when storage zone reaches 50% capacity</Text>
      </View>
    </View>
  );
}

// Outlet energy dissipation (rip-rap)
export function BasinOutletRipRapAnimation() {
  const waterFlow = useRef(new Animated.Value(0)).current;
  const ripRapO = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.timing(ripRapO, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(waterFlow, { toValue: 1, duration: 1600, useNativeDriver: false }),
        Animated.delay(1000),
        Animated.timing(waterFlow, { toValue: 0, duration: 400, useNativeDriver: false }),
        Animated.delay(400),
      ])
    );
    a.start();
    return () => a.stop();
  }, []);

  const flowX = waterFlow.interpolate({ inputRange: [0, 1], outputRange: [100, 260] });

  return (
    <View style={[styles.container, { backgroundColor: SKY }]}>
      {/* Ground */}
      <View style={[styles.ground, { top: 130, backgroundColor: SOIL }]} />

      {/* Pipe */}
      <View style={{ position: "absolute", left: 30, top: 100, width: 80, height: 18, backgroundColor: "#616161", borderRadius: 3 }} />

      {/* Rip-Rap rocks */}
      <Animated.View style={{ position: "absolute", left: 108, top: 108, opacity: ripRapO }}>
        {[
          { x: 0, y: 0, s: 22 }, { x: 22, y: -4, s: 18 }, { x: 40, y: 2, s: 20 },
          { x: 60, y: -2, s: 16 }, { x: 0, y: 18, s: 16 }, { x: 18, y: 16, s: 20 },
          { x: 38, y: 18, s: 18 }, { x: 58, y: 14, s: 22 },
        ].map((r, i) => (
          <View
            key={i}
            style={{
              position: "absolute",
              left: r.x,
              top: r.y,
              width: r.s,
              height: r.s - 4,
              backgroundColor: "#78909C",
              borderRadius: r.s / 3,
            }}
          />
        ))}
      </Animated.View>

      {/* Water flowing through */}
      <Animated.View
        style={{
          position: "absolute",
          left: 100,
          top: 107,
          width: waterFlow.interpolate({ inputRange: [0, 1], outputRange: [0, 90] }),
          height: 6,
          backgroundColor: WATER_LIGHT,
          opacity: 0.7,
        }}
      />

      <Animated.View style={[styles.callout, { top: 56, left: 90, opacity: ripRapO }]}>
        <Text style={styles.calloutText}>Rock rip-rap{"\n"}dissipates energy</Text>
      </Animated.View>

      <View style={styles.specRow}>
        <View style={styles.specDot} />
        <Text style={styles.specText}>Outlet protected with rock rip-rap or energy dissipation</Text>
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
  label: { position: "absolute", left: 4, right: 4, alignItems: "center" },
  labelT: { fontSize: 9, color: "#5D4E37", fontWeight: "600" },
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
