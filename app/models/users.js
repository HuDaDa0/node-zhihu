const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  // select为false，就是禁止数据返回的时候显示password
  password: { type: String, require: true, select: false },
  avatar_url: { type: String },
  gender: { type: String, enum: ['male', 'female'], default: 'male', required: true },
  headline: { type: String },
  locations: { type: [{ type: String }] },
  business: { type: String }, 
  employments: {
    type: [{
      company: { type: String },
      job: { type: String }
    }]
  },
  educations: {
    type: [
      {
        school: { type: String },
        major: { type: String },
        diploma: { type: Number, enum: [1, 2, 3, 4, 5] },
        entrance_year: { type: Number },
        graduation_year: { type: Number }
      }

    ]
  },
  following: {
    // 存储id，ref=User id是User表中的id  关注列表
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    select: false
  }
});

module.exports  = model('User', userSchema);

 