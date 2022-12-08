const express = require('express');
const router = express.Router();
console.log("here in update user Route outside")


// Updating user Profile
router.put('/', require('../Controllers/updateUser'));

//Updating User Matches.
router.put('/matches', require('../Controllers/updateMatches'));

module.exports = router;