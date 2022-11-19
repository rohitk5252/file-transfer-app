const router = require('express').Router(); 
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const {v4: uuid4} = require('uuid');

let storage = multer.diskStorage({
    destination: (req, file, cd) => cd(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
})

let upload = multer({
    storage: storage,
    limit: {
        fileSize: 1000000 * 100
    },
}).single('myfile');

router.post('/', (req, res) => {
   
    // Store file
        upload(req, res, async (err) =>{
             // Validations of request 
            if(!req.file){
                return res.json({
                    error : 'All fields required'
                })
            }

            if(err){
                return res.status(500).send({error: err.message})
            }
    // Store in databsase
            const file = new File({
                filename: req.file.filename,
                uuid: uuid4(),
                path: req.file.path,
                size: req.file.size
            });

            const response = await file.save();
            return res.json({file: `${process.env.APP_BASE_URL}/files/${response.uuid}`});
            //  https://websiteName/files/randomUUID
        });


    //  Send Response ( DOwnload link) 
});

module.exports = router;