var express = require('express');
var router = express.Router();

var agenda = require('../worker.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NewMe Mailer' });
});

router.post('/api/v1/schedule/event-reminder', function(req, res, next) {
  var reminder = req.body;
  console.log(reminder);

  agenda.now('event reminder', reminder);
  res.end('Thanks for trying');
});

module.exports = router;
