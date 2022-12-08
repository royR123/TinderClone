const express = require('express');
const router = express.Router();
// console.log("here in Route outside")

router.get('/',require('../Controllers/getMessages'));

router.post('/',require('../Controllers/postMessage'));

module.exports = router;
