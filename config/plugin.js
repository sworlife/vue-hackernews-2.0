'use strict';

const path = require('path');

module.exports = {
  'vue-dev': {
    enable: true,
    path: path.join(__dirname, '../lib/plugin/egg-vue-dev'),
  },
};
