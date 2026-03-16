import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import C from "@/constants/colors";
import { CONTROLS } from "@/data/environmentalControls";

interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  sfSymbol: string;
  colour: string;
  bg: string;
  onPress: () => void;
}

export default function ReportScreen() {
  const insets = useSafeAreaInsets();

  const reportCards: ReportCard[] = [
    {
      id: "new-incident",
      title: "Environmental Incident",
      description: "Sediment breach, erosion, chemical spill, dust event, stormwater contamination or vegetation damage.",
      icon: "alert-circle",
      sfSymbol: "exclamationmark.triangle.fill",
      colour: C.red,
      bg: C.redBg,
      onPress: () => router.push("/new-incident"),
    },
    {
      id: "control-failure",
      title: "Control Failure",
      description: "A Blue Book erosion or sediment control has failed, been damaged, or is not functioning as required.",
      icon: "tool",
      sfSymbol: "wrench.and.screwdriver.fill",
      colour: C.amber,
      bg: C.amberBg,
      onPress: () => router.push({ pathname: "/new-incident", params: { type: "control_failure" } }),
    },
  ];

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Report</Text>
      <Text style={styles.subtitle}>Log an environmental incident or failed control on site.</Text>

      <View style={styles.cardsContainer}>
        {reportCards.map((card) => (
          <Pressable
            key={card.id}
            style={({ pressed }) => [styles.reportCard, { opacity: pressed ? 0.85 : 1 }]}
            onPress={card.onPress}
          >
            <View style={[styles.iconBox, { backgroundColor: card.bg }]}>
              {Platform.OS === "ios" ? (
                <SymbolView name={card.sfSymbol} tintColor={card.colour} size={28} />
              ) : (
                <Feather name={card.icon as any} size={28} color={card.colour} />
              )}
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDesc}>{card.description}</Text>
            </View>
            <Feather name="chevron-right" size={20} color={C.textMuted} />
          </Pressable>
        ))}
      </View>

      {/* Commonly failed controls quick-report */}
      <Text style={styles.sectionTitle}>Quick Reference — Failed Controls</Text>
      <Text style={styles.sectionSubtitle}>
        Tap a control to view its failure signs and immediate actions. Tap Report to log the failure.
      </Text>
      {CONTROLS.map((control) => {
        const colours =
          control.category === "Sediment Control" ? { bg: "#FFF3E4", text: "#B45309", border: "#F4A261" } :
          control.category === "Erosion Control" ? { bg: C.green100, text: C.green700, border: C.green600 } :
          control.category === "Water Management" ? { bg: C.blueBg, text: C.blue, border: C.blue } :
          control.category === "Chemical Management" ? { bg: C.redBg, text: C.red, border: C.red } :
          control.category === "Vegetation Protection" ? { bg: "#F0FDF4", text: "#166534", border: "#4ADE80" } :
          { bg: C.yellowBg, text: "#92400E", border: C.yellow };
        return (
          <View key={control.id} style={styles.controlRow}>
            <View style={styles.controlRowLeft}>
              <View style={[styles.controlCatBadge, { backgroundColor: colours.bg, borderColor: colours.border }]}>
                <Text style={[styles.controlCatText, { color: colours.text }]}>{control.category}</Text>
              </View>
              <Text style={styles.controlName}>{control.name}</Text>
            </View>
            <View style={styles.controlRowActions}>
              <Pressable
                style={({ pressed }) => [styles.viewBtn, { opacity: pressed ? 0.75 : 1 }]}
                onPress={() => router.push({ pathname: "/control/[id]", params: { id: control.id } })}
                hitSlop={6}
              >
                <Text style={styles.viewBtnText}>View</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.reportBtn, { opacity: pressed ? 0.75 : 1 }]}
                onPress={() =>
                  router.push({ pathname: "/new-incident", params: { type: "control_failure", controlId: control.id } })
                }
                hitSlop={6}
              >
                <Text style={styles.reportBtnText}>Report</Text>
              </Pressable>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  content: { paddingHorizontal: 20, gap: 4 },
  title: { fontFamily: "Inter_700Bold", fontSize: 28, color: C.text, letterSpacing: -0.5 },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: C.textSecondary,
    marginTop: 4,
    marginBottom: 20,
    lineHeight: 20,
  },

  cardsContainer: { gap: 12, marginBottom: 28 },
  reportCard: {
    backgroundColor: C.bgCard,
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    shadowColor: C.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: { flex: 1 },
  cardTitle: { fontFamily: "Inter_700Bold", fontSize: 16, color: C.text, marginBottom: 4 },
  cardDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: C.textSecondary,
    lineHeight: 18,
  },

  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: C.text,
    marginBottom: 4,
    marginTop: 8,
  },
  sectionSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: C.textSecondary,
    marginBottom: 14,
    lineHeight: 18,
  },

  controlRow: {
    backgroundColor: C.bgCard,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    shadowColor: C.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  controlRowLeft: { flex: 1, marginRight: 8, gap: 4 },
  controlCatBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  controlCatText: { fontFamily: "Inter_600SemiBold", fontSize: 10 },
  controlName: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.text },
  controlRowActions: { flexDirection: "row", gap: 8 },
  viewBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: C.bgSurface,
    minHeight: 34,
    justifyContent: "center",
  },
  viewBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: C.textSecondary },
  reportBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: C.redBg,
    minHeight: 34,
    justifyContent: "center",
  },
  reportBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: C.red },
});
