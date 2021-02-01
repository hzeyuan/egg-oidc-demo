
import { Application } from 'egg';
import MyAdapter from './adapters/adapter';
const helmet = require('koa-helmet');
const Provider = require('oidc-provider');
const mount = require('koa-mount');

class AppBootHook {

  app: Application;

  constructor(app: Application) {

    this.app = app;
  }

  configWillLoad() {
    // 此时 config 文件已经被读取并合并，但是还并未生效
    // 这是应用层修改配置的最后时机
    // 注意：此函数只支持同步调用
  }

  async didLoad() {
    // 所有的配置已经加载完毕
    // 可以用来加载应用自定义的文件，启动自定义的服务

    // 例如：创建自定义应用的示例
  }

  async willReady() {
    const { app } = this;
    // 加载自定义
    // const adapter = new MyAdapter('test');
    const configuration = app.config.oidcProvider || {};
    const PORT = '7001';
    const ISSUER = `http://localhost:${PORT}`;
    app.logger.info('[egg-oidc-provider] oidc-provider begin start');
    app.use(helmet());
    // 所有的插件都已启动完毕，但是应用整体还未 ready
    // 可以做一些数据初始化等操作，这些操作成功才会启动应用
    // adapter: MyAdapter,
    const provider = new Provider(ISSUER, { ...configuration });
    // const c = provider.clientAdd({
    //   client_id: '2',
    //   client_secret: '2',
    //   grant_types: [ 'refresh_token', 'authorization_code' ],
    //   redirect_uris: [ 'http://127.0.0.1:5500/app/view/app1.html', 'http://127.0.0.1:5500/app/view/app2.html' ],
    // });
    // console.log('provider.Client', c);
    provider.use(helmet());
    app.oidcProvider = provider;
    app.use(mount('/', provider.app));
    // 例如：从数据库加载数据到内存缓存
  }

  async didReady() {
    // 应用已经启动完毕
  }

  async serverDidReady() {
    // http / https server 已启动，开始接受外部请求
    // 此时可以从 app.server 拿到 server 的实例
  }
}

module.exports = AppBootHook;
