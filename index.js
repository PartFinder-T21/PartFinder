const path = require("path");
const dotenv=require('dotenv').config({path: path.resolve(__dirname+'/misc','.env')});
const express=require('express');
const app=express();
const mongoose=require('mongoose')
const cors = require('cors');
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
app.use(cors({
    origin: true,
    headers: {
        'Access-Control-Allow-Origin': ["http://localhost:8080","http://localhost:3000","https://partfindert21.onrender.com/","http://partfindert21.onrender.com/"],
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Credentials': true,
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
    },
    credentials: true
}));
app.use('/',routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
if(process.env.NODE_ENV === 'production') {
    app.use(express.static(__dirname + '/static/public'));
    app.use('/', express.static(path.join(__dirname, 'public')))
    app.get(/.*/, (req, res) => res.sendFile(__dirname + '/static/index.html'));
}
mongoose.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
    if (err) return console.log("Error: ", err);
    console.log("MongoDB Connection -- Ready state is:", mongoose.connection.readyState);
    }
);

const listener = app.listen(process.env.PORT || 3000,'0.0.0.0');

module.exports = app;