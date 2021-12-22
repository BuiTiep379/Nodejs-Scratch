const express = require('express');
const router = express.Router();
const { checkAdmin, checkGuest } = require('../middleware/auth');
const Story = require('../models/Story');
// @desc    Show add page
// @route   GET /stories/add
router.get('/add', checkAdmin, (req, res) => {
  res.render('stories/add');
})

// @desc    Process add form
// @route   POST /stories
router.post('/', checkAdmin, async (req, res) => {
  try {
    req.body.user = req.user._id;
    await Story.create(req.body);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('errors/500');
  }
});

// 
router.get('/', checkAdmin, async (req, res) => {
  try {
    const stories = await Story.find({ public: 'public' })
      .populate('user')
      .sort({ createAt: 'desc' })
      .lean()
    res.render('stories/index', {
      stories
    });
  } catch (err) {
    console.error(err);
    res.render('errors/500');
  }
});

router.get('/edit/:id',checkAdmin, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
    }).lean()

    if (!story) {
      return res.render('errors/404')
    }

    if (story.user != req.user.id) {
      res.redirect('/stories')
    } else {
      res.render('stories/edit', {
        story,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('errors/500')
  }
});

router.put('/:id', checkAdmin, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render('errors/404')
    }

    if (story.user != req.user.id) {
      res.redirect('/stories')
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/dashboard')
    }
  } catch (err) {
    console.log(err);
    res.render('errors/500');
  }
});

router.get('/:id', checkAdmin, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate('user').lean();
    if (!story) {
      return res.render('errors/404');
    }
    if (story.user._id != req.user.id && story.status == 'private') {
      res.render('errors/404')
    } else {
      res.render('stories/show', {
        story,
      })
    }
  } catch (error) {
    res.render('errors/404')
  }

});

router.delete('/:id', checkAdmin, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user != req.user.id) {
      res.redirect('/stories')
    } else {
      await Story.remove({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
});

router.get('/user/:userId', checkAdmin, async (req, res) => {
  try {
    let stories = await Story.find({ user: req.params.userId, status: 'public' }).populate('user').lean();

    res.render('stories/index', { stories });
  } catch (err) {
    console.error(err)
    return res.render('errors/500')
  }
})

module.exports = router;
