const express = require('express');
const { register ,login ,getMe,forgetPassword,resetpassword} = require('../controllers/auth');

const router = express.Router();
const {protect} = require('../middleware/auth')
router.post('/register',register);
router.post('/login',login);
router.get('/me',protect,getMe);
router.post('/forgetPassword',forgetPassword);
router.put('/resetpassword/:resettoken',resetpassword);

module.exports = router;