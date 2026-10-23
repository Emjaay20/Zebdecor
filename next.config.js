/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    '192.168.100.64',
    '192.168.100.64:3003',
    '10.98.83.105',
    '10.98.83.105:3003',
    'localhost:3003',
    'localhost',
    '127.0.0.1:3003',
    '127.0.0.1',
  ],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  async headers() {
    return [
      {
        source: '/models/:path*.glb',
        headers: [
          { key: 'Content-Type', value: 'model/gltf-binary' },
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      {
        source: '/models/:path*.usdz',
        headers: [
          { key: 'Content-Type', value: 'model/vnd.usdz+zip' },
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
