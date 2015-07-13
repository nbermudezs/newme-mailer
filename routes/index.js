var express   = require('express');
var router    = express.Router();

var agenda    = require('../worker.js');
var reminders = require('./reminders');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NewMe Mailer' });
});

// Scheduling endpoints
router.post('/api/v1/schedule/event-reminder', reminders.eventReminder);

// Cancelation endpoints
router.post('/api/v1/reminder/:eventId/cancel', reminders.cancelReminderJob);

module.exports = router;
