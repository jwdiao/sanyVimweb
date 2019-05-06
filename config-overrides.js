const {override, fixBabelImports, addLessLoader} = require('customize-cra');
module.exports = override(
    fixBabelImports('import-antd', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    fixBabelImports('import-antd-mobile', {
        libraryName: 'antd-mobile',
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {
            // antd 的全局主题配置，全部样式：
            // https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
            '@primary-color': '#5a8cff',

            // antd-mobile 的全局主题配置，全部样式：
            // https://github.com/ant-design/ant-design-mobile/blob/master/components/style/themes/default.less
            '@brand-primary': '#5a8cff',
            '@brand-primary-tap': '#0e6d81',
            '@input-font-size':14,
        },
    }),
);