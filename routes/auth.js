const express = require('express');
const { register ,login ,getMe,forgetPassword,resetpassword,updateDetails,updatePassword} = require('../controllers/auth');

const router = express.Router();
const {protect} = require('../middleware/auth')
router.post('/register',register);
router.post('/login',login);
router.get('/me',protect,getMe);
router.post('/forgetPassword',forgetPassword);
router.put('/resetpassword/:resettoken',resetpassword);
router.put('/updatedetails',protect,updateDetails);
router.put('/updatepassword',protect,updatePassword);

module.exports = router;