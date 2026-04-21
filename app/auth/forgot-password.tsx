import { account } from "@/lib/appwrite";
import * as Linking from "expo-linking";
import { Link } from "expo-router";
import { useState } from "react";
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

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRecovery = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      Alert.alert("Missing email", "Enter the email you signed up with.");
      return;
    }

    try {
      setIsSubmitting(true);
      const redirectUrl = Linking.createURL("/auth/reset-password");
      await account.createRecovery(trimmedEmail, redirectUrl);
      Alert.alert(
        "Check your inbox",
        "We sent a reset link to your email address.",
      );
    } catch (error) {
      const message =
        typeof error === "object" && error && "message" in error
          ? String(error.message)
          : "Unable to send a reset link right now.";
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
            <Text style={styles.title}>Forgot password</Text>
            <Text style={styles.subtitle}>
              Enter your email to get a reset link.
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              placeholderTextColor="#9AA0B6"
            />

            <Pressable style={styles.submitButton} onPress={handleRecovery}>
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitText}>Send reset link</Text>
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
