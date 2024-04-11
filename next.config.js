/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEYNAR_API_KEY: process.env.NEYNAR_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    URL: process.env.URL,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
    AMPLITUDE_API: process.env.AMPLITUDE_API,
  },
};

module.exports = nextConfig;
