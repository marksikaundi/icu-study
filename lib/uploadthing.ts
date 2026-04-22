import type { UploadRouter } from "@/uploadthing/router";
import { generateReactNativeHelpers } from "@uploadthing/expo";

const uploadthingUrl = process.env.EXPO_PUBLIC_UPLOADTHING_URL;

export const {
  uploadFiles,
  useUploadThing,
  useDocumentUploader,
  useImageUploader,
  routeRegistry,
  getRouteConfig,
  createUpload,
} = generateReactNativeHelpers<UploadRouter>(
  uploadthingUrl ? { url: uploadthingUrl } : undefined,
);
