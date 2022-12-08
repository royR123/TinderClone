const express = require('express');
const router = express.Router();
// console.log("here in Route outside")
router.get('/',require('../Controllers/getGenderedUsers'));

module.exports = router;