const url = {
  development: {
    //代理url
    targetUrl: 'localhost:xxxx',
    apiUrl: 'localhost:6666',
    //打开的端口
    port: 6666,
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