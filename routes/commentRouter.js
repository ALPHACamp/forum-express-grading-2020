const express = require('express');
const commentController = require('../controllers/commentController.js');

const router = express.Router();

router.post('/', commentController.postComment);
router.delete('/', commentController.deleteComment);

module.exports = router;
