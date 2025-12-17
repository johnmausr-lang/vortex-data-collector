/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development' // Отключаем в режиме разработки для удобства
});

const nextConfig = {
  reactStrictMode: true,
  // Разрешаем работу с внешними изображениями, если нужно
};

module.exports = withPWA(nextConfig);
