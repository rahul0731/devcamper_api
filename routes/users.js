const express = require('express');
const {
    getUser,
    getUsers,
    deleteUser,
    updateUser,
    createUser
}  = require('../controllers/users');

const User = require('../models/User');

const router = express.Router({mergeParams : true});
const advancedResults = require('../middleware/advancedResults');
const {protect,authorize} = require('../middleware/auth');
//Protect and authorize all below 
router.use(protect);
router.use(authorize('admin'));
router
    .route('/')
    .get(advancedResults(User),getUsers)
    .post(createUser)
    

router
    .route('/:id')
    .get(getUser)
    .delete(deleteUser)
    .put(updateUser)

module.exports = router;