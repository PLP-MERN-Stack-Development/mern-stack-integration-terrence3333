const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', [
  body('name').notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min:6 }).withMessage('Password min 6 chars')
], authController.register);

router.post('/login', [
  body('email').isEmail(),
  body('password').exists()
], authController.login);

router.get('/me', protect, authController.getMe);

module.exports = router;
