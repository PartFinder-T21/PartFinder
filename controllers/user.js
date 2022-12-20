const Group = require("../models/group");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user")
const newUser = (req,res) => {
        const newUser=new User({
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            image:req.body.image,
            description:req.body.description,
            reputation:0,
            isVerified:false,
            groups:[]
        })
        newUser.save((err,data)=>{
            if(err){
                if(err.code!=11000)return res.status(500).json({Error:err,status:500});
                else return res.status(400).json({message:"Username and/or email is already registered",status:400});
            }
            return res.status(201).json({data:data,status:201});
        })
}

const login = async (req,res,next) => {
    let email = req.body.input;
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };
    if(validateEmail){
        let User = User.findOne({email: req.body.input},(err,data) => {
            if(err || !data) return res.status(500).json({message:'User or password is wrong',status:500})
            return JSON.parse(data);
        });
    }
    else{
        let User = User.findOne({username: req.body.input},(err,data) => {
            if(err || !data) return res.status(500).json({message:'User or password is wrong',status:500})
            return JSON.parse(data);
        });
    }
    if(await bcrypt.compare(User.password, req.body.password)){
        var payload = {username:User.username,id:User._id};
        var options = {expireIn:21600};
        var token = jwt.sign(payload,process.env.SUPER_SECRET,options);

        res.json({success: true,message: "validation token", token: token,
            username:User.username,id:User._id,self:"user/tk/"+User._id});
    }
    else{
        return res.status(400).json({message:'User or password is wrong',status:400});
    }

}

module.exports = {newUser,login};