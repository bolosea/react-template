const express = require('express')
const webpack = require('webpack')
const webpackConfig = require('./webpack.dev.config');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const proxyMiddleware = require('http-proxy-middleware');
const open = require('opn');
const path = require('path');
const config = require('../config/index');

//默认port
let port = process.env.PORT || config.development.port;

//决定是否自动打开浏览器
let autoOpenBrowser = config.development.autoOpenBrowser || false,
    complier = webpack(webpackConfig),
    app = express();

//webpack-dev-middleware插件对更改的文件进行监控、编译
let devMiddleware = webpackDevMiddleware(complier, {
    // 这里是对 webpackDevMiddleware 的一些配置，具体其他配置我们下面已经列出来了。

    //绑定中间件的公共路径,与webpack配置的路径相同
    publicPath: webpackConfig.output.publicPath,
    quiet: true  //向控制台显示任何内容 
})

//hot-reload
let hotMiddleware = webpackHotMiddleware(complier,{
    log: false,
    heartbeat: 2000,
})

// force page reload when html-webpack-plugin template changes
complier.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        hotMiddleware.publish({ action: 'reload' })
        cb && cb()
    })
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

const ENV = process.env.CURRENT_ENV;

app.use(config[ENV]['proxyFilter'], proxyMiddleware({
    target: config[ENV]['targetUrl'],
    changeOrigin: true
}))

app.use(devMiddleware);

app.use(hotMiddleware);

//设置静态资源访问路径
app.use(express.static('public'));

//监听端口port
app.listen(port, (err) => {
    console.log('config[ENV][\'apiUrl\']: ',config[ENV]['apiUrl']);

    if(err) {
        console.log(err);
        return;
    }

    if(autoOpenBrowser && process.env.CURRENT_ENV !== 'production') {
        open(config[ENV]['apiUrl']);
    }

})
