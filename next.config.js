/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}
const withSass = require('@zeit/next-sass');

module.exports = withSass({
  cssModules: true, // Enable CSS modules if you want
});
module.exports = nextConfig
