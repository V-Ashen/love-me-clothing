/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: 'https://love-me-clothing-admin-sepia.vercel.app/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
