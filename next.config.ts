import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Event data is read from /content at runtime by the chat API, so make sure
  // those files are bundled into the serverless function.
  outputFileTracingIncludes: {
    "/api/chat": ["./content/**/*.json"],
  },
  images: {
    qualities: [72, 75],
    localPatterns: [
      {
        pathname: "/**",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.lumacdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.lu.ma",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
