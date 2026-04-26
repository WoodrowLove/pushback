/** @type {import('next').NextConfig} */
const nextConfig = {
  // Treat the route handlers as the API; they handle file uploads
  // and stream LLM output.
  experimental: {
    serverActions: { bodySizeLimit: "10mb" },
  },
  // No telemetry to a third party at runtime.
  eslint: {
    // Don't let lint issues block prod builds during MVP.
    ignoreDuringBuilds: true,
  },
};
module.exports = nextConfig;
