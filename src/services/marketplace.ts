import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { supabase } from "@/src/lib/supabase";

export const saveSearch = async (userId: string, query: string, category?: string) => {
  const { error } = await supabase.from("saved_searches").insert({
    user_id: userId,
    query,
    category: category ?? null,
  });
  if (error) throw error;
};

export const registerPushToken = async (userId: string) => {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") return null;
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  const { error } = await supabase.from("push_tokens").upsert({
    user_id: userId,
    token,
    platform: Platform.OS,
  });
  if (error) throw error;
  return token;
};

export const computeTrustScore = ({
  avgRating,
  completedSales,
  reportCount,
  verificationBonus,
}: {
  avgRating: number;
  completedSales: number;
  reportCount: number;
  verificationBonus: boolean;
}) => {
  const ratingScore = Math.min(40, Math.round((avgRating / 5) * 40));
  const salesScore = Math.min(35, completedSales);
  const reportPenalty = Math.min(30, reportCount * 6);
  const verifiedScore = verificationBonus ? 15 : 0;
  return Math.max(0, Math.min(100, ratingScore + salesScore + verifiedScore - reportPenalty));
};
