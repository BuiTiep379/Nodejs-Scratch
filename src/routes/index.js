const express = require('express');
const router = express.Router();
const { checkAdmin, checkGuest } = require('../middleware/auth');


router.route('/login').get(checkGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    })
});

router.route('/dashboard').get(checkAdmin, (req, res) => {
    res.render('dashboard', { name: req.user.firstName });
});

module.exports = router;


