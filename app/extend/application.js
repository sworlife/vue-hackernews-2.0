'use strict';

const fs = require('fs');
const path = require('path');
const LRU = require('lru-cache');

const { createBundleRenderer } = require('vue-server-renderer');
const setupDevServer = require('../web/build/setup-dev-server');

const resolve = file => path.resolve(__dirname, file);
const templatePath = resolve('../web/src/index.template.html');

const SERVER_RENDERER = Symbol('Application#serverRenderer');
const CLIENT_RENDERER = Symbol('Application#clientRenderer');

module.exports = {
  createServerRenderer() {
    if (!this[SERVER_RENDERER]) {
      const template = fs.readFileSync(templatePath, 'utf-8');
      const bundle = require('../web/dist/vue-ssr-server-bundle.json');
      const clientManifest = require('../web/dist/vue-ssr-client-manifest.json');

      this[SERVER_RENDERER] = this.createRenderer(bundle, {
        template,
        clientManifest,
      });
    }
    return Promise.resolve(this[SERVER_RENDERER]);
  },
  createClientRenderer() {
    return setupDevServer(
      this,
      templatePath,
      (bundle, options) => {
        this[CLIENT_RENDERER] = this.createRenderer(bundle, options);
      }
    ).then(() => this[CLIENT_RENDERER]);
  },
  createRenderer(bundle, options) {
    // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
    return createBundleRenderer(bundle, Object.assign(options, {
      // for component caching
      cache: LRU({
        max: 1000,
        maxAge: 1000 * 60 * 15,
      }),
      // this is only needed when vue-server-renderer is npm-linked
      basedir: resolve('./dist'),
      // recommended for performance
      runInNewContext: false,
    }));
  },
};
