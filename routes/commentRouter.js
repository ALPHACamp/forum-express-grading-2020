const express = require('express');
const commentController = require('../controllers/commentController.js');

const router = express.Router();

router.delete('/:id', commentController.deleteComment);
router.post('/', commentController.postComment);

module.exports = router;
