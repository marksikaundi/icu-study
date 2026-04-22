import type { UploadRouter } from "@/uploadthing/router";
import { generateReactNativeHelpers } from "@uploadthing/expo";

export const {
  uploadFiles,
  useUploadThing,
  useDocumentUploader,
  useImageUploader,
  routeRegistry,
  getRouteConfig,
  createUpload,
} = generateReactNativeHelpers<UploadRouter>();
