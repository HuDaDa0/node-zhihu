// 自动注册routers文件下所有的路由
const fs = require('fs');

module.exports = (app) => {
  // __dirname 表示当前目录
  fs.readFileSync(__dirname).forEach(file => {
    if(file === 'index.js') { return ; }
    const route = require(`./${file}`);
    app.use(route.routes()).use(route.allowedMethods());
  });
}








