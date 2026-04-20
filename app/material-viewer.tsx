import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export default function MaterialViewerScreen() {
  const navigation = useNavigation();
  const { url, title } = useLocalSearchParams<{
    url?: string | string[];
    title?: string | string[];
  }>();

  const resolvedUrl = useMemo(() => {
    if (Array.isArray(url)) {
      return url[0];
    }
    return url;
  }, [url]);

  const resolvedTitle = useMemo(() => {
    if (Array.isArray(title)) {
      return title[0];
    }
    return title ?? "Material";
  }, [title]);

  useEffect(() => {
    navigation.setOptions({ title: resolvedTitle });
  }, [navigation, resolvedTitle]);

  if (!resolvedUrl) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No file to preview</Text>
          <Text style={styles.emptySubtitle}>
            Please select a material with a valid file link.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <WebView
        source={{ uri: resolvedUrl }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loadingState}>
            <ActivityIndicator size="small" color="#2D2E3A" />
            <Text style={styles.loadingText}>Loading preview...</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F3F9",
  },
  loadingState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  loadingText: {
    fontSize: 12,
    color: "#7A7D92",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D2E3A",
  },
  emptySubtitle: {
    fontSize: 12,
    color: "#7A7D92",
    textAlign: "center",
  },
});
