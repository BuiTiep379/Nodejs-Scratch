const express = require('express');
const router = express.Router();
const { checkAdmin, checkGuest } = require('../middleware/auth');
const Story = require('../models/Story');

router.route('/login').get(checkGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    })
});

router.route('/dashboard').get(checkAdmin, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user._id }).lean()
        res.render('dashboard', {
          name: req.user.firstName,
          stories,
        })
      } catch (err) {
        console.error(err)
        res.render('errors/500')
      }
    }

);

module.exports = router;


