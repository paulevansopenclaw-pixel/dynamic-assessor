import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

const W = 300;
const H = 220;
const SOIL = "#7B5E3A";
const GREEN = "#2D6A4F";
const GREEN_VEG = "#66BB6A";
const LABEL_BG = "rgba(45,106,79,0.9)";
const SKY = "#EAF4F8";
const ALERT_RED = "#D62828";

// ─── STABILISED ENTRY: crushed rock 150mm depth ───
export function StabilisedEntryRockDepthAnimation() {
  const rockH = useRef(new Animated.Value(0)).current;
  const truckX = useRef(new Animated.Value(-80)).current;
  const labelO = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.delay(300),
        Animated.timing(rockH, { toValue: 1, duration: 1000, useNativeDriver: false }),
        Animated.timing(labelO, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.delay(400),
        Animated.timing(truckX, { toValue: 260, duration: 2000, useNativeDriver: true }),
        Animated.delay(600),
        Animated.parallel([
          Animated.timing(rockH, { toValue: 0, duration: 500, useNativeDriver: false }),
          Animated.timing(labelO, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(truckX, { toValue: -80, duration: 0, useNativeDriver: true }),
        ]),
        Animated.delay(500),
      ])
    );
    a.start();
    return () => a.stop();
  }, []);

  const GROUND = 120;
  const ROCK_MAX = 28;
  const GEOTEX_H = 6;

  const layerH = rockH.interpolate({ inputRange: [0, 1], outputRange: [0, ROCK_MAX] });

  return (
    <View style={[styles.container, { backgroundColor: SKY }]}>
      {/* Ground/subgrade */}
      <View style={{ position: "absolute", left: 0, right: 0, top: GROUND + GEOTEX_H + ROCK_MAX, bottom: 0, backgroundColor: SOIL }} />

      {/* Geotextile */}
      <View style={{ position: "absolute", left: 20, right: 20, top: GROUND + ROCK_MAX, height: GEOTEX_H, backgroundColor: "#D6C9A8" }} />

      {/* Crushed rock layer */}
      <Animated.View
        style={{
          position: "absolute",
          left: 20,
          right: 20,
          top: GROUND,
          height: layerH,
          backgroundColor: "#78909C",
          borderRadius: 3,
        }}
      />

      {/* Rock texture */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            left: 25 + i * 38,
            top: GROUND + 4,
            width: 22,
            height: 14,
            backgroundColor: "#90A4AE",
            borderRadius: 6,
            opacity: 0.8,
          }}
        />
      ))}

      {/* 150mm label */}
      <Animated.View style={[styles.measureLabel, { left: 6, top: GROUND - 8, opacity: labelO }]}>
        <Text style={styles.measureLabelText}>150 mm min depth</Text>
      </Animated.View>
      <Animated.View style={{ position: "absolute", left: 6, top: GROUND, width: 2, height: ROCK_MAX, backgroundColor: GREEN, opacity: labelO }} />

      {/* Truck */}
      <Animated.View style={{ position: "absolute", top: GROUND - 36, transform: [{ translateX: truckX }] }}>
        <View style={{ width: 60, height: 30, backgroundColor: "#F57F17", borderRadius: 4 }}>
          <Text style={{ color: "#fff", fontSize: 8, fontWeight: "700", textAlign: "center", marginTop: 10 }}>TRUCK</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 2 }}>
          <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#212121" }} />
          <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#212121" }} />
        </View>
      </Animated.View>

      <View style={styles.specRow}>
        <View style={styles.specDot} />
        <Text style={styles.specText}>Crushed rock (40–50 mm) min 150 mm depth over geotextile fabric</Text>
      </View>
    </View>
  );
}

// Pad length 15m minimum
export function StabilisedEntryLengthAnimation() {
  const padW = useRef(new Animated.Value(0)).current;
  const labelO = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(padW, { toValue: 1, duration: 1400, useNativeDriver: false }),
        Animated.timing(labelO, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.delay(2200),
        Animated.parallel([
          Animated.timing(padW, { toValue: 0, duration: 600, useNativeDriver: false }),
          Animated.timing(labelO, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]),
        Animated.delay(500),
      ])
    );
    a.start();
    return () => a.stop();
  }, []);

  const ROAD_Y = 90;
  const MAX_W = 220;
  const padWidth = padW.interpolate({ inputRange: [0, 1], outputRange: [0, MAX_W] });

  return (
    <View style={[styles.container, { backgroundColor: "#F5F3EE" }]}>
      <Text style={styles.topLabel}>Plan view — site entrance</Text>

      {/* Public road */}
      <View style={{ position: "absolute", left: 0, right: 0, top: ROAD_Y, height: 44, backgroundColor: "#B0BEC5" }}>
        <Text style={{ color: "rgba(0,0,0,0.4)", fontSize: 9, textAlign: "center", marginTop: 14 }}>PUBLIC ROAD</Text>
      </View>

      {/* Rock pad */}
      <Animated.View
        style={{
          position: "absolute",
          left: 40,
          top: ROAD_Y - 2,
          width: padWidth,
          height: 48,
          backgroundColor: "#78909C",
          borderTopRightRadius: 4,
          borderBottomRightRadius: 4,
        }}
      />

      {/* Site boundary */}
      <View style={{ position: "absolute", left: 40, top: 40, bottom: 40, width: 2, backgroundColor: "#E53935" }} />

      {/* 15m label */}
      <Animated.View style={[styles.measureLabel, { top: ROAD_Y - 28, left: 40, opacity: labelO }]}>
        <Text style={styles.measureLabelText}>Min 15 m from boundary</Text>
      </Animated.View>
      <Animated.View
        style={{
          position: "absolute",
          top: ROAD_Y - 14,
          left: 40,
          width: padW.interpolate({ inputRange: [0, 1], outputRange: [0, MAX_W] }),
          height: 2,
          backgroundColor: GREEN,
          opacity: labelO,
        }}
      />

      <View style={styles.specRow}>
        <View style={styles.specDot} />
        <Text style={styles.specText}>Minimum 15 m long from property boundary (30 m for heavy plant)</Text>
      </View>
    </View>
  );
}

// ─── VEGETATION BUFFER / TPZ: exclusion fencing ───
export function VegetationTPZFencingAnimation() {
  const fenceO = useRef(new Animated.Value(0)).current;
  const machineX = useRef(new Animated.Value(220)).current;
  const warnO = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(fenceO, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.delay(400),
        Animated.timing(machineX, { toValue: 160, duration: 1000, useNativeDriver: true }),
        Animated.timing(warnO, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.delay(1600),
        Animated.parallel([
          Animated.timing(machineX, { toValue: 220, duration: 600, useNativeDriver: true }),
          Animated.timing(warnO, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(fenceO, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]),
        Animated.delay(500),
      ])
    );
    a.start();
    return () => a.stop();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: "#E8F5E9" }]}>
      {/* Tree / vegetation zone */}
      <View style={{ position: "absolute", left: 0, top: 28, width: 150, bottom: 30, backgroundColor: "#A5D6A7", borderRadius: 4 }}>
        {[20, 60, 100].map((y) => (
          <View key={y} style={{ position: "absolute", left: 20 + (y % 40), top: y, width: 36, height: 36, borderRadius: 18, backgroundColor: GREEN_VEG, opacity: 0.8 }} />
        ))}
        <Text style={{ position: "absolute", bottom: 8, left: 4, right: 4, fontSize: 9, color: "#1B5E20", fontWeight: "700", textAlign: "center" }}>TREE PROTECTION ZONE</Text>
      </View>

      {/* Orange exclusion fence */}
      <Animated.View
        style={{
          position: "absolute",
          left: 150,
          top: 24,
          width: 8,
          bottom: 26,
          backgroundColor: "#FF6F00",
          borderRadius: 2,
          opacity: fenceO,
        }}
      />
      {/* Fence pickets */}
      {[30, 60, 90, 120, 150].map((y) => (
        <Animated.View
          key={y}
          style={{
            position: "absolute",
            left: 146,
            top: y,
            width: 16,
            height: 8,
            backgroundColor: "#FF6F00",
            borderRadius: 2,
            opacity: fenceO,
          }}
        />
      ))}

      {/* Machine */}
      <Animated.View style={{ position: "absolute", top: 80, transform: [{ translateX: machineX }] }}>
        <View style={{ width: 48, height: 32, backgroundColor: "#F57F17", borderRadius: 4, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "#fff", fontSize: 8, fontWeight: "700" }}>PLANT</Text>
        </View>
      </Animated.View>

      {/* Warning */}
      <Animated.View style={[styles.measureLabel, { top: 60, left: 156, right: 8, opacity: warnO, backgroundColor: "rgba(214,40,40,0.9)" }]}>
        <Text style={styles.measureLabelText}>⚠ STOP — TPZ boundary</Text>
      </Animated.View>

      <View style={styles.specRow}>
        <View style={styles.specDot} />
        <Text style={styles.specText}>Orange exclusion fencing at TPZ boundary — no plant access within zone</Text>
      </View>
    </View>
  );
}

// ─── TOPSOIL STOCKPILE: 2H:1V batter slope ───
export function TopsoilStockpileProfileAnimation() {
  const pile = useRef(new Animated.Value(0)).current;
  const labelO = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(pile, { toValue: 1, duration: 1400, useNativeDriver: false }),
        Animated.timing(labelO, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.delay(2400),
        Animated.parallel([
          Animated.timing(pile, { toValue: 0, duration: 600, useNativeDriver: false }),
          Animated.timing(labelO, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]),
        Animated.delay(500),
      ])
    );
    a.start();
    return () => a.stop();
  }, []);

  const GROUND = 150;
  const MAX_H = 80;
  const pileH = pile.interpolate({ inputRange: [0, 1], outputRange: [0, MAX_H] });
  const pileTop = pile.interpolate({ inputRange: [0, 1], outputRange: [GROUND, GROUND - MAX_H] });

  return (
    <View style={[styles.container, { backgroundColor: SKY }]}>
      <View style={{ position: "absolute", left: 0, right: 0, top: GROUND, bottom: 0, backgroundColor: SOIL }} />

      {/* Stockpile profile (trapezoid approximation) */}
      <Animated.View
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: pileTop,
          height: pileH,
          backgroundColor: "#D4A853",
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
        }}
      />

      {/* Height label: 2m max */}
      <Animated.View style={[styles.measureLabel, { left: 10, top: GROUND - MAX_H / 2 - 10, opacity: labelO }]}>
        <Text style={styles.measureLabelText}>Max 2 m high</Text>
      </Animated.View>
      <Animated.View
        style={{
          position: "absolute",
          left: 56,
          top: GROUND - MAX_H,
          width: 2,
          height: MAX_H,
          backgroundColor: GREEN,
          opacity: labelO,
        }}
      />

      {/* 2H:1V slope label */}
      <Animated.View style={[styles.measureLabel, { right: 6, top: GROUND - 40, opacity: labelO }]}>
        <Text style={styles.measureLabelText}>2H:1V max batter</Text>
      </Animated.View>

      {/* Silt fence at base */}
      <Animated.View style={{ position: "absolute", left: 48, top: GROUND - 14, width: 6, height: 20, backgroundColor: "#D6C9A8", opacity: labelO }} />
      <Animated.View style={{ position: "absolute", right: 48, top: GROUND - 14, width: 6, height: 20, backgroundColor: "#D6C9A8", opacity: labelO }} />

      <View style={styles.specRow}>
        <View style={styles.specDot} />
        <Text style={styles.specText}>Maximum 2 m height · batter slopes max 2H:1V · silt fence perimeter</Text>
      </View>
    </View>
  );
}

// ─── SEDIMENT TRAP: freeboard 600mm ───
export function SedimentTrapFreeboardAnimation() {
  const waterH = useRef(new Animated.Value(0)).current;
  const warnO = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.timing(waterH, { toValue: 0.6, duration: 2000, useNativeDriver: false }),
        Animated.delay(800),
        Animated.timing(waterH, { toValue: 0.85, duration: 1200, useNativeDriver: false }),
        Animated.timing(warnO, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.delay(1600),
        Animated.parallel([
          Animated.timing(waterH, { toValue: 0, duration: 600, useNativeDriver: false }),
          Animated.timing(warnO, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]),
        Animated.delay(600),
      ])
    );
    a.start();
    return () => a.stop();
  }, []);

  const TRAP_TOP = 36;
  const TRAP_H = 120;
  const FB_H = 24; // 600mm freeboard zone
  const FILL_ZONE = TRAP_H - FB_H;

  const waterFill = waterH.interpolate({ inputRange: [0, 1], outputRange: [0, FILL_ZONE] });
  const waterColour = waterH.interpolate({
    inputRange: [0, 0.84, 0.85, 1],
    outputRange: ["#4FC3F7", "#4FC3F7", "#D62828", "#D62828"],
  });

  return (
    <View style={[styles.container, { backgroundColor: SKY }]}>
      <Text style={styles.topLabel}>Cross-section — sediment trap</Text>

      <View style={{ position: "absolute", left: 60, top: TRAP_TOP, width: 180, height: TRAP_H, borderWidth: 3, borderColor: SOIL, borderRadius: 4 }} />

      {/* Freeboard zone */}
      <View
        style={{
          position: "absolute",
          left: 63,
          top: TRAP_TOP + 3,
          width: 174,
          height: FB_H,
          backgroundColor: "rgba(233,196,106,0.35)",
          borderBottomWidth: 1,
          borderBottomColor: "#E9C46A",
        }}
      />
      <View style={[styles.callout, { top: TRAP_TOP + 6, left: 8 }]}>
        <Text style={[styles.calloutText, { color: "#92400E" }]}>600 mm freeboard</Text>
      </View>

      {/* Water level */}
      <Animated.View
        style={{
          position: "absolute",
          left: 63,
          bottom: H - (TRAP_TOP + TRAP_H) + 3,
          width: 174,
          height: waterFill,
          backgroundColor: waterColour,
          opacity: 0.65,
        }}
      />

      {/* Warning */}
      <Animated.View style={[styles.measureLabel, { bottom: 36, left: 60, right: 60, alignItems: "center", backgroundColor: "rgba(214,40,40,0.9)", opacity: warnO }]}>
        <Text style={styles.measureLabelText}>FREEBOARD EXCEEDED</Text>
      </Animated.View>

      <View style={styles.specRow}>
        <View style={styles.specDot} />
        <Text style={styles.specText}>Minimum 600 mm freeboard above the design water level at all times</Text>
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
