import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    ctx.body = await ctx.service.test.sayHi('egg');
  }
  public async app1() {
    return this.ctx.render('app1', {});
  }
  public async app2() {
    return this.ctx.render('app2', {});
  }
  public async rp() {
    return this.ctx.render('rp', {});
  }
}
