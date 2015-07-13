'use strict';

var agenda    = require('../worker.js');
var config    = require('../lib/config');

var routes = {

  eventReminder: function(req, res, next) {
    var reminder = req.body;
    var when = new Date();
    when.setTime(parseInt(reminder.timestamp));
    when.setDate(when.getDate() - 1);

    agenda.cancel({ 'data.id': reminder.id }, function(err, numRemoved) {
      if (err) {
        res.status(200).jsonp({ success: false, error: err.message });
      } else {
        if (config.get('NODE_ENV') === 'production') {
          agenda.schedule(when, 'event reminder', reminder);
        } else {
          // uncomment if you want to test this en dev mode.
          // agenda.now('event reminder', reminder);
        }
        res.status(200).jsonp({ success:true });
      }
    });
  },

  cancelReminderJob: function(req, res, next) {
    var reminder = req.body;
    agenda.cancel({ 'data.id': reminder.id }, function(err, numRemoved) {
      if (err) {
        res.status(200).jsonp({ success: false, error: err.message });
      } else {
        res.status(200).jsonp({ success:true });
      }
    });
  }

};

module.exports = routes;
