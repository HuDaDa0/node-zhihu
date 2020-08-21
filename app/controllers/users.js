const db = [{ name: '李磊' }];

class UserCtl {
  find(ctx) {
    ctx.body = db
  }
  findById(ctx) {
    ctx.body = db[ctx.params.id * 1]
  }
  create(ctx) {
    db.push(ctx.request.body);
    ctx.body = ctx.request.body;
  }
  update(ctx) {
    db[ctx.params.id * 1] = ctx.params.body;
  }
  delete(ctx) {
    db.split(ctx.params.id * 1, 1);
    ctx.status = 204;
  }
}


// 导出一个实例化对象，这样大家都共用一个对象
module.exports = new UserCtl();


