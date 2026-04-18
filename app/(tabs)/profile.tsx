import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Account settings live here.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F3F9",
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2D2E3A",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#7A7D92",
  },
});
