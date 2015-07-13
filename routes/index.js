var express = require('express');
var router = express.Router();

var agenda = require('../worker.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NewMe Mailer' });
});

router.post('/api/v1/schedule/event-reminder', function(req, res, next) {
  var reminder = req.body;
  var when = new Date();
  when.setTime(parseInt(reminder.timestamp));
  when.setDate(when.getDate() - 1);

  agenda.schedule(when, 'event reminder', reminder);
  res.end('Thanks for trying');
});

module.exports = router;
