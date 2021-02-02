import { Controller } from 'egg';


export default class InteractionController extends Controller {
  public async grant() {
    const { ctx } = this;
    const { oidcProvider } = this.app;
    const details = await oidcProvider.interactionDetails(ctx.req, ctx.res);
    console.log('d', details);
    const {
      uid, prompt, params, session,
    } = await oidcProvider.interactionDetails(ctx.req, ctx.res);
    const client = await oidcProvider.Client.find(params.client_id);

    switch (prompt.name) {
      case 'select_account': {
        if (!session) {
          return oidcProvider.interactionFinished(ctx.req, ctx.res, {
            select_account: {},
          }, { mergeWithLastSubmission: false });
        }

        const account = await oidcProvider.Account.findAccount(ctx, session.accountId);
        const { email } = await account.claims('prompt', 'email', { email: null }, []);

        return ctx.render('select_account', {
          client,
          uid,
          email,
          details: prompt.details,
          params,
          title: 'Sign-in',
          //   session: session ? debug(session) : undefined,
          //   dbg: {
          //     params: debug(params),
          //     prompt: debug(prompt),
          //   },
        });
      }
      case 'login': {
        return ctx.render('login', {
          client,
          uid,
          details: prompt.details,
          params,
          title: 'Sign-in',
          google: ctx.google,
          //   session: session ? debug(session) : undefined,
          //   dbg: {
          //     params: debug(params),
          //     prompt: debug(prompt),
          //   },
        });
      }
      case 'consent': {
        return ctx.render('interaction', {
          client,
          uid,
          details: prompt.details,
          params,
          title: 'Authorize',
          //   session: session ? debug(session) : undefined,
          //   dbg: {
          //     params: debug(params),
          //     prompt: debug(prompt),
          //   },
        });
      }
      default:
        this.ctx.body = { status: 'done' };
    }
  }
  public async login() {
    const { ctx } = this;
    const { oidcProvider } = this.app;
    const { prompt: { name } } = await oidcProvider.interactionDetails(ctx.req, ctx.res);
    // assert.equal(name, 'login');

    // 查找用户
    const account = {
      accountId: '1',
    };

    const result = {
      select_account: {}, // make sure its skipped by the interaction policy since we just logged in
      login: {
        account: account.accountId,
      },
    };

    return oidcProvider.interactionFinished(ctx.req, ctx.res, result, {
      mergeWithLastSubmission: false,
    });
  }
  public async confirm() {
    const { ctx } = this;
    const { oidcProvider } = this.app;
    const { prompt: { name, details } } = await oidcProvider.interactionDetails(ctx.req, ctx.res);
    // assert.equal(name, 'consent');

    const consent: any = {};

    // any scopes you do not wish to grant go in here
    //   otherwise details.scopes.new.concat(details.scopes.accepted) will be granted
    consent.rejectedScopes = [];

    // any claims you do not wish to grant go in here
    //   otherwise all claims mapped to granted scopes
    //   and details.claims.new.concat(details.claims.accepted) will be granted
    consent.rejectedClaims = [];

    // replace = false means previously rejected scopes and claims remain rejected
    // changing this to true will remove those rejections in favour of just what you rejected above
    consent.replace = false;

    const result = { consent };
    return oidcProvider.interactionFinished(ctx.req, ctx.res, result, {
      mergeWithLastSubmission: true,
    });
  }
}
