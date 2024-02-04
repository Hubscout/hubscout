/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    RAILWAY_URL: process.env.RAILWAY_URL,
    NEYNAR_API_KEY: process.env.NEYNAR_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    POSTHOG_URL: process.env.POSTHOG_URL,
    PROFILES_NAME: process.env.PROFILES_NAME,
    COLLECTION_NAME: process.env.COLLECTION_NAME,
    URL: process.env.URL,
  },
};

module.exports = nextConfig;
