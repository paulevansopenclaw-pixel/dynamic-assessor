import { Feather } from "@expo/vector-icons";
import React, { useCallback } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import C from "@/constants/colors";
import { RequirementAnimation } from "@/components/animations/types";

interface Props {
  animation: RequirementAnimation | null;
  onClose: () => void;
}

export function RequirementAnimationModal({ animation, onClose }: Props) {
  const insets = useSafeAreaInsets();

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!animation) return null;
  const { AnimationComponent, title, spec } = animation;

  return (
    <Modal
      visible={!!animation}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose} />

      <View
        style={[
          styles.sheet,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        {/* Handle bar */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconBox}>
              <Feather name="play-circle" size={16} color={C.green700} />
            </View>
            <Text style={styles.headerLabel}>Requirement Visual</Text>
          </View>
          <Pressable
            onPress={handleClose}
            style={({ pressed }) => [styles.closeBtn, { opacity: pressed ? 0.6 : 1 }]}
            hitSlop={10}
          >
            <Feather name="x" size={20} color={C.textSecondary} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Animation container */}
          <View style={styles.animationContainer}>
            <AnimationComponent />
          </View>

          {/* Spec text */}
          <View style={styles.specCard}>
            <View style={styles.specHeader}>
              <Feather name="book-open" size={14} color={C.green700} />
              <Text style={styles.specHeaderText}>Blue Book Specification</Text>
            </View>
            <Text style={styles.specText}>{spec}</Text>
          </View>

          {/* What to look for */}
          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Feather name="eye" size={14} color="#457B9D" />
              <Text style={[styles.specHeaderText, { color: "#457B9D" }]}>What to check on site</Text>
            </View>
            <Text style={styles.tipText}>
              Compare the animation above to what you can see on your site. If the
              installed control doesn't match the specification shown, it may need
              to be repaired or reinstated before the next rainfall event.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.bgCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 20,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: C.border,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: C.green100,
    alignItems: "center",
    justifyContent: "center",
  },
  headerLabel: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: C.textSecondary },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: C.bgSurface,
  },

  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8, gap: 16 },

  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: C.text,
    letterSpacing: -0.3,
    lineHeight: 28,
  },

  animationContainer: {
    alignItems: "center",
    backgroundColor: C.bgSurface,
    borderRadius: 16,
    padding: 8,
    overflow: "hidden",
  },

  specCard: {
    backgroundColor: C.green100,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: `${C.green600}40`,
  },
  specHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  specHeaderText: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: C.green700,
  },
  specText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: C.green800,
    lineHeight: 21,
  },

  tipCard: {
    backgroundColor: C.blueBg,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: `${C.blue}40`,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  tipText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "#1D4E6C",
    lineHeight: 20,
  },
});
