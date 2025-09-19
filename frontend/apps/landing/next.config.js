/** @type {import('next').NextConfig} */
const nextConfig = {
  // Стендэлон-вывод для контейнеризации
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'gmira.ru', pathname: '/directus/assets/**' },
    ],
  },
};

export default nextConfig;
