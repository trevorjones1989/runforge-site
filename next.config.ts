import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.runforge.ca" }],
        destination: "https://runforge.ca/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
