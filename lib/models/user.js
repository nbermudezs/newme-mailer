'use strict';

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
  email: { type: String, unique : true, required : true, dropDups: true, lowercase: true, trim: true },
  password: { type: String, required : true },
  creation_date: { type: Date, default: Date.now },
  plan: { type: Number, default:1 },
  role: { type: String,required : true }, // S:superadmin, A:admin, M:member
  name: { type: String, required : true },
  fb_id: { type: String, default:''}
});

module.exports = mongoose.model('User', userSchema);
