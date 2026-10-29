import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Django routes end in "/" and its APPEND_SLASH redirects are not
  // same-origin safe through the proxy, so let Django receive the exact path.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: "/backend/api/:path*",
        destination: `${process.env.DJANGO_ORIGIN ?? "http://127.0.0.1:8000"}/api/:path*/`,
      },
    ];
  },
};

export default nextConfig;
