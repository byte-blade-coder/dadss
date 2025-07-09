// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: false,
//   webpack(config) {
//     config.module.rules.push({
//       test: /\.svg$/i,
//       issuer: /\.[jt]sx?$/,
//       use: ['@svgr/webpack'],
//     })

//     return config
//   },
// };

// module.exports = nextConfig;
const nextConfig = {
  webpack: (config) => {
    // Remove any references to @svgr/webpack here
    return config;
  },
};
module.exports = nextConfig;
