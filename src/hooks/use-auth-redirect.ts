import { useSegments, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "@/src/state/auth-store";

export const useAuthRedirect = () => {
  const router = useRouter();
  const segments = useSegments();
  const { userId, isGuest, onboardingDone } = useAuthStore();

  useEffect(() => {
    const inAuth = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "(onboarding)";

    if (!userId && !isGuest && !inAuth) {
      router.replace("/(auth)/sign-in");
      return;
    }

    if ((userId || isGuest) && !onboardingDone && !inOnboarding) {
      router.replace("/(onboarding)");
      return;
    }

    if ((userId || isGuest) && onboardingDone && (inAuth || inOnboarding)) {
      router.replace("/(tabs)");
    }
  }, [userId, isGuest, onboardingDone, segments, router]);
};
