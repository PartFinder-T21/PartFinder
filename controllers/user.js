const newUser = (req,res,next) => {
    let emailisin = User.exists({email: req.body.email},(err,data)=>{
        if(err || !data) return res.status(404).json({message:"Group does not exist",status:404});
    });
    let usernameisin= User.exists({username: req.body.username},(err,data)=>{
        if(err || !data) return res.status(404).json({message:"Group does not exist",status:404});
    });
    if(emailisin){

    }
    res.json({message: "prova POST"});
}
module.exports = {newUser};