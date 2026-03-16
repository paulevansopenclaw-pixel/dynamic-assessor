import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import C from "@/constants/colors";
import { useIncidents } from "@/context/IncidentsContext";
import { Incident, INCIDENT_TYPE_LABELS, SEVERITY_COLOURS, IncidentStatus } from "@/data/incidents";

const STATUS_FILTERS: { key: IncidentStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "actioned", label: "Actioned" },
  { key: "closed", label: "Closed" },
];

function IncidentCard({ item, onPress }: { item: Incident; onPress: () => void }) {
  const sevColour = SEVERITY_COLOURS[item.severity];
  const date = new Date(item.createdAt).toLocaleDateString("en-AU", {
    day: "numeric", month: "short", year: "numeric",
  });
  const statusColour: Record<IncidentStatus, string> = {
    open: C.red,
    actioned: C.amber,
    closed: C.green700,
  };
  const statusBg: Record<IncidentStatus, string> = {
    open: C.redBg,
    actioned: C.amberBg,
    closed: C.green100,
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.82 : 1 }]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.sevBadge, { backgroundColor: sevColour.bg }]}>
          <Text style={[styles.sevBadgeText, { color: sevColour.text }]}>
            {item.severity.toUpperCase()}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusBg[item.status] }]}>
          <Text style={[styles.statusText, { color: statusColour[item.status] }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardType}>{INCIDENT_TYPE_LABELS[item.incidentType]}</Text>

      <View style={styles.cardMeta}>
        <View style={styles.metaItem}>
          <Feather name="map-pin" size={12} color={C.textMuted} />
          <Text style={styles.metaText}>{item.location}</Text>
        </View>
        <View style={styles.metaItem}>
          <Feather name="user" size={12} color={C.textMuted} />
          <Text style={styles.metaText}>{item.reportedBy}</Text>
        </View>
        <View style={styles.metaItem}>
          <Feather name="calendar" size={12} color={C.textMuted} />
          <Text style={styles.metaText}>{date}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function IncidentsScreen() {
  const insets = useSafeAreaInsets();
  const { incidents, isLoading } = useIncidents();
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | "all">("all");

  const filtered = useMemo(() => {
    if (statusFilter === "all") return incidents;
    return incidents.filter((i) => i.status === statusFilter);
  }, [incidents, statusFilter]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Incidents</Text>
        <Pressable
          style={({ pressed }) => [styles.addBtn, { opacity: pressed ? 0.82 : 1 }]}
          onPress={() => router.push("/new-incident")}
        >
          {Platform.OS === "ios" ? (
            <SymbolView name="plus" tintColor={C.white} size={18} />
          ) : (
            <Feather name="plus" size={18} color={C.white} />
          )}
          <Text style={styles.addBtnText}>Report</Text>
        </Pressable>
      </View>

      {/* Status filter */}
      <FlatList
        data={STATUS_FILTERS}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
        renderItem={({ item }) => {
          const active = item.key === statusFilter;
          return (
            <Pressable
              style={[
                styles.filterChip,
                active
                  ? { backgroundColor: C.green700, borderColor: C.green700 }
                  : { backgroundColor: C.bgCard, borderColor: C.borderLight },
              ]}
              onPress={() => setStatusFilter(item.key)}
            >
              <Text style={[
                styles.filterChipText,
                { color: active ? C.white : C.textSecondary, fontFamily: active ? "Inter_600SemiBold" : "Inter_500Medium" },
              ]}>
                {item.label}
              </Text>
            </Pressable>
          );
        }}
      />

      {/* Count */}
      <Text style={styles.countText}>
        {filtered.length} {filtered.length === 1 ? "incident" : "incidents"}
      </Text>

      {/* List */}
      {isLoading ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <IncidentCard
              item={item}
              onPress={() => router.push({ pathname: "/incident/[id]", params: { id: item.id } })}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              {Platform.OS === "ios" ? (
                <SymbolView name="checkmark.seal" tintColor={C.textMuted} size={40} />
              ) : (
                <MaterialCommunityIcons name="check-decagram-outline" size={40} color={C.textMuted} />
              )}
              <Text style={styles.emptyTitle}>
                {statusFilter === "all" ? "No incidents logged" : `No ${statusFilter} incidents`}
              </Text>
              <Text style={styles.emptyText}>
                {statusFilter === "all"
                  ? "Use the Report tab to log an environmental incident."
                  : "Adjust the filter to see other incidents."}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: { fontFamily: "Inter_700Bold", fontSize: 28, color: C.text, letterSpacing: -0.5 },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.green700,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
  },
  addBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.white },

  filterScroll: { flexGrow: 0, marginBottom: 8 },
  filterContent: { paddingHorizontal: 20, gap: 8 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    minHeight: 36,
    justifyContent: "center",
  },
  filterChipText: { fontSize: 13 },

  countText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: C.textMuted,
    paddingHorizontal: 20,
    marginBottom: 8,
  },

  listContent: { paddingHorizontal: 20, gap: 12 },
  card: {
    backgroundColor: C.bgCard,
    borderRadius: 16,
    padding: 16,
    shadowColor: C.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  sevBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  sevBadgeText: { fontFamily: "Inter_700Bold", fontSize: 11, letterSpacing: 0.5 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontFamily: "Inter_600SemiBold", fontSize: 11 },

  cardTitle: { fontFamily: "Inter_700Bold", fontSize: 16, color: C.text, marginBottom: 3 },
  cardType: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textSecondary, marginBottom: 12 },

  cardMeta: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted },

  emptyBox: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 10,
    paddingHorizontal: 20,
  },
  emptyTitle: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: C.textSecondary },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: C.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
});
