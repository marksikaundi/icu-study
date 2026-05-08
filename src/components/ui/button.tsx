import * as Haptics from "expo-haptics";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  icon?: ReactNode;
};

export const AppButton = ({ label, onPress, variant = "primary", disabled, icon }: Props) => {
  const base = "flex-row items-center justify-center gap-2 rounded-2xl px-4 py-3.5 active:opacity-90";
  const styles =
    variant === "primary"
      ? "bg-zinc-950 shadow-sm dark:bg-white dark:shadow-none"
      : variant === "outline"
        ? "border border-zinc-300 bg-transparent dark:border-zinc-600"
        : "border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/80";
  const textStyles =
    variant === "primary"
      ? "text-white dark:text-zinc-950"
      : variant === "outline"
        ? "text-zinc-900 dark:text-zinc-100"
        : "text-zinc-900 dark:text-zinc-100";

  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        if (!disabled) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.();
      }}
      className={`${base} ${styles} ${disabled ? "opacity-45" : ""}`}
    >
      {icon ? <View>{icon}</View> : null}
      <Text className={`text-base font-semibold ${textStyles}`}>{label}</Text>
    </Pressable>
  );
};
