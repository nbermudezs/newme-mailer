'use strict';

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var eventSchema = new Schema({
  admins_id: { type: String },
  event_name: { type: String },
  event_image: { type: String },
  redirect_url: { type: String },
  creation_date: { type: Date, default: Date.now },
  date_time_start: { type: Date },
  date_time_end: { type: Date },
  fan_url: { type: String },
  host_url: { type: String },
  celebrity_url: { type: String },
  status: { type: String },
  stage_sessionid: { type: String },
  archive_id: {type: String},
  archive_event: { type: Boolean },
  composed: { type: Boolean },
  rsvps: [{ type: ObjectId, ref: 'User' }]
});

var Event = mongoose.model('Event', eventSchema);

module.exports = Event;
