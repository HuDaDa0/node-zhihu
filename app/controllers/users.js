const jsonwebtoken = require('jsonwebtoken');

const User = require('../models/users');
const { secret } = require('../config');


class UserCtl {
  async find(ctx) {
    ctx.body = await User.find();
  }
  async findById(ctx) {
    const user = await User.findById(ctx.params.id);
    if (!user) {
      ctx.throw(404, '用户不存在');
    }
    ctx.body = user
  }
  async create(ctx) {
    // 使用了 koa-parameter 库，在全局注册 app.use(parameter(app))
    // 自动校验参数
    ctx.verifyParams({
      name: { type: 'string', require: true },
      password: { type: 'string', require: true }
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
    ctx.vertiyParams({
      name: { type: 'string', require: false },
      password: { type: 'string', require: false }
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
  async login(ctx) {
    ctx.verifyParams({
      name: { type: 'string', require: true },
      password: { type: 'string', require: true }
    });
    const user = User.findOne(ctx.request.body);
    if (!user) {
      ctx.throw(401, '用户名和密码不正确');
    }
    const { _id, name } = user;
    // expiresIn: '1d'  过期时间
    const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: '1d' });
    ctx.body = { token };
  }
}


// 导出一个实例化对象，这样大家都共用一个对象
module.exports = new UserCtl();


