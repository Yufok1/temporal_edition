const webpack = require('webpack');

module.exports = function override(config, env) {
  // Add fallbacks for Node.js modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "os": require.resolve("os-browserify/browser"),
    "path": require.resolve("path-browserify"),
    "fs": false,
    "zlib": require.resolve("browserify-zlib"),
    "querystring": require.resolve("querystring-es3"),
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "buffer": require.resolve("buffer"),
    "util": require.resolve("util"),
    "assert": require.resolve("assert"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "url": require.resolve("url"),
    "vm": require.resolve("vm-browserify"),
    "process": require.resolve("process/browser"),
    "child_process": false,
    "cluster": false,
    "dgram": false,
    "dns": false,
    "net": false,
    "tls": false,
    "readline": false,
    "repl": false,
  };

  // Add plugins
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ];

  // Ignore certain modules that are server-only
  config.resolve.alias = {
    ...config.resolve.alias,
    'bull': false,
    '@sendgrid/mail': false,
    'body-parser': false,
  };

  return config;
};