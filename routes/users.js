const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users')

router.post('/users', usersController.createUser)

router.get('/users', usersController.getAllUsers)

router.post('/users/:userId/tweets', usersController.createUserTweet)

router.put('/users/:_id', usersController.updateUser)

router.delete('/users/:_id', usersController.deleteUser)

router.post('/auth/signin', usersController.auth_sigin_post)


module.exports = router





