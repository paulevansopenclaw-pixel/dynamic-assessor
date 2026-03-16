import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import C from "@/constants/colors";
import { useIncidents } from "@/context/IncidentsContext";
import { CONTROLS } from "@/data/environmentalControls";
import { IncidentType, INCIDENT_TYPE_LABELS, Severity } from "@/data/incidents";

const INCIDENT_TYPES: IncidentType[] = [
  "sediment_breach",
  "erosion_event",
  "chemical_spill",
  "dust_event",
  "stormwater_contamination",
  "vegetation_damage",
  "control_failure",
  "waste_dumping",
];

const SEVERITIES: { key: Severity; label: string; desc: string; colour: string; bg: string }[] = [
  {
    key: "low",
    label: "Low",
    desc: "Minor, contained on site",
    colour: C.green700,
    bg: C.green100,
  },
  {
    key: "medium",
    label: "Medium",
    desc: "Potential to leave site",
    colour: "#B45309",
    bg: "#FFF3E4",
  },
  {
    key: "high",
    label: "High",
    desc: "Controls failing — action today",
    colour: C.red,
    bg: C.redBg,
  },
  {
    key: "critical",
    label: "Critical",
    desc: "Off-site or regulatory breach",
    colour: C.white,
    bg: C.red,
  },
];

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <Text style={styles.label}>
      {label}
      {required && <Text style={{ color: C.red }}> *</Text>}
    </Text>
  );
}

export default function NewIncidentScreen() {
  const insets = useSafeAreaInsets();
  const { addIncident } = useIncidents();
  const params = useLocalSearchParams<{ type?: string; controlId?: string }>();

  const [title, setTitle] = useState("");
  const [incidentType, setIncidentType] = useState<IncidentType>(
    (params.type as IncidentType) ?? "sediment_breach"
  );
  const [severity, setSeverity] = useState<Severity>("medium");
  const [location, setLocation] = useState("");
  const [reportedBy, setReportedBy] = useState("");
  const [description, setDescription] = useState("");
  const [actionsTaken, setActionsTaken] = useState("");
  const [dateOccurred, setDateOccurred] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedControlId, setSelectedControlId] = useState<string | undefined>(
    params.controlId ?? undefined
  );
  const [submitting, setSubmitting] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showControlPicker, setShowControlPicker] = useState(false);

  const titleRef = useRef<TextInput>(null);

  const selectedControl = selectedControlId
    ? CONTROLS.find((c) => c.id === selectedControlId)
    : null;

  const isValid = title.trim() && location.trim() && reportedBy.trim();

  const handleSubmit = async () => {
    if (!isValid) {
      Alert.alert("Required fields missing", "Please fill in Title, Location, and Reported By before submitting.");
      return;
    }
    setSubmitting(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      await addIncident({
        title: title.trim(),
        description: description.trim(),
        incidentType,
        severity,
        status: "open",
        location: location.trim(),
        reportedBy: reportedBy.trim(),
        controlId: selectedControlId,
        controlName: selectedControl?.name,
        actionsTaken: actionsTaken.trim(),
        dateOccurred,
      });
      router.back();
    } catch {
      Alert.alert("Error", "Failed to save incident. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: C.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.pageTitle}>Report Environmental Incident</Text>

        {/* Title */}
        <View style={styles.fieldGroup}>
          <FieldLabel label="Incident Title" required />
          <TextInput
            ref={titleRef}
            style={styles.input}
            placeholder="e.g. Silt fence failed on northern boundary"
            placeholderTextColor={C.textMuted}
            value={title}
            onChangeText={setTitle}
            returnKeyType="next"
            autoCapitalize="sentences"
          />
        </View>

        {/* Incident Type */}
        <View style={styles.fieldGroup}>
          <FieldLabel label="Incident Type" required />
          <Pressable
            style={({ pressed }) => [styles.picker, { opacity: pressed ? 0.85 : 1 }]}
            onPress={() => setShowTypePicker(!showTypePicker)}
          >
            <Text style={styles.pickerValue}>{INCIDENT_TYPE_LABELS[incidentType]}</Text>
            <Feather name={showTypePicker ? "chevron-up" : "chevron-down"} size={18} color={C.textMuted} />
          </Pressable>
          {showTypePicker && (
            <View style={styles.pickerDropdown}>
              {INCIDENT_TYPES.map((type) => (
                <Pressable
                  key={type}
                  style={({ pressed }) => [
                    styles.pickerOption,
                    type === incidentType && styles.pickerOptionSelected,
                    { opacity: pressed ? 0.75 : 1 },
                  ]}
                  onPress={() => {
                    setIncidentType(type);
                    setShowTypePicker(false);
                    if (type !== "control_failure") setSelectedControlId(undefined);
                  }}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    type === incidentType && { color: C.green700, fontFamily: "Inter_600SemiBold" },
                  ]}>
                    {INCIDENT_TYPE_LABELS[type]}
                  </Text>
                  {type === incidentType && (
                    <Feather name="check" size={16} color={C.green700} />
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Related Control — only show for control_failure */}
        {incidentType === "control_failure" && (
          <View style={styles.fieldGroup}>
            <FieldLabel label="Failed Control (optional)" />
            <Pressable
              style={({ pressed }) => [styles.picker, { opacity: pressed ? 0.85 : 1 }]}
              onPress={() => setShowControlPicker(!showControlPicker)}
            >
              <Text style={[styles.pickerValue, !selectedControl && { color: C.textMuted }]}>
                {selectedControl ? selectedControl.name : "Select control..."}
              </Text>
              <Feather name={showControlPicker ? "chevron-up" : "chevron-down"} size={18} color={C.textMuted} />
            </Pressable>
            {showControlPicker && (
              <View style={styles.pickerDropdown}>
                <Pressable
                  style={({ pressed }) => [styles.pickerOption, { opacity: pressed ? 0.75 : 1 }]}
                  onPress={() => { setSelectedControlId(undefined); setShowControlPicker(false); }}
                >
                  <Text style={styles.pickerOptionText}>None</Text>
                </Pressable>
                {CONTROLS.map((control) => (
                  <Pressable
                    key={control.id}
                    style={({ pressed }) => [
                      styles.pickerOption,
                      control.id === selectedControlId && styles.pickerOptionSelected,
                      { opacity: pressed ? 0.75 : 1 },
                    ]}
                    onPress={() => { setSelectedControlId(control.id); setShowControlPicker(false); }}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      control.id === selectedControlId && { color: C.green700, fontFamily: "Inter_600SemiBold" },
                    ]} numberOfLines={2}>
                      {control.name}
                    </Text>
                    {control.id === selectedControlId && <Feather name="check" size={16} color={C.green700} />}
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Severity */}
        <View style={styles.fieldGroup}>
          <FieldLabel label="Severity" required />
          <View style={styles.severityGrid}>
            {SEVERITIES.map((sev) => (
              <Pressable
                key={sev.key}
                style={({ pressed }) => [
                  styles.severityOption,
                  { backgroundColor: sev.key === severity ? sev.bg : C.bgCard },
                  sev.key === severity && { borderColor: sev.colour, borderWidth: 2 },
                  { opacity: pressed ? 0.85 : 1 },
                ]}
                onPress={() => {
                  setSeverity(sev.key);
                  Haptics.selectionAsync();
                }}
              >
                <Text style={[
                  styles.severityLabel,
                  { color: sev.key === severity ? (sev.key === "critical" ? C.white : sev.colour) : C.textSecondary },
                ]}>
                  {sev.label}
                </Text>
                <Text style={[
                  styles.severityDesc,
                  { color: sev.key === severity ? (sev.key === "critical" ? "rgba(255,255,255,0.8)" : sev.colour) : C.textMuted },
                ]} numberOfLines={2}>
                  {sev.desc}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Location */}
        <View style={styles.fieldGroup}>
          <FieldLabel label="Location on Site" required />
          <TextInput
            style={styles.input}
            placeholder="e.g. Northern boundary, Grid J-7, Pump shed"
            placeholderTextColor={C.textMuted}
            value={location}
            onChangeText={setLocation}
            returnKeyType="next"
            autoCapitalize="sentences"
          />
        </View>

        {/* Reported by */}
        <View style={styles.fieldGroup}>
          <FieldLabel label="Reported By" required />
          <TextInput
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor={C.textMuted}
            value={reportedBy}
            onChangeText={setReportedBy}
            returnKeyType="next"
            autoCapitalize="words"
          />
        </View>

        {/* Date */}
        <View style={styles.fieldGroup}>
          <FieldLabel label="Date Occurred" required />
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={C.textMuted}
            value={dateOccurred}
            onChangeText={setDateOccurred}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>

        {/* Description */}
        <View style={styles.fieldGroup}>
          <FieldLabel label="Description" />
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Describe what happened, extent of impact, weather conditions, etc."
            placeholderTextColor={C.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
            numberOfLines={4}
            autoCapitalize="sentences"
          />
        </View>

        {/* Actions taken */}
        <View style={styles.fieldGroup}>
          <FieldLabel label="Actions Already Taken" />
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Describe any immediate actions already taken to contain or rectify..."
            placeholderTextColor={C.textMuted}
            value={actionsTaken}
            onChangeText={setActionsTaken}
            multiline
            textAlignVertical="top"
            numberOfLines={3}
            autoCapitalize="sentences"
          />
        </View>

        {/* Submit */}
        <Pressable
          style={({ pressed }) => [
            styles.submitBtn,
            !isValid && styles.submitBtnDisabled,
            { opacity: (pressed && isValid) ? 0.88 : 1 },
          ]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <Text style={styles.submitBtnText}>Submitting...</Text>
          ) : (
            <>
              <Feather name="check-circle" size={18} color={C.white} />
              <Text style={styles.submitBtnText}>Submit Incident Report</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 20, gap: 0 },
  pageTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: C.text,
    letterSpacing: -0.3,
    marginBottom: 20,
  },

  fieldGroup: { marginBottom: 18 },
  label: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: C.text,
    marginBottom: 8,
  },

  input: {
    backgroundColor: C.bgCard,
    borderWidth: 1.5,
    borderColor: C.borderLight,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: C.text,
    minHeight: 52,
  },
  multiline: {
    minHeight: 100,
    paddingTop: 14,
  },

  picker: {
    backgroundColor: C.bgCard,
    borderWidth: 1.5,
    borderColor: C.borderLight,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 52,
  },
  pickerValue: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    color: C.text,
    flex: 1,
  },
  pickerDropdown: {
    backgroundColor: C.bgCard,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.borderLight,
    marginTop: 6,
    overflow: "hidden",
    shadowColor: C.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  pickerOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
    minHeight: 52,
  },
  pickerOptionSelected: { backgroundColor: C.green100 },
  pickerOptionText: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: C.text,
    flex: 1,
    marginRight: 8,
  },

  severityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  severityOption: {
    width: "47%",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: C.borderLight,
    minHeight: 70,
    justifyContent: "center",
  },
  severityLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    marginBottom: 3,
  },
  severityDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 16,
  },

  submitBtn: {
    backgroundColor: C.green700,
    borderRadius: 14,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
    minHeight: 60,
    shadowColor: C.green900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  submitBtnDisabled: {
    backgroundColor: C.textMuted,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: C.white,
  },
});
