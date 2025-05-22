/** @type {import('next').NextConfig} */
const nextConfig = {
  // fixes wallet connect dependency issue https://docs.walletconnect.com/web3modal/nextjs/about#extra-configuration
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/di6vi1xlx/image/upload/**',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        port: '',
        pathname: '/free-photo/**',
      },
      {
        protocol: 'https',
        hostname: 'theinscribermag.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'mvnu.edu',
        port: '',
        pathname: '/content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.uhpcsolutions.com',
        port: '',
        pathname: '/hubfs/DJI_0130-1.jpg',
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
        port: '',
        pathname: '/jShdDhcX/**',
      },
    ],
  },
};

export default nextConfig;
