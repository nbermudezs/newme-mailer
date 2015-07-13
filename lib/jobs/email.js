'use strict';

var Mailer = require('../mailer');
var mailer = new Mailer();

module.exports = function(agenda) {
  agenda.define('registration email', { priority: 'high' }, function(job, done) {
    // blah blah
  });

  agenda.define('reset password', { priority: 'highest' }, function(job, done) {
    // etc etc
  })

  agenda.define('event reminder', { priority: 'low' }, function(job, done) {
    var data = job.attrs.data;
    mailer.eventStartReminder(data.id, done);
  });
}
