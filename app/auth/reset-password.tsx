import { account } from "@/lib/appwrite";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
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
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ userId?: string; secret?: string }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { userId, secret } = useMemo(
    () => ({
      userId: params.userId ? String(params.userId) : "",
      secret: params.secret ? String(params.secret) : "",
    }),
    [params.secret, params.userId],
  );

  const handleReset = async () => {
    if (!userId || !secret) {
      Alert.alert(
        "Invalid link",
        "This reset link is missing information. Request a new one.",
      );
      return;
    }

    if (!password || !confirmPassword) {
      Alert.alert("Missing details", "Enter and confirm your new password.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match", "Check and try again.");
      return;
    }

    try {
      setIsSubmitting(true);
      await account.updateRecovery(userId, secret, password, confirmPassword);
      Alert.alert("Password updated", "You can sign in now.");
      router.replace("/auth/sign-in");
    } catch (error) {
      const message =
        typeof error === "object" && error && "message" in error
          ? String(error.message)
          : "Unable to reset your password right now.";
      Alert.alert("Reset failed", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Reset password</Text>
            <Text style={styles.subtitle}>
              Choose a strong password to secure your account.
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.label}>New password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter a new password"
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#9AA0B6"
            />

            <Text style={styles.label}>Confirm password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Repeat the password"
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#9AA0B6"
            />

            <Pressable style={styles.submitButton} onPress={handleReset}>
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitText}>Update password</Text>
              )}
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Link href="/auth/sign-in" asChild>
              <Pressable>
                <Text style={styles.footerLink}>Back to sign in</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F3F9",
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 32,
    gap: 20,
  },
  header: {
    gap: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D2E3A",
  },
  subtitle: {
    fontSize: 13,
    color: "#7A7D92",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    gap: 12,
  },
  label: {
    fontSize: 12,
    color: "#5A5F76",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E6E4EF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#2D2E3A",
    backgroundColor: "#F9F8FD",
  },
  submitButton: {
    marginTop: 6,
    backgroundColor: "#2D2E3A",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  footer: {
    alignItems: "center",
  },
  footerLink: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2D2E3A",
  },
});
