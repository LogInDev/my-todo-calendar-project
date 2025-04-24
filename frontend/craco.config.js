// 프로젝트 루트에 craco.config.js
const path = require('path');

module.exports = {
  style: {
    sass: {
      loaderOptions: {
        additionalData: `@use "src/assets/styles/main.scss" as main;`
      }
    }
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@utils': path.resolve(__dirname, 'src/utils'), 
    }
  }
};
