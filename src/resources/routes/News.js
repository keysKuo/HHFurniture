const express = require('express');
const router = express.Router();
const { Controller_News } = require('../controllers');
const { upload2 } = require('../middlewares/multer');
const { ImageContent } = require('../models');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const fs = require('fs-extra');
const { uuid } = require('uuidv4');

router.get('/preview/:id', Controller_News.GET_previewNews);
router.get('/storage', Controller_News.GET_managerNews);

router.get('/create', Controller_News.GET_createNews);
router.post('/create', upload2.array('news', 12), Controller_News.POST_createNews);

router.get('/update/:id', Controller_News.GET_updateNews);
router.post('/update/:id', upload2.array('news', 12), Controller_News.POST_updateNews);

router.get('/delete/:id', Controller_News.GET_removeNews);

//router.get('/:slug', Controller_News.GET_PostPage);

router.post('/upload', multipartMiddleware, (req, res) => {
    try {
        fs.readFile(req.files.upload.path, function (err, data) {
            let fileName = req.files.upload.name;
            let ext = fileName.substring(fileName.lastIndexOf('.'));
            let newName = '/cke_uploads/' + uuid().substring(0,13) + ext;
            let newPath = './src/public' + newName;
            fs.writeFile(newPath, data, function (err) {
                if (err) console.log({ err: err });
                else {
                    let url = newName;
                    let msg = 'Tải lên thành công';
                    let funcNum = req.query.CKEditorFuncNum;
                    console.log({ url, msg, funcNum });
                    ImageContent.create({ url }).then(() => {
                        console.log('Upload successfully');
                        res.status(201).send(
                            "<script>window.parent.CKEDITOR.tools.callFunction('" +
                                funcNum +
                                "','" +
                                url +
                                "','" +
                                msg +
                                "');</script>",
                        );
                    });
                }
            });
        });
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;
