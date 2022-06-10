const express = require('express');
const userController = require('../controller/user');

const router = express.Router();

router.get('/read', userController.findUser)
router.get('/search', userController.searchUser)
router.get('/locate', userController.findUserWithCoordinate)
router.post('/add', userController.createUser)
router.put('/edit/:id', userController.updateUser)
router.delete('/edit/:id', userController.deleteUser)

module.exports = router