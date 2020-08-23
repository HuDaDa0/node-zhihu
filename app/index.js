const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const error = require('koa-json-error');
const parameter = require('koa-parameter');
const mongoos = require('mongoose');

const routing = require('./routers');
const { connectStr } = require('./config'); 
const app = new Koa();
mongoos.connect(connectStr, { useUnifiedTopology: true }, (e) => { console.log('数据库连接成功') });
mongoos.connection.on('error', () => { console.log('连接错误') });


app.use(error({
  postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV === 'production'? rest: { stack, ...rest } 
}));
app.use(bodyparser());
// 校验请求体参数的  传入app，这样就会全局注册校验方法 
// 在ctx上面注册一个 vertifyParams 
app.use(parameter(app));  
routing(app);


app.listen(8888, () => {
  console.log('程序开始启动在8888端口');
});