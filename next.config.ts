import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
  },
};

export default withAnalyzer(nextConfig);
