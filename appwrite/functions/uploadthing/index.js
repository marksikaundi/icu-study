import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "../../../uploadthing/router";

const handler = createRouteHandler({
  router: uploadRouter,
});

const buildRequestUrl = (req, headers) => {
  const rawUrl = req.url ?? req.path ?? "/api/uploadthing";
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    return rawUrl;
  }

  const proto = headers.get("x-forwarded-proto") ?? "https";
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  const base = host ? `${proto}://${host}` : "https://localhost";
  return new URL(rawUrl, base).toString();
};

export default async ({ req, res, log, error }) => {
  try {
    const method = req.method ?? "GET";
    const headers = new Headers();

    for (const [key, value] of Object.entries(req.headers ?? {})) {
      if (value === undefined || value === null) {
        continue;
      }
      headers.set(key, Array.isArray(value) ? value.join(",") : String(value));
    }

    const body =
      method === "GET" || method === "HEAD"
        ? undefined
        : req.bodyRaw ??
          (req.body ? JSON.stringify(req.body) : undefined);

    const requestUrl = buildRequestUrl(req, headers);
    const response = await handler(
      new Request(requestUrl, {
        method,
        headers,
        body,
      }),
    );

    const responseBody = await response.text();
    const responseHeaders = Object.fromEntries(response.headers.entries());
    return res.send(responseBody, response.status, responseHeaders);
  } catch (err) {
    error(String(err));
    return res.json(
      {
        error: "UploadThing function error",
      },
      500,
    );
  }
};
