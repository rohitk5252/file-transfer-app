const router = require('express').Router(); 
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const {v4: uuid4} = require('uuid');
const { rootCertificates } = require('tls');

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
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


    //  Send Response ( Download link) 
});

router.post('/send', async (req, res) => {
    // request validation
     const {uuid, emailTo, emailFrom } = req.body;
        if(!uuid || !emailTo || !emailFrom ) {

            return res.status(422).send({
                error: "All fields required"
            })
        }
        // Get Data From Database
        const file = await File.findOne({uuid: uuid});
        if(file.sender) {
            return res.status(422).send({
                error: "Email Already Sent"
            })
        }
        file.sender = emailFrom;
        file.receiver = emailTo;
        const response = await file.save();

        // send email

        const sendMail = require('../services/emailService');

        sendMail({
            from: emailFrom,
            to: emailTo,
            subject: "New File Shared through FTA",
            text: `${emailFrom} shared a file with you.`,
            html: require('../services/emailTemplate')(
                emailFrom,
                `${process.env.APP_BASE_URL}/files/${file.uuid}`,
                parseInt(file.size/1000)+' KB',
                '24 Hours'
            )
            // emailFrom, downloadLink, size, expires
        });
});

module.exports = router;