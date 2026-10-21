import type { NextConfig } from "next";

// Static export, no server (DCD-A10): every page is prerendered from dashboard/data at build time; `npm run dev`
// serves the same pages with the same file reads. Query strings carry view state and are read on the client.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: false,
  devIndicators: false, // the owner reviews the running app; no framework badge in the screenshots
};

export default nextConfig;
