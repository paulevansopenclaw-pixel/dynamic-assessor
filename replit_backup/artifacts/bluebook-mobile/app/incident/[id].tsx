import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useCallback, useEffect } from "react";
import * as Haptics from "expo-haptics";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import C from "@/constants/colors";
import { useIncidents } from "@/context/IncidentsContext";
import { INCIDENT_TYPE_LABELS, SEVERITY_COLOURS, Severity, IncidentStatus } from "@/data/incidents";
import { CONTROLS } from "@/data/environmentalControls";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function IncidentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { incidents, updateIncident } = useIncidents();

  const incident = incidents.find((i) => i.id === id);

  useEffect(() => {
    if (incident) {
      navigation.setOptions({ title: "Incident Detail" });
    }
  }, [incident, navigation]);

  const handleStatusChange = useCallback(async (newStatus: IncidentStatus) => {
    if (!incident) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await updateIncident(incident.id, { status: newStatus });
  }, [incident, updateIncident]);

  const confirmClose = useCallback(() => {
    if (!incident) return;
    Alert.alert(
      "Close Incident",
      "Mark this incident as closed? This indicates all reinstatement work has been completed.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Close Incident",
          style: "default",
          onPress: () => handleStatusChange("closed"),
        },
      ]
    );
  }, [incident, handleStatusChange]);

  if (!incident) {
    return (
      <View style={styles.notFound}>
        <Feather name="alert-circle" size={40} color={C.textMuted} />
        <Text style={styles.notFoundText}>Incident not found</Text>
      </View>
    );
  }

  const sevColour = SEVERITY_COLOURS[incident.severity];
  const date = new Date(incident.createdAt).toLocaleString("en-AU", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
  const occurred = new Date(incident.dateOccurred).toLocaleDateString("en-AU", {
    day: "numeric", month: "short", year: "numeric",
  });

  const relatedControl = incident.controlId
    ? CONTROLS.find((c) => c.id === incident.controlId)
    : null;

  const statusColours: Record<IncidentStatus, { bg: string; text: string }> = {
    open: { bg: C.redBg, text: C.red },
    actioned: { bg: C.amberBg, text: C.amber },
    closed: { bg: C.green100, text: C.green700 },
  };
  const statusC = statusColours[incident.status];

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Badges */}
      <View style={styles.badgesRow}>
        <View style={[styles.sevBadge, { backgroundColor: sevColour.bg }]}>
          <Text style={[styles.sevBadgeText, { color: sevColour.text }]}>
            {incident.severity.toUpperCase()}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusC.bg }]}>
          <Text style={[styles.statusBadgeText, { color: statusC.text }]}>
            {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
          </Text>
        </View>
      </View>

      <Text style={styles.title}>{incident.title}</Text>
      <Text style={styles.typeLabel}>{INCIDENT_TYPE_LABELS[incident.incidentType]}</Text>

      {/* Details card */}
      <View style={styles.card}>
        <InfoRow label="Location" value={incident.location} />
        <View style={styles.divider} />
        <InfoRow label="Reported by" value={incident.reportedBy} />
        <View style={styles.divider} />
        <InfoRow label="Date Occurred" value={occurred} />
        <View style={styles.divider} />
        <InfoRow label="Date Logged" value={date} />
      </View>

      {/* Description */}
      {incident.description ? (
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Description</Text>
          <Text style={styles.descText}>{incident.description}</Text>
        </View>
      ) : null}

      {/* Actions Taken */}
      {incident.actionsTaken ? (
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Actions Taken</Text>
          <Text style={styles.descText}>{incident.actionsTaken}</Text>
        </View>
      ) : null}

      {/* Related control */}
      {relatedControl && (
        <View style={[styles.card, styles.controlRefCard]}>
          <View style={styles.controlRefHeader}>
            <Feather name="book-open" size={14} color={C.green700} />
            <Text style={styles.controlRefTitle}>Related Blue Book Control</Text>
          </View>
          <Text style={styles.controlRefName}>{relatedControl.name}</Text>
          <Text style={styles.controlRefRef}>{relatedControl.referenceSection}</Text>
        </View>
      )}

      {/* Status actions */}
      {incident.status !== "closed" && (
        <View style={styles.actionsSection}>
          <Text style={styles.actionsSectionTitle}>Update Status</Text>
          <View style={styles.actionsRow}>
            {incident.status === "open" && (
              <Pressable
                style={({ pressed }) => [styles.actionBtn, styles.actionedBtn, { opacity: pressed ? 0.85 : 1 }]}
                onPress={() => handleStatusChange("actioned")}
              >
                <Feather name="check" size={16} color={C.amber} />
                <Text style={[styles.actionBtnText, { color: C.amber }]}>Mark Actioned</Text>
              </Pressable>
            )}
            <Pressable
              style={({ pressed }) => [styles.actionBtn, styles.closedBtn, { opacity: pressed ? 0.85 : 1 }]}
              onPress={confirmClose}
            >
              <Feather name="check-circle" size={16} color={C.green700} />
              <Text style={[styles.actionBtnText, { color: C.green700 }]}>Close Incident</Text>
            </Pressable>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  content: { paddingHorizontal: 20, paddingTop: 20, gap: 12 },
  notFound: {
    flex: 1, alignItems: "center", justifyContent: "center", gap: 12, backgroundColor: C.bg,
  },
  notFoundText: { fontFamily: "Inter_500Medium", fontSize: 16, color: C.textMuted },

  badgesRow: { flexDirection: "row", gap: 8 },
  sevBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  sevBadgeText: { fontFamily: "Inter_700Bold", fontSize: 12, letterSpacing: 0.5 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  statusBadgeText: { fontFamily: "Inter_600SemiBold", fontSize: 12 },

  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 26,
    color: C.text,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  typeLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: C.textSecondary,
    marginBottom: 4,
  },

  card: {
    backgroundColor: C.bgCard,
    borderRadius: 16,
    padding: 16,
    shadowColor: C.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  infoLabel: { fontFamily: "Inter_500Medium", fontSize: 14, color: C.textMuted },
  infoValue: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.text, flex: 1, textAlign: "right" },
  divider: { height: 1, backgroundColor: C.borderLight },

  cardSectionTitle: { fontFamily: "Inter_700Bold", fontSize: 14, color: C.text, marginBottom: 8 },
  descText: { fontFamily: "Inter_400Regular", fontSize: 14, color: C.textSecondary, lineHeight: 21 },

  controlRefCard: { borderWidth: 1.5, borderColor: `${C.green700}30` },
  controlRefHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  controlRefTitle: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: C.green700 },
  controlRefName: { fontFamily: "Inter_700Bold", fontSize: 15, color: C.text },
  controlRefRef: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted, marginTop: 2 },

  actionsSection: { marginTop: 4 },
  actionsSectionTitle: {
    fontFamily: "Inter_700Bold", fontSize: 16, color: C.text, marginBottom: 10,
  },
  actionsRow: { flexDirection: "row", gap: 12 },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1.5,
  },
  actionedBtn: { backgroundColor: C.amberBg, borderColor: C.amber },
  closedBtn: { backgroundColor: C.green100, borderColor: C.green700 },
  actionBtnText: { fontFamily: "Inter_700Bold", fontSize: 14 },
});
