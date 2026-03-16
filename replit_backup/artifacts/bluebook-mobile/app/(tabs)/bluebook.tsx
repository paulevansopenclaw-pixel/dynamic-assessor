import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import C from "@/constants/colors";
import { CATEGORIES, CATEGORY_COLOURS, CONTROLS, ControlCategory, EnvironmentalControl } from "@/data/environmentalControls";

export default function BlueBookScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ControlCategory | "All">("All");

  const filtered = useMemo(() => {
    let list = CONTROLS;
    if (activeCategory !== "All") {
      list = list.filter((c) => c.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.shortDescription.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, activeCategory]);

  const renderItem = ({ item }: { item: EnvironmentalControl }) => {
    const catColour = CATEGORY_COLOURS[item.category];
    return (
      <Pressable
        style={({ pressed }) => [styles.card, { opacity: pressed ? 0.82 : 1 }]}
        onPress={() => router.push({ pathname: "/control/[id]", params: { id: item.id } })}
      >
        <View style={styles.cardTop}>
          <View style={[styles.categoryPill, { backgroundColor: catColour.bg, borderColor: catColour.border }]}>
            <Text style={[styles.categoryPillText, { color: catColour.text }]}>{item.category}</Text>
          </View>
          <Text style={styles.refText}>{item.referenceSection.split("—")[0].trim()}</Text>
        </View>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>{item.shortDescription}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.failuresHint}>
            {item.signsOfFailure.length} failure signs · {item.requirements.length} requirements
          </Text>
          <Feather name="chevron-right" size={16} color={C.textMuted} />
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Blue Book</Text>
        <Text style={styles.subtitle}>Managing Urban Stormwater: Soils and Construction</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Feather name="search" size={16} color={C.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search controls..."
          placeholderTextColor={C.textMuted}
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
          returnKeyType="search"
        />
        {search.length > 0 && Platform.OS !== "ios" && (
          <Pressable onPress={() => setSearch("")} hitSlop={8}>
            <Feather name="x" size={16} color={C.textMuted} />
          </Pressable>
        )}
      </View>

      {/* Category filter */}
      <FlatList
        data={["All", ...CATEGORIES] as (ControlCategory | "All")[]}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
        renderItem={({ item }) => {
          const active = item === activeCategory;
          const catColour = item !== "All" ? CATEGORY_COLOURS[item as ControlCategory] : null;
          return (
            <Pressable
              style={[
                styles.categoryChip,
                active && { backgroundColor: catColour?.bg ?? C.green100, borderColor: catColour?.border ?? C.green600 },
                !active && { backgroundColor: C.bgCard, borderColor: C.borderLight },
              ]}
              onPress={() => setActiveCategory(item)}
            >
              <Text style={[
                styles.categoryChipText,
                active && { color: catColour?.text ?? C.green700, fontFamily: "Inter_600SemiBold" },
                !active && { color: C.textSecondary },
              ]}>
                {item}
              </Text>
            </Pressable>
          );
        }}
      />

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Feather name="search" size={32} color={C.textMuted} />
            <Text style={styles.emptyTitle}>No controls found</Text>
            <Text style={styles.emptyText}>Try adjusting your search or category filter.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  title: { fontFamily: "Inter_700Bold", fontSize: 28, color: C.text, letterSpacing: -0.5 },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: C.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },

  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bgCard,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 12 : 4,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: C.text,
  },

  categoriesScroll: { flexGrow: 0, marginBottom: 12 },
  categoriesContent: { paddingHorizontal: 20, gap: 8 },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    minHeight: 36,
    justifyContent: "center",
  },
  categoryChipText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
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
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryPillText: { fontFamily: "Inter_600SemiBold", fontSize: 12 },
  refText: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted },
  cardName: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    color: C.text,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  cardDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: C.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  failuresHint: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textMuted },

  emptyBox: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 10,
  },
  emptyTitle: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: C.textSecondary },
  emptyText: { fontFamily: "Inter_400Regular", fontSize: 14, color: C.textMuted, textAlign: "center" },
});
