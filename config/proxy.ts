/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */

// export default {
//   dev: {
//     // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
//     '/api/': {
//       // 要代理的地址
//       target: 'https://preview.pro.ant.design',
//       // 配置了这个可以从 http 代理到 https
//       // 依赖 origin 的功能可能需要这个，比如 cookie
//       changeOrigin: true,
//     },
//   },
//   test: {
//     '/api/': {
//       target: 'https://proapi.azurewebsites.net',
//       changeOrigin: true,
//       pathRewrite: { '^': '' },
//     },
//   },
//   pre: {
//     '/api/': {
//       target: 'your pre url',
//       changeOrigin: true,
//       pathRewrite: { '^': '' },
//     },
//   },
// };

// 192.168.30.108

export default {
  dev: {
    '/api/': {
      // target: 'http://192.168.30.240:8888',
      // 192.168.30.108:8000
      target: 'http://192.168.5.108:8002/api',
      // target: 'http://192.168.5.86:8004/api',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'http://192.168.5.108',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};

// export default {
//   dev: {
//     '/api/': {
//       // target: 'http://192.168.30.240:8888',
//       target: 'http://192.168.30.28:8888',
//       changeOrigin: true,
//       pathRewrite: { '^/api': '' },
//     },
//   },
//   test: {
//     '/api/': {
//       target: 'https://preview.pro.ant.design',
//       changeOrigin: true,
//       pathRewrite: { '^': '' },
//     },
//   },
//   pre: {
//     '/api/': {
//       target: 'your pre url',
//       changeOrigin: true,
//       pathRewrite: { '^': '' },
//     },
//   },
// };
