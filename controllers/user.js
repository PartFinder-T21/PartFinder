const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user")
const dotenv = require('dotenv').config({path: '/home/sheppi/Scrivania/PartFinder/PartFinder/misc/.env'});
const newUser = async(req,res) => {
    let hashedPassword = bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10));
    const newUser=new User({
        username:req.body.username,
        email:req.body.email,
        password:hashedPassword,
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

const login = (req,res) => {
    User.findOne({$or:[{email:req.body.input},{username:req.body.input}]},(err,data)=>{
        if(err) return res.status(500).json({message:"Unexpected error",status:500});
        else if(!data) return res.status(400).json({message:"Username or password wrong email check",status:400});
        else {
            bcrypt.compare(req.body.password, data.password, (err, result) => {
                if (err) {
                    return res.status(500).json({message:"Unexpected error", status: 500});
                } else if (result) {
                    let payload = {username: data.username, id: data._id};
                    let options = {expiresIn: 21600};
                    let token = jwt.sign(payload, process.env.SUPER_SECRET, options);

                    return res.status(200).json({
                        success: true, message: "validation token", token: token,
                        username: data.username, id: data._id, self: "user/tk/" + data._id
                    });
                } else {
                    return res.status(400).json({Result:result,message: "Username or password is wrong password check", status: 400});
                }
            })
        }
    })
}

module.exports = {newUser,login};