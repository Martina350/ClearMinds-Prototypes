const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Clear cache on every build
config.resetCache = true;

module.exports = config;

