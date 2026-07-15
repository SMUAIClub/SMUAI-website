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
  },
};

export default nextConfig;
