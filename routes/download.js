const router = require('express').Router();
const File = require('../models/file');


router.get('/:uuid', async (req, res) => {
    const file = await File.findOne({
        uuid: req.params.uuid
    })
    if(!file) {
        return res.render('download', {error : 'Link Expired!! or Invalid Link'})
    }

const filePath = `${__dirname}/../${file.path}`;

// download file using express
res.download(filePath);

});

module.exports = router;