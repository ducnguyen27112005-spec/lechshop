import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["bcryptjs"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thatim.vn",
      },
    ],
  },
  outputFileTracingIncludes: {
    "/**/*": ["./prisma/dev.db"],
  },
};

export default nextConfig;
