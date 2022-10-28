const CracoAntDesignPlugin = require('craco-antd');
const darkTheme = require('@ant-design/dark-theme');

module.exports = {
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: {
          ...darkTheme.default,
          '@primary-color': '#FF4000',
          '@link-color': '#E47955',
        },
      },
    },
  ],
  babel: {
    presets: [
      // This is still needed, because jsxImportSource is ignored by CRA: https://github.com/facebook/create-react-app/issues/9847
      '@emotion/babel-preset-css-prop',
    ],
  },
  eslint: {
    enable: false,
  },
};
