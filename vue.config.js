const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'node_modules/@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff2'),
            to: path.resolve(__dirname, 'public/fonts/DMSans-Regular.woff2')
          },
          {
            from: path.resolve(__dirname, 'node_modules/@fontsource/dm-sans/files/dm-sans-latin-500-normal.woff2'),
            to: path.resolve(__dirname, 'public/fonts/DMSans-Medium.woff2')
          },
          {
            from: path.resolve(__dirname, 'node_modules/@fontsource/dm-sans/files/dm-sans-latin-700-normal.woff2'),
            to: path.resolve(__dirname, 'public/fonts/DMSans-Bold.woff2')
          },
          {
            from: path.resolve(__dirname, 'node_modules/@mdi/font/fonts/materialdesignicons-webfont.woff2'),
            to: path.resolve(__dirname, 'public/fonts/materialdesignicons-webfont.woff2')
          },
          {
            from: path.resolve(__dirname, 'node_modules/@mdi/font/fonts/materialdesignicons-webfont.woff'),
            to: path.resolve(__dirname, 'public/fonts/materialdesignicons-webfont.woff')
          }
        ]
      })
    ]
  }
}