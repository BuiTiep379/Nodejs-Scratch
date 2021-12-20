const express = require('express');
const router = express.Router();
const { checkAdmin, checkGuest } = require('../middleware/auth');
const Story = require('../models/Story');
// @desc    Show add page
// @route   GET /stories/add
router.get('/add', checkAdmin, (req, res) => {
    res.render('stories/add')
  })
  
  // @desc    Process add form
  // @route   POST /stories
  router.post('/', checkAdmin, async (req, res) => {
    try {
      req.body.user = req.user._id;
      await Story.create(req.body)
      res.redirect('/dashboard')
    } catch (err) {
      console.error(err)
      res.render('errors/500')
    }
  })
  

module.exports = router;
