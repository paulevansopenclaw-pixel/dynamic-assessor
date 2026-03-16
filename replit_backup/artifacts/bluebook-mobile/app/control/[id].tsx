import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import C from "@/constants/colors";
import { ANIMATION_MAP } from "@/components/animations";
import { RequirementAnimation } from "@/components/animations/types";
import { RequirementAnimationModal } from "@/components/RequirementAnimationModal";
import { CATEGORY_COLOURS, CONTROLS } from "@/data/environmentalControls";

interface TappableRequirementProps {
  text: string;
  index: number;
  controlId: string;
  onPress: (animation: RequirementAnimation) => void;
}

function TappableRequirement({ text, index, controlId, onPress }: TappableRequirementProps) {
  const animations = ANIMATION_MAP[controlId] ?? [];
  const animation = animations[index] ?? null;
  const hasAnimation = !!animation;

  const handlePress = useCallback(async () => {
    if (!animation) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(animation);
  }, [animation, onPress]);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.bulletRow,
        hasAnimation && { backgroundColor: pressed ? `${C.green700}12` : `${C.green700}07` },
        hasAnimation && styles.tappableBulletRow,
      ]}
      onPress={hasAnimation ? handlePress : undefined}
      disabled={!hasAnimation}
    >
      <View style={[styles.bullet, { backgroundColor: hasAnimation ? C.green700 : C.textMuted }]} />
      <Text style={[styles.bulletText, hasAnimation && { color: C.text }]}>{text}</Text>
      {hasAnimation && (
        <View style={styles.animBadge}>
          <Feather name="play-circle" size={13} color={C.green700} />
          <Text style={styles.animBadgeText}>Visual</Text>
        </View>
      )}
    </Pressable>
  );
}

function Section({
  icon,
  title,
  items,
  iconColour,
  controlId,
  onAnimationPress,
  requirementOffset = 0,
}: {
  icon: string;
  title: string;
  items: string[];
  iconColour: string;
  controlId?: string;
  onAnimationPress?: (animation: RequirementAnimation) => void;
  requirementOffset?: number;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIconBox, { backgroundColor: `${iconColour}20` }]}>
          <Feather name={icon as any} size={16} color={iconColour} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {items.map((item, i) => {
        if (controlId && onAnimationPress) {
          return (
            <TappableRequirement
              key={i}
              text={item}
              index={i + requirementOffset}
              controlId={controlId}
              onPress={onAnimationPress}
            />
          );
        }
        return (
          <View key={i} style={styles.bulletRow}>
            <View style={[styles.bullet, { backgroundColor: iconColour }]} />
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        );
      })}
    </View>
  );
}

export default function ControlDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const control = CONTROLS.find((c) => c.id === id);
  const [activeAnimation, setActiveAnimation] = useState<RequirementAnimation | null>(null);

  const animationsForControl = ANIMATION_MAP[id ?? ""] ?? [];
  const animCount = animationsForControl.filter(Boolean).length;

  useEffect(() => {
    if (control) {
      navigation.setOptions({ title: control.name });
    }
  }, [control, navigation]);

  const handleAnimationPress = useCallback((animation: RequirementAnimation) => {
    setActiveAnimation(animation);
  }, []);

  const handleModalClose = useCallback(() => {
    setActiveAnimation(null);
  }, []);

  if (!control) {
    return (
      <View style={styles.notFound}>
        <Feather name="alert-circle" size={40} color={C.textMuted} />
        <Text style={styles.notFoundText}>Control not found</Text>
      </View>
    );
  }

  const catColour = CATEGORY_COLOURS[control.category];

  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Category + Reference */}
        <View style={styles.topRow}>
          <View style={[styles.categoryPill, { backgroundColor: catColour.bg, borderColor: catColour.border }]}>
            <Text style={[styles.categoryPillText, { color: catColour.text }]}>{control.category}</Text>
          </View>
          <Text style={styles.refText}>{control.referenceSection}</Text>
        </View>

        {/* Name */}
        <Text style={styles.name}>{control.name}</Text>
        <Text style={styles.shortDesc}>{control.shortDescription}</Text>

        {/* Animation hint */}
        {animCount > 0 && (
          <View style={styles.animHint}>
            <Feather name="play-circle" size={14} color={C.green700} />
            <Text style={styles.animHintText}>
              {animCount} requirement{animCount !== 1 ? "s" : ""} have animated visuals — tap to view
            </Text>
          </View>
        )}

        {/* Purpose */}
        <Section
          icon="target"
          title="Purpose"
          items={control.purpose}
          iconColour={C.green700}
        />

        {/* Requirements — tappable */}
        <Section
          icon="check-circle"
          title="Blue Book Requirements"
          items={control.requirements}
          iconColour={C.blue}
          controlId={control.id}
          onAnimationPress={handleAnimationPress}
        />

        {/* Signs of Failure */}
        <Section
          icon="alert-triangle"
          title="Signs of Failure"
          items={control.signsOfFailure}
          iconColour={C.amber}
        />

        {/* Immediate Actions */}
        <View style={[styles.section, styles.immediateBox]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBox, { backgroundColor: `${C.red}20` }]}>
              <Feather name="zap" size={16} color={C.red} />
            </View>
            <Text style={[styles.sectionTitle, { color: C.red }]}>Immediate Actions</Text>
          </View>
          {control.immediateActions.map((item, i) => (
            <View key={i} style={styles.bulletRow}>
              <View style={[styles.bullet, { backgroundColor: C.red }]} />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Stop Work Trigger */}
        <View style={styles.stopWorkBox}>
          <View style={styles.stopWorkHeader}>
            <Feather name="octagon" size={18} color={C.white} />
            <Text style={styles.stopWorkTitle}>STOP WORK TRIGGER</Text>
          </View>
          <Text style={styles.stopWorkText}>{control.stopWorkTrigger}</Text>
        </View>

        {/* Reinstatement */}
        <Section
          icon="refresh-cw"
          title="Reinstatement Requirements"
          items={control.reinstatement}
          iconColour={C.green600}
        />

        {/* Report failure button */}
        <Pressable
          style={({ pressed }) => [styles.reportBtn, { opacity: pressed ? 0.85 : 1 }]}
          onPress={() =>
            router.push({ pathname: "/new-incident", params: { type: "control_failure", controlId: control.id } })
          }
        >
          <Feather name="alert-circle" size={18} color={C.white} />
          <Text style={styles.reportBtnText}>Report This Control Has Failed</Text>
        </Pressable>
      </ScrollView>

      {/* Animation modal */}
      <RequirementAnimationModal
        animation={activeAnimation}
        onClose={handleModalClose}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  content: { paddingHorizontal: 20, paddingTop: 20, gap: 0 },

  notFound: {
    flex: 1, alignItems: "center", justifyContent: "center", gap: 12, backgroundColor: C.bg,
  },
  notFoundText: { fontFamily: "Inter_500Medium", fontSize: 16, color: C.textMuted },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  categoryPillText: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  refText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: C.textMuted,
    flex: 1,
    textAlign: "right",
    paddingLeft: 10,
  },

  name: {
    fontFamily: "Inter_700Bold",
    fontSize: 26,
    color: C.text,
    letterSpacing: -0.5,
    marginBottom: 8,
    lineHeight: 34,
  },
  shortDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: C.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },

  animHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: C.green100,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: `${C.green600}50`,
  },
  animHintText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: C.green700,
    flex: 1,
    lineHeight: 18,
  },

  section: {
    backgroundColor: C.bgCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: C.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  immediateBox: {
    borderWidth: 1.5,
    borderColor: `${C.red}40`,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  sectionIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: C.text,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 8,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  tappableBulletRow: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    marginHorizontal: -6,
    borderWidth: 1,
    borderColor: `${C.green700}20`,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    flexShrink: 0,
  },
  bulletText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: C.textSecondary,
    lineHeight: 21,
    flex: 1,
  },
  animBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: C.green100,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: `${C.green700}30`,
    flexShrink: 0,
  },
  animBadgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    color: C.green700,
  },

  stopWorkBox: {
    backgroundColor: C.red,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  stopWorkHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  stopWorkTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: C.white,
    letterSpacing: 1,
  },
  stopWorkText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: C.white,
    lineHeight: 21,
    opacity: 0.92,
  },

  reportBtn: {
    backgroundColor: C.red,
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
    minHeight: 56,
  },
  reportBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: C.white,
  },
});
