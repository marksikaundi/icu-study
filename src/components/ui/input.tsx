import { TextInput, TextInputProps, View } from "react-native";

export const AppInput = (props: TextInputProps) => (
  <View className="rounded-2xl border border-zinc-200 bg-white px-4 py-1 dark:border-zinc-800 dark:bg-zinc-900">
    <TextInput
      placeholderTextColor="#9ca3af"
      className="text-base text-zinc-950 dark:text-zinc-100"
      {...props}
    />
  </View>
);
