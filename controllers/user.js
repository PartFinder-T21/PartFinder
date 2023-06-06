const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user")
const mongoose = require("mongoose");
const { ObjectId } = require('mongodb');
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
        upvotes:[],
        downvotes:[]
    })
    newUser.save((err,data)=>{
        if(err){
            if(err.code!==11000)return res.status(500).json({Error:err,status:500});
            else return res.status(400).json({message:"Username and/or email is already registered",status:400});
        }
        else{
            let payload = {username: data.username, id: data._id};
            let options = {expiresIn: 21600};
            let token = jwt.sign(payload, process.env.SUPER_SECRET, options);
            let save = {
                success: true,
                message: "validation token",
                token: token,
                username: data.username,
                id: data._id,
            }
            res.cookie('tk',save,{secure: true,sameSite:'none',domain: 'https://partfindert21.onrender.com/'});
            res.cookie('name',data.username,{secure: true,sameSite:'none',domain: 'https://partfindert21.onrender.com/'});
            res.cookie('id',data._id,{secure: true,sameSite:'none',domain: 'https://partfindert21.onrender.com/'});
            res.setHeader('Set-Cookie', ['tk=' + save + '; SameSite=None; Secure']);
            res.setHeader('Set-Cookie', ['name=' + data.username + '; SameSite=None; Secure']);
            res.setHeader('Set-Cookie', ['id=' + data._id + '; SameSite=None; Secure']);

            return res.status(201).send();

        }
    })
}

const login = (req,res) => {
    User.findOne({$or:[{email:req.body.input},{username:req.body.input}]},(err,data)=>{
        if(err) return res.status(500).json({message:"Unexpected error",status:500});
        else if(!data) return res.status(400).json({message:"Username or password is wrong",status:400});
        else {
            bcrypt.compare(req.body.password, data.password, (err, result) => {
                if (err) {
                    return res.status(500).json({message:"Unexpected error", status: 500});
                } else if (result) {
                    let payload = {username: data.username, id: data._id};
                    let options = {expiresIn: 21600};
                    let token = jwt.sign(payload, process.env.SUPER_SECRET, options);
                    let save = {
                        success: true,
                        message: "validation token",
                        token: token
                    }
                    res.cookie('tk',save);
                    res.cookie('name',data.username);
                    res.cookie('id',data._id.toString());
                    return res.status(200).json({username:data.username,status:200});
                } else {
                    return res.status(400).json({Result:result,message: "Username or password is wrong", status: 400});
                }
            })
        }
    })
}

const getUser=(req,res)=>{
    let id=req.query.id;
    if(!id)
        User.find({},'username image description reputation',(err,data)=>{
            if(err) return res.status(500).json({message:'Unexpected error',status:500});
            else return res.status(200).json(data);
        })
    else
        User.findById(id,'username image description reputation',(err,data)=>{
            if(err) return res.status(500).json({message:err,status:500});
            else if(!data) return res.status(404).json({message:'User does not exist',status:404});
            else return res.status(200).json(data);
        })
}

const editUser=(req,res)=>{
    let id=req.body.id;
    let userInfo = req.userInfo;
    let myId=userInfo.id;
    if(id === myId){
        let username=req.body.username;
        let image=req.body.image;
        let description=req.body.description;
        User.findByIdAndUpdate(myId,{
            username:username,
            description:description,
            image:image
        },(err)=>{
            if(err){
                if(err.code!==11000)return res.status(500).json({Error:err,status:500});
                else return res.status(400).json({message:"Username and/or email is already registered",status:400});
            }
            else{
                res.cookie('name',username);
                return res.status(200).json({message:'Updated',status:200});
            }
        })
    }
    else return res.status(403).json({message:'User id does not match',status:403});
}

const upVote=(req,res)=>{
    let id=req.body.id;
    let userInfo = req.userInfo;
    let myId=userInfo.id;
    if(myId !== id) {
        User.findById(id,(err, data) => {
            if (err) return res.status(500).json({message: 'Unexpected error', status: 500});
            else if (data.upvotes.includes(myId)) return res.status(400).json({
                message: 'Cannot upvote twice',
                status: 400
            });
            else{
                User.findByIdAndUpdate(id,{
                    $inc:{reputation:1},
                    $push:{upvotes:myId},
                    $pull:{downvotes:myId}
                },(err)=>{
                    if (err) return res.status(500).json({message: 'Unexpected error', status: 500});
                    else return res.status(200).json({message:'User upvoted',status:200});
                })
            }
        })
    }
    else return res.status(400).json({message:'Bad request',status:400});
}
const downVote=(req,res)=>{
    let id=req.body.id;
    let userInfo = req.userInfo;
    let myId=userInfo.id;
    if(myId !== id) {
        User.findById(id,(err, data) => {
            if (err) return res.status(500).json({message: 'Unexpected error', status: 500});
            else if (data.downvotes.includes(myId)) return res.status(400).json({
                message: 'Cannot downvote twice',
                status: 400
            });
            else{
                User.findByIdAndUpdate(id,{
                    $inc:{reputation:-1},
                    $push:{downvotes:myId},
                    $pull:{upvotes:myId}
                },(err)=>{
                    if (err) return res.status(500).json({message: 'Unexpected error', status: 500});
                    else return res.status(200).json({message:'User downvoted',status:200});
                })
            }
        })
    }
    else return res.status(400).json({message:'Bad request',status:400});
}
const deleteUser=(req,res)=>{
    let id=req.body.id;
    let userInfo = req.userInfo;
    let myId=userInfo.id;
    if(id === myId){
        User.findByIdAndDelete(myId
        ,(err)=>{
            if(err){
                return res.status(500).json({Error:err,status:500});
            }
            else{
                return res.status(200).json({message:'User deleted',status:200});
            }
        })
    }
    else return res.status(403).json({message:'User id does not match',status:403});
}
module.exports = {newUser,login,getUser,editUser,upVote,downVote,deleteUser};