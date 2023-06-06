
const corsMiddleware = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", ["http://localhost:8080","http://localhost:3000","https://partfindert21.onrender.com/","http://partfindert21.onrender.com/"]);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    next();
};
module.exports = corsMiddleware;