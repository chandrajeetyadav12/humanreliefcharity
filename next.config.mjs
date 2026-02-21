/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  // Optimize for AWS Amplify deployment
  images: {
    unoptimized: true, // Required for static exports on some platforms
  },
  // Ensure API routes work properly
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
};

export default nextConfig;
