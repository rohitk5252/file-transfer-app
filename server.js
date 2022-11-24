const express = require('express');
const app =  express();
const path = require('path');


const connectDB = require('./config/db');
connectDB();

// To use static files
app.use(express.static('public')); 
//  Express cannot parse JSON without this 
app.use(express.json());
// Template engine ( for EJS )
app.set('views', path.join(__dirname,'/views'));
app.set('view engine', 'ejs') ;


// Routes 
// file upload request route
app.use('/api/files', require('./routes/files'));
// file download page show route
app.use('/files', require('./routes/show'));
// file download redirect route 
app.use('/files/download', require('./routes/download'));


const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
});


