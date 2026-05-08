import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { z } from "zod";
import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthScreenShell } from "@/components/auth/auth-screen-shell";
import { AppButton } from "@/components/ui/button";
import { AppInput } from "@/components/ui/input";
import { signInWithEmail, signInWithGoogle } from "@/services/auth";
import { useAuthStore } from "@/state/auth-store";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function SignInScreen() {
  const router = useRouter();
  const { continueAsGuest } = useAuthStore();
  const [pending, setPending] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), mode: "onSubmit" });

  const onSubmit = async (data: FormData) => {
    try {
      setPending(true);
      setErrorText(null);
      await signInWithEmail(data.email, data.password);
      router.replace("/(onboarding)");
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to sign in.");
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthScreenShell
      eyebrow="Campus Market"
      title="Welcome back"
      subtitle="Sign in to browse listings, message sellers, and post what you no longer need—all near campus."
      footer={
        <View className="flex-row flex-wrap items-center justify-center gap-1">
          <Text className="text-sm text-zinc-500 dark:text-zinc-400">New here?</Text>
          <Link href="/(auth)/sign-up" asChild>
            <Pressable hitSlop={12}>
              <Text className="text-sm font-semibold text-accent-600 dark:text-accent-500">Create an account</Text>
            </Pressable>
          </Link>
        </View>
      }
    >
      <View className="gap-4">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <AppInput
              label="Email"
              placeholder="you@university.edu"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <AppInput
              label="Password"
              placeholder="••••••••"
              secureTextEntry
              autoComplete="password"
              value={value}
              onChangeText={onChange}
              error={errors.password?.message}
            />
          )}
        />
        {errorText ? (
          <View className="rounded-xl bg-red-50 px-3 py-2.5 dark:bg-red-950/40">
            <Text className="text-sm text-red-700 dark:text-red-300">{errorText}</Text>
          </View>
        ) : null}
        <AppButton label={pending ? "Signing in…" : "Sign in"} onPress={handleSubmit(onSubmit)} disabled={pending} />
        <AuthDivider />
        <AppButton
          label="Continue with Google"
          variant="outline"
          disabled={pending}
          icon={<Ionicons name="logo-google" size={20} color="#4285F4" />}
          onPress={async () => {
            try {
              setPending(true);
              setErrorText(null);
              await signInWithGoogle();
              router.replace("/(onboarding)");
            } catch (error) {
              setErrorText(error instanceof Error ? error.message : "Google sign-in failed.");
            } finally {
              setPending(false);
            }
          }} />
        <AppButton
          label="Continue as guest"
          variant="secondary"
          disabled={pending}
          onPress={() => {
            continueAsGuest();
            router.replace("/(onboarding)");
          }}
        />
        <Text className="text-center text-xs leading-5 text-zinc-400 dark:text-zinc-500">
          Guest mode lets you browse. You&apos;ll need an account to sell or chat.
        </Text>
      </View>
    </AuthScreenShell>
  );
}
