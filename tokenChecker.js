const jwt = require("jsonwebtoken");
const tokenChecker = function(req, res, next) {
// header or url parameters or post parameters
    if(!req.cookies.tk) {
        return res.status(401).send();
    }
    let info = req.cookies.tk;
    let token = info.token;
    if (!token) res.status(401).json({success:false,message:'No token provided.'})
// decode token, verifies secret and checks expiration
    jwt.verify(token, process.env.SUPER_SECRET, function(err, decoded) {
        if (err){
            res.status(403).json({success:false,message:'Token not valid'})}
        else {
// if everything is good, save in req object for use in other routes
            req.headers.authorization = `Bearer ${token}`;
            req.userInfo = decoded;
            next();
        }
    });
};
module.exports = tokenChecker;