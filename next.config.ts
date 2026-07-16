import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
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
