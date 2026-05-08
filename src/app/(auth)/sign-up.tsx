import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { z } from "zod";
import { AuthScreenShell } from "@/components/auth/auth-screen-shell";
import { AppButton } from "@/components/ui/button";
import { AppInput } from "@/components/ui/input";
import { signUpWithEmail } from "@/services/auth";

const schema = z.object({
  username: z.string().min(2, "Pick a longer username").max(32, "Keep it under 32 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Use at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

export default function SignUpScreen() {
  const router = useRouter();
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
      await signUpWithEmail(data.email, data.password, { username: data.username });
      router.replace("/(onboarding)");
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Failed to create account.");
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthScreenShell
      eyebrow="Join the market"
      title="Create your profile"
      subtitle="Choose a username students will recognize. You can connect your campus in the next step."
      footer={
        <View className="flex-row items-center gap-1">
          <Text className="text-sm text-zinc-500 dark:text-zinc-400">Already have an account?</Text>
          <Link href="/(auth)/sign-in" asChild>
            <Pressable hitSlop={12}>
              <Text className="text-sm font-semibold text-accent-600 dark:text-accent-500">Sign in</Text>
            </Pressable>
          </Link>
        </View>
      }
    >
      <View className="gap-4">
        <View className="mb-1 flex-row items-center gap-2 rounded-2xl bg-zinc-100 px-4 py-3 dark:bg-zinc-800/60">
          <Ionicons name="shield-checkmark-outline" size={22} color="#71717a" />
          <Text className="flex-1 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
            We never show your email on listings. Your username is public.
          </Text>
        </View>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, value } }) => (
            <AppInput
              label="Username"
              placeholder="campus_seller"
              autoCapitalize="none"
              autoComplete="username"
              value={value}
              onChangeText={onChange}
              error={errors.username?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <AppInput
              label="School email"
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
              placeholder="8+ characters"
              secureTextEntry
              autoComplete="new-password"
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
        <AppButton label={pending ? "Creating account…" : "Create account"} onPress={handleSubmit(onSubmit)} disabled={pending} />
        <Text className="text-center text-xs leading-5 text-zinc-400 dark:text-zinc-500">
          By continuing you agree to respectful buying and selling in your community.
        </Text>
      </View>
    </AuthScreenShell>
  );
}
