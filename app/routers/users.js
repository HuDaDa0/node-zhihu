const jsonwebtoken = require('jsonwebtoken');
const Router = require('koa-router');
const router = new Router({ prefix: '/users' });

const { secret } = require('../config');

const { find, findById, create, update, delete: del, login } = require('../controllers/users')

const auth = async (ctx, next) => {
  // ctx.request.headers 会自动的把大写改成小写 Authorization=Bearer xxxx 格式
  const { authorization = '' } = ctx.request.header;
  const token = authorization.replace('Bearer ', '');
  try {
    const user = jsonwebtoken.verify(token, secret);
    ctx.state.user = user;  // state 通常放一些用户信息
  } catch(err) {
    ctx.throw(401, err.message);
  }
  await next();
};

router.get('/', find);

router.post('/', create);

router.get('/:id', findById);

router.patch('/:id', auth, update);

router.delete('/:id', auth, del);

router.post('/login', login);


module.exports = router;



