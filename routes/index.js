var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NewMe Mailer' });
});

router.post('/api/v1/schedule/event-reminder', function(req, res) {
  var reminder = req.body;
  console.log(reminder);
  res.end('Thanks for trying');
});

module.exports = router;
