import { Text, View } from "react-native";

export function AuthDivider({ label = "or" }: { label?: string }) {
  return (
    <View className="my-6 flex-row items-center gap-4">
      <View className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
      <Text className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{label}</Text>
      <View className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
    </View>
  );
}
