const Group = require("../models/group");
const newUser = (req,res,next) => {
    let emailisin = User.exists({email: req.body.email},(err,data)=>{
        if(err || !data) return res.status(404).json({message:"Group does not exist",status:404});
    });
    let usernameisin= User.exists({username: req.body.username},(err,data)=>{
        if(err || !data) return res.status(404).json({message:"Group does not exist",status:404});
    });
    if(emailisin){
        return res.status(400).json({message:'email already registered',status:400});
    }
    if(usernameisin){
        return res.status(400).json({message:'username already taken',status:400});
    }
    const newUser = (req,res)=>{
        const newUser=new User({
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            image:req.body.image,
            description:req.body.description,
            reputation:req.body.reputation,
            isVerified:req.body.isVerified
        })
        newUser.save((err,data)=>{
            if(err) return res.status(500).json({Error:err,status:500});
            return res.status(201).json({data:data,status:201});
        })
    };
    res.json({message: "prova POST"});
}
module.exports = {newUser};