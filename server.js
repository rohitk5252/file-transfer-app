const express = require('express');
const app =  express();


const connectDB = require('./config/db');
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
});


