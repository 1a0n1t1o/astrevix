import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "motion"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xffrnxrkjcoqcaxhcqor.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
