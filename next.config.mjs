/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  experimental: {
    // mongoose pulls in optional native deps Next would otherwise try to bundle
    serverComponentsExternalPackages: ["mongoose", "bcryptjs", "nodemailer"],
    // Only bundle the icons actually used instead of the whole barrel — this
    // massively reduces module count and dev compile time for react-icons.
    optimizePackageImports: ["react-icons"],
  },
};

export default nextConfig;
