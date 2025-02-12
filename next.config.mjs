/** @type {import('next').NextConfig} */
const nextConfig = {
    // For deploying on GitHub Pages in a subdirectory
    basePath: '/fetch_fe_exercise',  // Replace 'your-repo-name' with your actual GitHub repository name
    assetPrefix: '/fetch_fe_exercise',  // Same as above
  
    // Ensures all URLs have trailing slashes for better routing in static export
    exportTrailingSlash: true,
  
    // Output folder for exported static files
    distDir: 'build',
  
    // Optional: If you're using any environment variables for production, make sure to set them here
    env: {
      CUSTOM_ENV: process.env.CUSTOM_ENV || 'default_value',
    },
  };
  
  export default nextConfig;