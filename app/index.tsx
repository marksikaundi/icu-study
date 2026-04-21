import { account } from "@/lib/appwrite";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isActive = true;

    const resolveStartRoute = async () => {
      try {
        await account.get();
        if (isActive) {
          router.replace("/(tabs)");
        }
      } catch {
        if (isActive) {
          router.replace("/auth/sign-in");
        }
      } finally {
        if (isActive) {
          setIsChecking(false);
        }
      }
    };

    resolveStartRoute();

    return () => {
      isActive = false;
    };
  }, [router]);

  if (!isChecking) {
    return null;
  }

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="small" color="#2D2E3A" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F3F9",
  },
});
