import { createFileRoute } from "@tanstack/react-router";

// Captured once at module load — changes whenever the server restarts
// (i.e. after a new build / deploy from Hermes commits).
const BUILD_ID =
  process.env.VITE_BUILD_ID ||
  process.env.BUILD_ID ||
  process.env.CF_PAGES_COMMIT_SHA ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  String(Date.now());

export const Route = createFileRoute("/api/public/build-id")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(
          JSON.stringify({ buildId: BUILD_ID, ts: Date.now() }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-store, no-cache, must-revalidate",
              "Access-Control-Allow-Origin": "*",
            },
          },
        );
      },
    },
  },
});