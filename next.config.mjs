/** @type {import('next').NextConfig} */
const nextConfig = {
  // The Brain (Obsidian vault) lives alongside the app; keep it out of the build.
  outputFileTracingExcludes: {
    "*": ["./brain/**", "./gcp-service-account.json"],
  },
  // Don't bundle these — they use Node/pdfjs internals that break when webpacked.
  serverExternalPackages: ["pdf-parse", "mammoth"],
};

export default nextConfig;
