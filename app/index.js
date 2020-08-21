const Koa = require('koa');
const bodyparser = require('koa-bodyparser');

const routing = require('./routers');


const app = new Koa();


app.use(bodyparser())
routing(app)


app.listen(8888, () => {
  console.log('程序开始启动在8888端口');
})