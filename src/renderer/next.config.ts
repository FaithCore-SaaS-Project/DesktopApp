import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * Enable static HTML export for local electron execution.
   * This builds the application into an 'out' folder with pure HTML/JS/CSS.
   */
  output: 'export',

  /*
   * Disable Next.js image optimization API.
   * Next.js image optimization requires a running Node.js server.
   * Inside Electron, images are loaded directly from local file paths, which does not support this server-side API.
   */
  images: {
    unoptimized: true,
  },

  /*
   * Trailing slashes ensure that static pages load reliably via local file protocols.
   */
  trailingSlash: true,
};

export default nextConfig;
