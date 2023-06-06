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
const corsMiddleware = require("./corsMiddleware");

const routes=[userRoute,characterRoute,groupRoute,diceRoute];

app.use(cookie_parser());
app.use(express.json());
const allowedOrigins = [
    "https://partfindert21.onrender.com/",
    "http://partfindert21.onrender.com/",
    "https://partfindert21web.onrender.com/",
    "http://partfindert21web.onrender.com/",
    "http://localhost:3000",
    "http://localhost:8080"
];

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://partfindert21.onrender.com"); // Sostituisci "http://example.com" con l'origine consentita per le richieste
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

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