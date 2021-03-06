const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', { scope : ['profile'] }));
router.get('/google/callback',  passport.authenticate('google', { failureRedirect: '/' }),
function(req, res) {
  // Successful authentication, redirect success.
  res.redirect('/dashboard');
});
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
  });

module.exports = router;