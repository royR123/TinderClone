const express = require('express');
const router = express.Router();
// console.log("here in Route outside")
router.post('/',require('../Controllers/signup.js'));

module.exports = router;