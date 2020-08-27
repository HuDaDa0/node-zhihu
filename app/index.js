const Koa = require('koa');
const koaBody = require('koa-body');
const error = require('koa-json-error');
const koaStatic = require('koa-static');
const parameter = require('koa-parameter');
const mongoos = require('mongoose');
const path = require('path');

const routing = require('./routers');
const { connectStr } = require('./config'); 
const app = new Koa();
mongoos.connect(connectStr, { useUnifiedTopology: true }, (e) => { console.log('数据库连接成功') });
mongoos.connection.on('error', () => { console.log('连接错误') });


app.use(koaStatic(path.join(__dirname, 'public')));
app.use(error({
  postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV === 'production'? rest: { stack, ...rest } 
}));
app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, '/public/uploads'),
    keepExtensions: true  // 保留扩展名，图像文件的.jpg  .png 之类的
  }
}));
// 校验请求体参数的  传入app，这样就会全局注册校验方法 
// 在ctx上面注册一个 vertifyParams 
app.use(parameter(app));  
routing(app);


app.listen(8888, () => {
  console.log('程序开始启动在8888端口');
});