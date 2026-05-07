import { Pressable, Text } from "react-native";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
};

export const AppButton = ({ label, onPress, variant = "primary", disabled }: Props) => (
  <Pressable
    disabled={disabled}
    onPress={onPress}
    className={`items-center justify-center rounded-2xl px-4 py-3 ${
      variant === "primary" ? "bg-black dark:bg-white" : "bg-zinc-100 dark:bg-zinc-800"
    } ${disabled ? "opacity-50" : ""}`}
  >
    <Text className={`font-semibold ${variant === "primary" ? "text-white dark:text-black" : "text-zinc-950 dark:text-zinc-100"}`}>
      {label}
    </Text>
  </Pressable>
);
