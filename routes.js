var express = require('express');
var router = express.Router();
// GET /
router.get('/', function(req, res, next) {
    return res.render('full', { title: 'Home' });
});
module.exports = router;