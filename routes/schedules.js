'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.end('Thanks for trying');
});

module.exports = router;
