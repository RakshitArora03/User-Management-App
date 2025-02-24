/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config, { isServer }) => {
      if (isServer) {
        config.externals.push("bcrypt")
      }
      return config
    },
  }
  
 
  
  
export default nextConfig;
