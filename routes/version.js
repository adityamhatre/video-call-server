var express = require('express');
var router = express.Router();

const version = 1.9

router.get('/', async function (req, res, next) {
    res.send({ version });
});

module.exports = router;
