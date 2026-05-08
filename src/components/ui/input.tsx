import { Text, TextInput, TextInputProps, View } from "react-native";

type Props = TextInputProps & {
  label?: string;
  error?: string;
};

export const AppInput = ({ label, error, className, ...props }: Props) => (
  <View className="gap-1.5">
    {label ? (
      <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</Text>
    ) : null}
    <View
      className={`rounded-2xl border bg-white px-4 py-3 dark:bg-zinc-950/50 ${
        error ? "border-red-400 dark:border-red-500/70" : "border-zinc-200 dark:border-zinc-700"
      }`}
    >
      <TextInput
        placeholderTextColor="#9ca3af"
        className={`min-h-[22px] text-base text-zinc-950 dark:text-zinc-100 ${className ?? ""}`}
        {...props}
      />
    </View>
    {error ? <Text className="text-xs text-red-500 dark:text-red-400">{error}</Text> : null}
  </View>
);
