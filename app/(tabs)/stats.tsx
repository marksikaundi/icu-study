import HugeiconsIcon from "@/components/hugeicons-icon";
import { getRecentOpens, type RecentOpenItem } from "@/lib/recent-opens";
import {
  BarChartIcon,
  Clock01Icon,
  Tick01Icon,
  ZapIcon,
} from "@hugeicons/core-free-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StatsScreen() {
  const [recentOpens, setRecentOpens] = useState<RecentOpenItem[]>([]);
  const [recentError, setRecentError] = useState<string | null>(null);
  const highlights = useMemo(
    () => [
      {
        label: "Completed",
        value: "42",
        color: "#E6EDFF",
        icon: Tick01Icon,
      },
      { label: "Streak", value: "7 days", color: "#FFECCB", icon: ZapIcon },
      {
        label: "Avg Score",
        value: "86%",
        color: "#E8F8E7",
        icon: BarChartIcon,
      },
      {
        label: "Pending",
        value: "5",
        color: "#FFE3EB",
        icon: Clock01Icon,
      },
    ],
    [],
  );

  const loadRecentOpens = useCallback(async () => {
    try {
      const items = await getRecentOpens();
      setRecentOpens(items);
      setRecentError(null);
    } catch {
      setRecentError("Unable to load recent files right now.");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadRecentOpens();
    }, [loadRecentOpens]),
  );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Performance</Text>
          <Text style={styles.subtitle}>Your study metrics this week</Text>
        </View>

        <View style={styles.grid}>
          {highlights.map((item) => (
            <View
              key={item.label}
              style={[styles.metricCard, { backgroundColor: item.color }]}
            >
              <View style={styles.metricIcon}>
                <HugeiconsIcon icon={item.icon} size={16} color="#2D2E3A" />
              </View>
              <Text style={styles.metricValue}>{item.value}</Text>
              <Text style={styles.metricLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          <View style={styles.progressRow}>
            {Array.from({ length: 7 }).map((_, index) => (
              <View key={`day-${index}`} style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { height: `${30 + index * 8}%` },
                  ]}
                />
              </View>
            ))}
          </View>
          <Text style={styles.sectionHint}>
            You&apos;re up 12% from last week.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recent opened files</Text>
          {recentError ? (
            <Text style={styles.focusEmpty}>{recentError}</Text>
          ) : null}
          {!recentError && recentOpens.length === 0 ? (
            <Text style={styles.focusEmpty}>No files opened yet.</Text>
          ) : null}
          {!recentError && recentOpens.length > 0 ? (
            <View style={styles.focusRow}>
              {recentOpens.map((item) => (
                <View
                  key={`${item.category}-${item.id}`}
                  style={styles.focusItem}
                >
                  <Text style={styles.focusValue}>{item.title}</Text>
                  <Text style={styles.focusHint}>
                    {item.subtitle || item.category}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F3F9",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 40,
    gap: 18,
  },
  header: {
    gap: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2D2E3A",
  },
  subtitle: {
    fontSize: 13,
    color: "#7A7D92",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCard: {
    width: "47%",
    borderRadius: 18,
    padding: 14,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D2E3A",
  },
  metricLabel: {
    fontSize: 12,
    color: "#6D6F7F",
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2D2E3A",
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  progressBar: {
    width: 12,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#EEF0F6",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  progressFill: {
    backgroundColor: "#34356E",
    width: "100%",
    borderRadius: 8,
  },
  sectionHint: {
    fontSize: 12,
    color: "#7A7D92",
  },
  focusRow: {
    flexDirection: "column",
    gap: 10,
  },
  focusItem: {
    backgroundColor: "#F3F4FA",
    borderRadius: 14,
    padding: 12,
  },
  focusValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2D2E3A",
  },
  focusHint: {
    fontSize: 11,
    color: "#7A7D92",
    marginTop: 4,
  },
  focusEmpty: {
    fontSize: 12,
    color: "#7A7D92",
  },
});
