const path = require('path');

class HomeCtl {
  index(ctx) {
    ctx.body = '<h1>首页</h1>';
  }
  upload(ctx) {
    const file = ctx.request.files.file;
    const basename = path.basename(file.path);
    // 请注意路径中没有 public
    ctx.body = { url: `${ctx.origin}/uploads/${basename}` }
  }
}


module.exports = new HomeCtl();
