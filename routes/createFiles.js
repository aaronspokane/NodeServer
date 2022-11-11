var express = require('express');
var router = express.Router();
var createFiles = require('../files/files');

router.post('/', function(req, res, next) {   
  res.send(createFiles(req));  
});

module.exports = router;
