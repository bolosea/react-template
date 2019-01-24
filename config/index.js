const url = {
  development: {
    //代理url
    targetUrl: 'http://localhost:xxxx',
    apiUrl: 'http://localhost:8888',
    //打开的端口
    port: 8888,
    autoOpenBrowser: true,
    //代理转发的前缀
    proxyFilter: '/amerchantAdmin',
    apiUrlFilter: '/merchantAdmin',
  },
  production: {
    apiUrl: 'localhost:6666',
    apiUrlFilter: '/merchantAdmin',
  }
}

module.exports = url;