const express = require('express');
const { body } = require('express-validator');
const Category = require('../models/Category');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find().sort('name');
    res.json({ success:true, data: categories });
  } catch (err) { next(err); }
});

router.post('/', [ body('name').notEmpty() ], async (req, res, next) => {
  try {
    const { name } = req.body;
    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ success:false, error: 'Category exists' });
    const cat = await Category.create({ name });
    res.status(201).json({ success:true, data: cat });
  } catch (err) { next(err); }
});

module.exports = router;
