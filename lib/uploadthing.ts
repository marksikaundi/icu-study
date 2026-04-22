import { generateReactNativeHelpers } from "@uploadthing/expo";
import type { UploadRouter } from "@/uploadthing/router";

export const {
  uploadFiles,
  useUploadThing,
  useDocumentUploader,
  useImageUploader,
  routeRegistry,
  getRouteConfig,
  createUpload,
} = generateReactNativeHelpers<UploadRouter>();
