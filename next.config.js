/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    config.module.rules.push({
      test: /\.ttf$/,
      type: 'asset/resource',
    });

    config.ignoreWarnings = [
      { module: /node_modules\/monaco-editor/ },
    ];

    return config;
  },
};

module.exports = nextConfig;

