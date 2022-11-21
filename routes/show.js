const router = require('express').Router();
const File = require('../models/file');

router.get('/:uuid', async (req, res) =>{
    try {
        const file = await File.findOne({uuid : req.params.uuid });
        if(!file) {
             return res.render('download',{error : 'Link Expired ! or Invalid File request'})
        }

        return res.render('download',{
            uuid: file.uuid,
            fileName: file.filename,
            fileSize: file.size,
            downloadLink : `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
            // http://localhost300/files/download/random-uuid
        });
    } catch (err) {
        // will automatically try to findd file "download" in views folder
            return res.render('download',{error : 'Something went wrong.'})
    }
});


module.exports = router;