const path = require('path')

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    IMAGE_HOST: process.env.IMAGE_HOST,
    SERVERSIDE_HOST: process.env.SERVERSIDE_HOST,
    CLIENTSIDE_HOST: process.env.CLIENTSIDE_HOST,
  },
  images: {
    domains: ['storage.googleapis.com'],
  },
  eslint: {
    dirs: ['pages', 'app'],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'app/styles')],
  },
}
