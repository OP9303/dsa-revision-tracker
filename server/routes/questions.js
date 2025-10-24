const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const auth = require('../middleware/authMiddleware');
const { nextRevisionDate } = require('../utils/spacedRepetition');

// create new question
router.post('/', auth, async (req, res) => {
  try {
    const q = new Question({ ...req.body, userId: req.user.id });
    q.nextRevisionDate = nextRevisionDate(0);
    await q.save();
    res.json(q);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(question);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(500).send('Server error');
  }
});
// get all for user
router.get('/', auth, async (req, res) => {
  try {
    const list = await Question.find({ userId: req.user.id }).sort({ dateSolved: -1 });
    res.json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/', auth, async (req, res) => {
  try {
    // Default sort: by next revision date, ascending
    // This puts the most urgent questions at the top
    let sortQuery = { nextRevisionDate: 1 };

    // You can add more sort options here later if you want
    // switch (req.query.sort) {
    //   case 'dateSolved':
    //     sortQuery = { dateSolved: -1 };
    //     break;
    //   case 'difficulty':
    //     sortQuery = { difficulty: 1 };
    //     break;
    // }

    const list = await Question.find({ userId: req.user.id }).sort(sortQuery);
    res.json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
// update question (patch)
router.patch('/:id', auth, async (req, res) => {
  try {
    const updated = await Question.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// mark revision done (increments revisionCount and sets nextRevisionDate)
router.post('/:id/revise', auth, async (req, res) => {
  try {
    const q = await Question.findOne({ _id: req.params.id, userId: req.user.id });
    if (!q) return res.status(404).json({ message: 'Not found' });
    q.revisionCount += 1;
    q.nextRevisionDate = nextRevisionDate(q.revisionCount);
    await q.save();
    res.json(q);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// delete
router.delete('/:id', auth, async (req, res) => {
  try {
    await Question.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;