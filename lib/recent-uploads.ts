import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "recent-uploads";
const MAX_ITEMS = 5;

export type RecentUploadItem = {
  id: string;
  title: string;
  category: string;
  program: string;
  fileName: string;
  mimeType?: string;
  uploadedAt: string;
};

const normalizeItems = (value: unknown): RecentUploadItem[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is RecentUploadItem =>
      Boolean(
        item &&
        typeof item === "object" &&
        "id" in item &&
        "title" in item &&
        "category" in item &&
        "program" in item &&
        "fileName" in item &&
        "uploadedAt" in item,
      ),
    )
    .map((item) => ({
      id: String(item.id),
      title: String(item.title),
      category: String(item.category),
      program: String(item.program),
      fileName: String(item.fileName ?? ""),
      mimeType: String((item as { mimeType?: string }).mimeType ?? ""),
      uploadedAt: String(item.uploadedAt),
    }));
};

export const getRecentUploads = async (): Promise<RecentUploadItem[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return normalizeItems(JSON.parse(raw));
  } catch {
    return [];
  }
};

export const addRecentUpload = async (
  entry: Omit<RecentUploadItem, "uploadedAt">,
): Promise<RecentUploadItem[]> => {
  const existing = await getRecentUploads();
  const now = new Date().toISOString();
  const nextItem: RecentUploadItem = { ...entry, uploadedAt: now };

  const filtered = existing.filter(
    (item) => !(item.id === nextItem.id && item.category === nextItem.category),
  );
  const next = [nextItem, ...filtered].slice(0, MAX_ITEMS);

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
};
