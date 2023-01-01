const dotenv=require('dotenv').config({path: '/home/sheppi/Scrivania/PartFinder/PartFinder/misc/.env'});
const express=require('express');
const app=express();
const mongoose=require('mongoose')

const userRoute = require('./routes/user');
const characterRoute = require('./routes/character');
const groupRoute = require('./routes/group');
const diceRoute = require('./routes/dice');
const cookie_parser=require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const routes=[userRoute,characterRoute,groupRoute,diceRoute];

app.use(cookie_parser());
app.use(express.json());
app.use('/',routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


mongoose.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
    if (err) return console.log("Error: ", err);
    console.log("MongoDB Connection -- Ready state is:", mongoose.connection.readyState);
    }
);

const listener = app.listen(process.env.PORT || 3000, () =>{
    console.log('App listening on port ' + listener.address().port);

})

module.exports = app;