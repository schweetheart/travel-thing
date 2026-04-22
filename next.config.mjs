/** @type {import('next').NextConfig} */
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare"
initOpenNextCloudflareForDev()

const nextConfig = {
  typedRoutes: true,
  serverExternalPackages: [
    "@prisma/client",
    ".prisma/client",
    "@prisma/adapter-pg",
    "pg-cloudflare",
  ],
  allowedDevOrigins: ["192.168.1.243"],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  images: {
    remotePatterns: [new URL(process.env.R2_BUCKET_URL + "/**")],
  },
}

export default nextConfig
