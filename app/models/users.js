const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  // select为false，就是禁止数据返回的时候显示password
  password: { type: String, require: true, select: false } 
});

module.exports  = model('User', userSchema);

 