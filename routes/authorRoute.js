const express = require('express') 
const authenticationController = require('../controllers/authenticationController') 
const authorController = require('../controllers/authorController') 

const router = express.Router() 

router.post('/signup', authenticationController.signup) 
router.post('/login', authenticationController.login) 

router.get('/', authorController.getMe) 
router.patch('/updateAuthor', 
   authenticationController.protect, 
   authenticationController.restrictTo('author', 'moderator'), 
   authorController.updateMe 
) 
router.patch('/updateAuthorPassword', 
   authenticationController.protect, 
   authenticationController.restrictTo('author', 'moderator'), 
   authorController.updateMyPassword 
) 

module.exports = router; 