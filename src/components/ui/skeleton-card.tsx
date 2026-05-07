import { MotiView } from "moti";

export const SkeletonCard = () => (
  <MotiView
    from={{ opacity: 0.4 }}
    animate={{ opacity: 1 }}
    transition={{ type: "timing", duration: 900, loop: true }}
    className="mr-3 h-56 w-56 rounded-3xl bg-zinc-200 dark:bg-zinc-800"
  />
);
