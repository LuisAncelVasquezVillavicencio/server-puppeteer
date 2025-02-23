/** @type {import('next').NextConfig} */
const nextConfig = {
    webpackDevMiddleware: (config) => {
      config.watchOptions = {
        ignored: ["**/node_modules/**", "**/.next/**"],
      };
      return config;
    },
    env: {
      NEXT_DISABLE_HMR: "1", // Desactiva Hot Module Replacement en producción
    },
  };
  
  module.exports = nextConfig;
  