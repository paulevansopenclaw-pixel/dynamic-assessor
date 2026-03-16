import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import React, { useMemo } from "react";
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
import { useIncidents } from "@/context/IncidentsContext";
import { INCIDENT_TYPE_LABELS, Severity } from "@/data/incidents";
import { CONTROLS } from "@/data/environmentalControls";

function StatusBadge({ severity, label }: { severity: Severity; label: string }) {
  const colours: Record<Severity, { bg: string; text: string }> = {
    low: { bg: C.green100, text: C.green700 },
    medium: { bg: C.amberBg, text: C.amber },
    high: { bg: C.redBg, text: C.red },
    critical: { bg: C.red, text: C.white },
  };
  const c = colours[severity];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.text }]}>{label}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { incidents, isLoading } = useIncidents();

  const stats = useMemo(() => {
    const open = incidents.filter((i) => i.status === "open");
    const critical = open.filter((i) => i.severity === "critical");
    const high = open.filter((i) => i.severity === "high");
    const actioned = incidents.filter((i) => i.status === "actioned");
    return { open: open.length, critical: critical.length, high: high.length, actioned: actioned.length, total: incidents.length };
  }, [incidents]);

  const recentIncidents = useMemo(() =>
    incidents.slice(0, 3),
    [incidents]
  );

  const siteRisk: "OK" | "WARNING" | "ALERT" =
    stats.critical > 0 ? "ALERT" : stats.high > 0 ? "WARNING" : "OK";

  const riskColour = siteRisk === "ALERT"
    ? C.red
    : siteRisk === "WARNING"
    ? C.amber
    : C.green700;
  const riskBg = siteRisk === "ALERT"
    ? C.redBg
    : siteRisk === "WARNING"
    ? C.amberBg
    : C.green100;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>BlueBook</Text>
          <Text style={styles.appSub}>NSW Environmental Controls</Text>
        </View>
        <View style={[styles.riskPill, { backgroundColor: riskBg }]}>
          <View style={[styles.riskDot, { backgroundColor: riskColour }]} />
          <Text style={[styles.riskLabel, { color: riskColour }]}>{siteRisk}</Text>
        </View>
      </View>

      {/* Site Status Card */}
      <View style={[styles.statusCard, { borderLeftColor: riskColour }]}>
        <Text style={styles.statusCardTitle}>Site Environmental Status</Text>
        <Text style={[styles.statusCardStatus, { color: riskColour }]}>
          {siteRisk === "ALERT"
            ? "Critical incident(s) require immediate action"
            : siteRisk === "WARNING"
            ? "High-priority items need attention today"
            : incidents.length === 0
            ? "No active incidents — site looks good"
            : "All open items are being actioned"}
        </Text>
        <View style={styles.statsRow}>
          <StatBox value={stats.open} label="Open" colour={stats.open > 0 ? C.amber : C.green700} />
          <StatBox value={stats.critical} label="Critical" colour={stats.critical > 0 ? C.red : C.textMuted} />
          <StatBox value={stats.actioned} label="Actioned" colour={C.blue} />
          <StatBox value={stats.total} label="Total" colour={C.textSecondary} />
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickRow}>
        <QuickAction
          icon="plus-circle"
          sfSymbol="plus.circle.fill"
          label="Report Incident"
          colour={C.red}
          bg={C.redBg}
          onPress={() => router.push("/new-incident")}
        />
        <QuickAction
          icon="book-open"
          sfSymbol="book.fill"
          label="Blue Book"
          colour={C.green700}
          bg={C.green100}
          onPress={() => router.push("/(tabs)/bluebook")}
        />
        <QuickAction
          icon="list"
          sfSymbol="list.bullet.clipboard"
          label="All Incidents"
          colour={C.blue}
          bg={C.blueBg}
          onPress={() => router.push("/(tabs)/incidents")}
        />
      </View>

      {/* Controls at a Glance */}
      <Text style={styles.sectionTitle}>Controls at a Glance</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.controlsScroll}
      >
        {CONTROLS.slice(0, 6).map((control) => (
          <Pressable
            key={control.id}
            style={({ pressed }) => [styles.controlCard, { opacity: pressed ? 0.82 : 1 }]}
            onPress={() => router.push({ pathname: "/control/[id]", params: { id: control.id } })}
          >
            <View style={[styles.controlCategoryDot, { backgroundColor:
              control.category === "Sediment Control" ? C.amber :
              control.category === "Erosion Control" ? C.green600 :
              control.category === "Water Management" ? C.blue :
              control.category === "Chemical Management" ? C.red :
              control.category === "Vegetation Protection" ? "#4ADE80" :
              C.yellow
            }]} />
            <Text style={styles.controlCardName} numberOfLines={2}>{control.name}</Text>
            <Text style={styles.controlCardSub}>{control.referenceSection.split("—")[0].trim()}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Recent Incidents */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Incidents</Text>
        {incidents.length > 0 && (
          <Pressable onPress={() => router.push("/(tabs)/incidents")}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        )}
      </View>

      {isLoading ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Loading...</Text>
        </View>
      ) : recentIncidents.length === 0 ? (
        <View style={styles.emptyBox}>
          {Platform.OS === "ios" ? (
            <SymbolView name="checkmark.seal" tintColor={C.textMuted} size={32} />
          ) : (
            <MaterialCommunityIcons name="check-decagram-outline" size={32} color={C.textMuted} />
          )}
          <Text style={styles.emptyTitle}>No incidents logged</Text>
          <Text style={styles.emptyText}>Use the Report tab to log an environmental incident on site.</Text>
        </View>
      ) : (
        recentIncidents.map((incident) => (
          <Pressable
            key={incident.id}
            style={({ pressed }) => [styles.incidentRow, { opacity: pressed ? 0.8 : 1 }]}
            onPress={() => router.push({ pathname: "/incident/[id]", params: { id: incident.id } })}
          >
            <View style={styles.incidentRowLeft}>
              <Text style={styles.incidentRowTitle} numberOfLines={1}>{incident.title}</Text>
              <Text style={styles.incidentRowMeta}>{INCIDENT_TYPE_LABELS[incident.incidentType]} · {incident.location}</Text>
            </View>
            <StatusBadge severity={incident.severity} label={incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)} />
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

function StatBox({ value, label, colour }: { value: number; label: string; colour: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, { color: colour }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function QuickAction({ icon, sfSymbol, label, colour, bg, onPress }: {
  icon: any; sfSymbol: string; label: string; colour: string; bg: string; onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.quickAction, { backgroundColor: bg, opacity: pressed ? 0.82 : 1 }]}
      onPress={onPress}
    >
      {Platform.OS === "ios" ? (
        <SymbolView name={sfSymbol} tintColor={colour} size={26} />
      ) : (
        <Feather name={icon} size={26} color={colour} />
      )}
      <Text style={[styles.quickActionLabel, { color: colour }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  content: { paddingHorizontal: 20, gap: 4 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  appName: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    color: C.text,
    letterSpacing: -0.5,
  },
  appSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: C.textSecondary,
    marginTop: 2,
  },
  riskPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  riskDot: { width: 8, height: 8, borderRadius: 4 },
  riskLabel: { fontFamily: "Inter_700Bold", fontSize: 12, letterSpacing: 0.5 },

  statusCard: {
    backgroundColor: C.bgCard,
    borderRadius: 16,
    padding: 18,
    borderLeftWidth: 4,
    marginBottom: 24,
    shadowColor: C.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statusCardTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: C.textSecondary,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statusCardStatus: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: "row",
    gap: 0,
  },
  statBox: { flex: 1, alignItems: "center" },
  statValue: { fontFamily: "Inter_700Bold", fontSize: 24 },
  statLabel: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textMuted, marginTop: 2 },

  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: C.text,
    marginBottom: 12,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 8,
  },
  seeAll: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: C.green700,
  },

  quickRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  quickAction: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    gap: 8,
    minHeight: 80,
    justifyContent: "center",
  },
  quickActionLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    textAlign: "center",
  },

  controlsScroll: { paddingRight: 20, gap: 12 },
  controlCard: {
    backgroundColor: C.bgCard,
    borderRadius: 14,
    padding: 14,
    width: 140,
    gap: 6,
    shadowColor: C.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 4,
  },
  controlCategoryDot: { width: 10, height: 10, borderRadius: 5 },
  controlCardName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: C.text,
    lineHeight: 20,
  },
  controlCardSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: C.textMuted,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: { fontFamily: "Inter_600SemiBold", fontSize: 12 },

  emptyBox: {
    backgroundColor: C.bgCard,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  emptyTitle: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: C.textSecondary },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: C.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },

  incidentRow: {
    backgroundColor: C.bgCard,
    borderRadius: 14,
    padding: 16,
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
  incidentRowLeft: { flex: 1, marginRight: 12 },
  incidentRowTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: C.text },
  incidentRowMeta: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: C.textMuted,
    marginTop: 3,
  },
});
