/** @type {import('next').NextConfig} */
const nextConfig = {
  // ===== Memory & Performance Optimizations =====
  swcMinify: true,              // Use Rust-based SWC (faster, lower memory)
  productionBrowserSourceMaps: false, // Disable prod source maps to save memory
  experimental: {
    workerThreads: false,       // Disable Webpack parallelism (reduces memory)
    cpus: 1,                    // Limit to 1 CPU core
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },

  // ── API Proxy ─────────────────────────────────────────────────────────────
  // Browser calls /api/tashus/... → Next.js server forwards to the external API.
  // This sidesteps CORS since the rewrite happens server-side.
  async rewrites() {
    return [
      {
        source: '/api/tashus/:path*',
        destination: 'https://dev-testing-api.tashus.com/api/:path*',
      },
    ];
  },

  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: { icon: true },
        },
      ],
    });
    config.externals.push({
      'node:crypto': 'commonjs crypto',
    });

    return config;
  },
  images: {
    domains: ['res.cloudinary.com', 'loremflickr.com', 'flagcdn.com'],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;


// Injected content via Sentry wizard below
const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    org: "siara-solutions-pty-ltd",
    project: "tashus-frontend",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: false, // Disable to reduce memory usage during build

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    automaticVercelMonitors: true,
    sourcemaps: {
      disable: true, // Completely disables source map generation/upload
    },
  }
);
