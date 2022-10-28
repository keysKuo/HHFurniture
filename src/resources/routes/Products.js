const express = require('express');
const router = express.Router();
const { Controller_Products } = require('../controllers');
const upload = require('../middlewares/multer');
const catchAsync = require('../utils/catchAsync');

router.get('/create', catchAsync(Controller_Products.GET_createProduct));
router.post('/create', upload.array('product-img', 12), catchAsync(Controller_Products.POST_createProduct));

router.get('/update/:id', Controller_Products.GET_updateProduct);
router.put('/update/:id', upload.array('update-img', 12), catchAsync(Controller_Products.PUT_updateProduct));

router.delete('/delete/:id', catchAsync(Controller_Products.DELETE_removeProduct));

module.exports = router;