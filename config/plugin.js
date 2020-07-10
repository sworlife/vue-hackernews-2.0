'use strict';

const path = require('path');

module.exports = {
  vue: {
    enable: true,
    path: path.join(__dirname, '../lib/plugin/egg-view-vue'),
  },
};
