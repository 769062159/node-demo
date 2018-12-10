const path = require('path');

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [
    // ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }],
  ],
  define: {
    'process.env':{
      'test': {
        uploadUrl: 'http://dev-api.store.314live.cn/merchant/upload',
        videoUrl: 'dev_audio',
        pic: 'dev_pic',
        apiurl: 'http://dev-api.store.314live.cn',
        wxTxt: 'http://wechat.store.314live.cn/wx/wechataccount/upload/txt',
      },
      'env': {
        uploadUrl: 'http://api.store.314live.cn/merchant/upload',
        videoUrl: 'audio',
        pic: 'pic',
        apiurl: 'http://api.store.314live.cn',
        wxTxt: 'http://wechat.store.314live.cn/wx/wechataccount/upload/txt',
      }
    },
    /*cannot set NODE_ENV for userDefined*/
    'process.env.API_ENV': process.env.API_ENV,
  },
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  disableDynamicImport: true,
  publicPath: '/',
  hash: true,
};
