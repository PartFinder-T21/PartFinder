const dotenv=require('dotenv').config({path: '/home/sheppi/Scrivania/PartFinder/PartFinder/misc/.env'});
const express=require('express');
const app=express();
const mongoose=require('mongoose')

const userRoute = require('./routes/user');
const characterRoute = require('./routes/character');
const groupRoute = require('./routes/group');





app.use(express.json());
app.use(express.static("index"));
app.use('/user',userRoute);
app.use('/character',characterRoute);
app.use('/group',groupRoute);

mongoose.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
    if (err) return console.log("Error: ", err);
    console.log("MongoDB Connection -- Ready state is:", mongoose.connection.readyState);
    }
);

const listener = app.listen(process.env.PORT || 3000, () =>{
    console.log('App listening on port ' + listener.address());
    console.log(process.env.MONGODB_URI);
})

module.exports = app;