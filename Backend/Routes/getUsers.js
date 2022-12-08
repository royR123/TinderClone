const express = require('express');
const router = express.Router();
// console.log("here in Route outside")
router.get('/',require('../Controllers/getUsers'));

module.exports = router;
