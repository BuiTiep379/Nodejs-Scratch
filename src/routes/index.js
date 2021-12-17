const express = require('express');
const router = express.Router();

router.route('/login').get((req, res) => {
    res.render('login', {
        layout: 'login',
    })
});

router.route('/dashboard').get((req, res) => {
    res.render('dashboard')
});

module.exports = router;


