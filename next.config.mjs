/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Ignore build warnings
    config.ignoreWarnings = [/Some warning you want to ignore/];
    return config;
  },
  // Ignore specific types of errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export',
  trailingSlash: true
}

export default nextConfig;
