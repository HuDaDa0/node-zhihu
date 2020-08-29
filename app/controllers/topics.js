const Topic = require('../models/topics');


class TopicCtl {
  async find(ctx) {
    // per_page 每页显示多少条数据  page 当前是第几页
    const { per_page=10, page=1 } = ctx.query;
    per_page = Math.max(per_page * 1, 1);
    page = Math.max(page * 1, 1) - 1;
    ctx.body = await Topic.find({ name: new RegExp(ctx.query.q) }).limit(per_page).skip(page * per_page);
  }
  async findById(ctx) {
    const { fields = '' } = ctx.query;
    const selectFields = fields.split(';').filter(f => f).map(item => ' +' + item); 
    const topic = await Topic.findById(ctx.params.id).select(selectFields);
    if (!topic) ctx.throw('404', '用户不存在');

    ctx.body = topic;
  }
  async create(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      avatar_url: { type: 'string', required: true },
      introduction: { type: 'string', required: false }
    });
    const { name } = ctx.request.body;
    const isRepeatTopic = await Topic.findOne({ name });
    if (isRepeatTopic) {
      ctx.throw(409, '主题已存在');
    }
    const topic = await new Topic(ctx.request.body).save();
    ctx.body = topic;
  }
  async update(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    });
    const topic = await Topic.findByIdAndRemove(ctx.params.id);
    if (!topic) {
      ctx.throw(404, '用户不存在');
    }
  }
  async delete(ctx) {
    const topic = await Topic.findByIdAndRemove(ctx.params.id);
    if (!topic) {
      ctx.throw(404, '用户不存在');
    }

    ctx.status = 204;
  }

}


module.exports = new TopicCtl();