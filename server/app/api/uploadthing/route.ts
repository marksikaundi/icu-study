import { createRouteHandler } from "uploadthing/next";
import { uploadRouter } from "../../../../uploadthing/router";

export const { GET, POST } = createRouteHandler({
  router: uploadRouter,
});
