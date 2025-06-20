// Webpack configuration overrides for React App
// Handles Node.js polyfills for crypto and monitoring modules

const webpack = require('webpack');
const path = require('path');

module.exports = function override(config, env) {
    // Add fallbacks for Node.js modules
    config.resolve.fallback = {
        ...config.resolve.fallback,
        "util": require.resolve("util/"),
        "stream": require.resolve("stream-browserify"),
        "crypto": require.resolve("crypto-browserify"),
        "buffer": require.resolve("buffer/"),
        "process": require.resolve("process/browser"),
        "path": require.resolve("path-browserify"),
        "fs": false,
        "net": false,
        "tls": false,
        "child_process": false,
        "os": require.resolve("os-browserify/browser"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        "url": require.resolve("url/")
    };

    // Add alias to use browser version of metrics and logger
    config.resolve.alias = {
        ...config.resolve.alias,
        './utils/metrics': path.resolve(__dirname, 'src/utils/metrics.browser.ts'),
        '../utils/metrics': path.resolve(__dirname, 'src/utils/metrics.browser.ts'),
        './logger': path.resolve(__dirname, 'src/utils/logger.browser.ts'),
        '../logger': path.resolve(__dirname, 'src/utils/logger.browser.ts'),
        './utils/logger': path.resolve(__dirname, 'src/utils/logger.browser.ts'),
        '../utils/logger': path.resolve(__dirname, 'src/utils/logger.browser.ts'),
        'winston': path.resolve(__dirname, 'src/utils/logger.browser.ts'),
        'prom-client': false  // Prevent prom-client from being bundled
    };

    // Add plugins
    config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer']
        }),
        new webpack.IgnorePlugin({
            resourceRegExp: /^prom-client$/
        }),
        new webpack.IgnorePlugin({
            resourceRegExp: /^winston$/
        }),
        new webpack.IgnorePlugin({
            resourceRegExp: /^@colors\/colors$/
        })
    ];

    // Add rule to exclude server-side files
    config.module.rules.push({
        test: /\.(ts|tsx)$/,
        exclude: [
            /src\/app\.ts$/,
            /src\/server\.ts$/,
            /src\/metrics\/(system-metrics|queue-metrics)\.ts$/
        ],
        use: {
            loader: 'null-loader'
        }
    });

    // Ignore certain warnings
    config.ignoreWarnings = [
        {
            module: /prom-client/
        },
        {
            module: /winston/
        },
        {
            module: /@colors\/colors/
        }
    ];

    return config;
};