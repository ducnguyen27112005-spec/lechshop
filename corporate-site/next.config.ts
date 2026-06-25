import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["bcryptjs"],
  outputFileTracingIncludes: {
    "/**/*": ["./prisma/dev.db"],
  },
};

export default nextConfig;
