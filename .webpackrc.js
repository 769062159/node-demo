const path = require('path');

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [
    // ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }],
  ],
  define: {
    'process.env':{
      'dev': {
        uploadUrl: 'http://dev.shiqun.api.iyov.io/merchant/upload',
        videoUrl: 'dev_audio',
        pic: 'dev_pic',
        apiurl: 'http://dev.shiqun.api.iyov.io',
        wxapiurl: 'http://dev.wechat.shiqun.iyov.io',
        wxTxt: 'http://dev.wechat.shiqun.iyov.io/wx/wechataccount/upload/txt',
        adminUrl: 'http://dev.admin.shop.iyov.io',
        h5Url: 'http://dev.h5.shiqun.iyov.io'
      },
      'master': {
        uploadUrl: 'http://shiqun.api.iyov.io/merchant/upload',
        videoUrl: 'audio',
        pic: 'pic',
        apiurl: 'http://shiqun.api.iyov.io',
        wxapiurl: 'http://wechat.shiqun.iyov.io',
        wxTxt: 'http://wechat.shiqun.iyov.io/wx/wechataccount/upload/txt',
        adminUrl: 'http://admin.shop.iyov.io',
        h5Url: 'http://h5.shiqun.iyov.io'
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
