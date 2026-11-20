/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy /api/* to the backend so auth cookies stay first-party (works on Vercel).
  async rewrites() {
    const backend = process.env.BACKEND_URL || "http://localhost:8000";
    return [{ source: "/api/:path*", destination: `${backend}/api/:path*` }];
  },
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
};
export default nextConfig;
