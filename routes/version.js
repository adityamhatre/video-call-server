var express = require('express');
var router = express.Router();

router.get('/', async function (req, res, next) {
    res.send({ version: '1.5' });
});

module.exports = router;
