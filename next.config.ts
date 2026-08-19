import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""} https://*.clerk.accounts.dev https://*.clerk.dev https://clerk.com`,
  "style-src 'self' 'unsafe-inline' https://*.clerk.accounts.dev https://*.clerk.dev https://clerk.com",
  "img-src 'self' data: blob: https://img.clerk.com https://*.clerk.accounts.dev https://*.clerk.dev https://clerk.com",
  "font-src 'self' data: https://*.clerk.accounts.dev https://*.clerk.dev https://clerk.com",
  "connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.dev https://clerk.com",
  "frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.dev https://clerk.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDevelopment ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
