const express = require('express');
const userController = require('../controllers/userController.js');

const multer = require('multer');
const upload = multer({ dest: 'temp/' });

const router = express.Router();

router
  .route('/:id')
  .get(userController.getUser)
  .put(upload.single('image'), userController.putUser);

router.route('/:id/edit').get(userController.editUser);

module.exports = router;
