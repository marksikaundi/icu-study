export const APPWRITE_IDS = {
  databaseId: "69e35bf30037b0cf93c7",
  storageBucketId: "icu-data",
  collections: {
    programs: "CHANGE_ME",
    chapters: "CHANGE_ME",
    materials: "materials",
    assignments: "assignments",
    notes: "notes",
    resources: "resources",
  },
} as const;

export const isConfigured = (value: string) =>
  Boolean(value && !value.startsWith("CHANGE_ME"));
