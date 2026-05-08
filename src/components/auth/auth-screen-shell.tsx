import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthScreenShell({ title, subtitle, eyebrow, children, footer }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-zinc-50 dark:bg-zinc-950" edges={["top", "left", "right"]}>
      <View className="pointer-events-none absolute inset-0 overflow-hidden">
        <View className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-accent-500/20 dark:bg-accent-500/12" />
        <View className="absolute -bottom-36 -left-20 h-80 w-80 rounded-full bg-accent-600/15 dark:bg-accent-600/8" />
        <View className="absolute left-1/3 top-1/3 h-40 w-40 rounded-full bg-zinc-200/40 dark:bg-zinc-800/30" />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40, paddingTop: 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-8 mt-2">
            {eyebrow ? (
              <Text className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-600 dark:text-accent-500">
                {eyebrow}
              </Text>
            ) : null}
            <Text className="text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">{title}</Text>
            {subtitle ? <Text className="mt-3 max-w-sm text-base leading-6 text-zinc-500 dark:text-zinc-400">{subtitle}</Text> : null}
          </View>
          <View className="rounded-3xl border border-zinc-200/80 bg-white/95 p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/95">
            {children}
          </View>
          {footer ? <View className="mt-8 items-center">{footer}</View> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
