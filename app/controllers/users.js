const jsonwebtoken = require('jsonwebtoken');

const User = require('../models/users');
const { secret } = require('../config');


class UserCtl {
  async find(ctx) {
    const { per_page = 10, page = 1 } = ctx.query;
    page = Math.max(page, 1) - 1;
    per_page = Math.max(per_page * 1, 1);
    ctx.body = await User.find({ name: new RegExp(c.query.q) }).limit(per_page).skip(per_page * page);
  }
  async findById(ctx) {
    const { fields } = ctx.query;
    // 如果是空数组，就过滤掉 查询参数是fileds=xxxx;xxx;xxx;xx  
    // 意思就是 只查询这几个参数
    const selectFields = fields.split(';').filter(f => f).map(item => ' +' + item).join('')
    const user = await User.findById(ctx.params.id).select(selectFields);
    if (!user) {
      ctx.throw(404, '用户不存在');
    }
    ctx.body = user
  }
  async create(ctx) {
    // 使用了 koa-parameter 库，在全局注册 app.use(parameter(app))
    // 自动校验参数
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    });
    const { name } = ctx.request.body;
    const isRepeatUser = await User.findOne({ name });
    if (isRepeatUser) {
      ctx.throw(409, '用户已经存在');
    }
    const user = await new User(ctx.request.body).save();
    ctx.body = user;
  }
  async update(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      password: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      gender: { type: 'string', required: false },
      headline: { type: 'string', required: false },
      locations: { type: 'array', itemType: 'string', required: false },
      business: { type: 'string', required: false },
      employments: { type: 'array', itemType: 'object', required: false },
      educations: { type: 'array', itemType: 'object', required: false }
    });
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    if (!user) {
      ctx.throw(404, '用户不存在');
    }
    ctx.body = user;
  }
  async delete(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id);
    if(!user) {
      ctx.throw(404, '用户不存在');
    }
    ctx.status = 204;
  }
  async checkOwner(ctx, next) {
    // 验证用户是不是当前登录的用户，这样才能进行 更新 和 删除 用户自己的信息
    if (ctx.params.id !== ctx.state.user._id) ctx.throw(403, '没有权限')
    await next()
  }
  async login(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    });
    const user = await User.findOne(ctx.request.body);
    if (!user) {
      ctx.throw(401, '用户名和密码不正确');
    }
    const { _id, name } = user;
    // expiresIn: '1d'  过期时间
    const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: '1d' });
    ctx.body = { token };
  }
  async listFollowing(ctx) {
    const user = await User.findById(ctx.params.id).select('+following');
    if (!user) ctx.throw(404);
    // 返回关注列表
    ctx.body = user.following;
  }
  // 粉丝列表
  async listFollowers(ctx) {
    const followers = await User.find({ following: ctx.params.id });
    ctx.body = followers;
  }
  // 中间件，简单用户是否存在
  async checkUserExist(ctx, next) {
    const user = await User.findById(ctx.params.id);
    if (!user) {
      ctx.throw('404', '用户不存在');
    }
    await next()
  }
  // 关注
  async follow(ctx) {
    // ctx.state.user._id  是jwt验证登录成功后绑定在ctx.state上的属性
    const me = await User.findById(ctx.state.user._id).select('+following');
    if (!me.following.map(item => item.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id);
      me.save();
    }
    me.statue = 204;
  }
  async unfollow(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+following');
    const index = me.following.map(item => item.toString()).indexOf(ctx.params.id);
    if (index > -1) {
      me.following.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }
}


// 导出一个实例化对象，这样大家都共用一个对象
module.exports = new UserCtl();


