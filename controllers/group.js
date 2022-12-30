const Group = require("../models/group");
const Character = require("../models/character");
const _ = require('lodash');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const axios = require("axios");
const {response} = require("express");
const generateCode = ()=>{
    let letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let length=5;
    let code="";
    for (let i = 0; i < length; i++) {
        code += letters.charAt(Math.floor(Math.random() * 26))
    }
    return code;
}
const newGroup = async (req, res) => {
    let userInfo = req.userInfo;
    let code;
    do {
        code = generateCode();
    } while (await Group.exists({code: code}).exec());
    let newGroup = new Group({
        name: req.body.name,
        code: code,
        master: userInfo.id,
        description: req.body.description,
        size: req.body.size,
        characters: [],
        requests: [],
        messages: []
    })
    newGroup.save((err, data) => {
        if (err) return res.status(500).json({Error: err, status: 500});
        return res.status(201).json({data: data, status: 201});
    })
};

const getGroups=(req,res)=>{
    let code=req.query.code;
    if(!code) {
        Group.find({}, (err, data) => {
            if (err) return res.status(500).json({Error: err, status: 500});
            return res.status(200).json({data: data, status: 200});
        })
    }
    else {
        Group.findOne({code: code}, (err, data) => {
            if (err || !data) return res.status(404).json({message: "Group does not exist", status: 404});
            return res.status(200).json({data: data, status: 200});
        })
    }
}
const getMyGroups=(req,res)=>{
    let userInfo = req.userInfo;
    let user = req.params.user;
    if(user === userInfo.id)
        Group.find({$or:[{characters:{user:userInfo.id}},{master:userInfo.id}]}, (err, data) => {
            if (err || !data) return res.status(404).json({message: "Group does not exist", status: 404});
            else return res.status(200).json({data: data, status: 200});
        })
    else return res.status(403).send();
}

const editGroup=(req,res)=>{
    let userInfo=req.userInfo;
    let id=req.body.id;
    let description=req.body.description;
    let size=req.body.size;
    let master=userInfo.id;
    Group.findById(id,(err,data)=> {
        if(err) return res.status(500).json({message:'Something went wrong',status:500});
        else if(size > 5) return res.status(400).json({message: 'Size too big', status: 400});
        else if(data.master !== master) return res.status(403).json({message:'User is not master',status:403});
        else {
            Group.findByIdAndUpdate(id, {
                description: description,
                size: size
            }, (err) => {
                if (err) return res.status(500).json({message: 'Something went wrong', status: 500});
                return res.status(200).json({message: 'Updated', status: 200});
            })
        }
    })
}
const deleteGroup=(req, res) => {
    let id = req.body.id;
    let userInfo=req.userInfo;
    let master=userInfo.id;
    Group.findById(id,(err,data)=>{
        if (err) return res.status(500).json({message: "Unexpected error", status: 500});
        else if (!data) return res.status(404).json({message: "Group does not exist", status: 404});
        else if(data.master!==master) return res.status(403).send();
        else
            Group.findByIdAndDelete(id,(err)=>{
                if(err) return res.status(500).json({message:'Unexpected error',status: 500});
                else return res.status(204).send();
            })
    })
}
const addPlayer=(req,res)=>{
    let id=req.body.id;
    let player={user:req.body.user,character:req.body.character};
    let userInfo=req.userInfo;
    let master=userInfo.id;
    let requestID=req.body.request;

    Group.findById(id,async (err, data) => {
        if (err) return res.status(500).json({message: 'Something went wrong', status: 500});
        else if (!data) return res.status(404).json({message: 'Group does not exist', status: 404});
        else if (data.master !== master) return res.status(403).send();
        else {
            let charactersArray = data.characters;
            let requestsArray = data.requests;
            if (charactersArray.length === data.size)
                return res.status(400).json({message: 'Group is full', status: 400});
            else if (_.some(charactersArray,{user:player.user}))
                return res.status(400).json({message: 'User is already in group', status: 400});
            else if(!_.some(requestsArray,{_id: ObjectId(requestID)}))
                return res.status(400).json({message: 'Request not in list', status: 400});

            else {
                if (await Character.exists({_id: player.character}).exec()) {
                    charactersArray.push(player);
                    _.remove(requestsArray, {_id: ObjectId(requestID)});
                    Group.findByIdAndUpdate(id, {
                        characters: charactersArray,
                        requests: requestsArray
                    }, (err) => {
                        if (err) return res.status(500).json({message: 'Something went wrong', status: 500});
                        else return res.status(200).json({message: 'Character added', status: 200});
                    })
                } else return res.status(400).json({message: 'User or Character do not exist', status: 400});
            }
        }
    })
}
const declinePlayer=(req,res)=>{
    let id=req.body.id;
    let requestID=req.body.request;
    let userInfo=req.userInfo;
    let master=userInfo.id;
    Group.findById(id,(err,data)=>{
        if(err) return res.status(500).json({message:'Something went wrong',status:500});
        else if(!data) return res.status(404).json({message:'Group does not exist',status:404});
        else if(data.master!==master) return res.status(403).json({message:'Not master',status:403});
        else{
            let requestsArray=data.requests;
            if(_.some(requestsArray,{_id:ObjectId(requestID)})) {
                _.remove(requestsArray, {_id: ObjectId(requestID)});
                Group.findByIdAndUpdate(id, {
                    requests: requestsArray
                }, (err) => {
                    if (err) return res.status(500).json({message: 'Something went wrong', status: 500});
                    else return res.status(200).json({message: 'Player declined', status: 200});
                })
            }
            else return res.status(400).json({message:'Request not in list',status:400});
        }
    })
}
const removePlayer=(req,res)=>{
    let id=req.body.id;
    let playerID=req.body.playerid;
    let userInfo=req.userInfo;
    let master=userInfo.id;
    Group.findById(id,(err,data)=>{
        if(err) return res.status(500).json({message:'Something went wrong',status:500});
        else if(!data) return res.status(404).json({message:'Group does not exist',status:404});
        else if(data.master!==master) return res.status(403).send();
        else{
            let charactersArray=data.characters;
            if(_.some(charactersArray,{_id:ObjectId(playerID)})) {
                _.remove(charactersArray, {_id: ObjectId(playerID)});
                Group.findByIdAndUpdate(id, {
                    characters: charactersArray
                }, (err) => {
                    if (err) return res.status(500).json({message: 'Something went wrong', status: 500});
                    else return res.status(200).json({message: 'Player removed', status: 200});
                })
            }
            else return res.status(400).json({message:'Player not in list',status:400});
        }
    })
}
const requestJoin=(req,res)=>{
    let userInfo=req.userInfo;
    let player={user:userInfo.id,character:req.body.character};
    let id=req.body.id;
    Character.findById(player.character,(err,data)=> {
        if (err) return res.status(500).json({message: 'Something went wrong', status: 500});
        else if (!data) return res.status(404).json({message: 'Group does not exist', status: 404});
        else if(data.user !== player.user) return res.status(400).json({message:'Character not in user list',status:400});
        else {
            Group.findById(id, (err, data) => {
                if (err) return res.status(500).json({message: 'Something went wrong', status: 500});
                else if (!data) return res.status(404).json({message: 'Group does not exist', status: 404});
                else if (data.master === player.user) return res.status(400).json({
                    message: 'User is master',
                    status: 400
                });
                else {
                    let requestArray = data.requests;
                    let charactersArray = data.characters;
                    if (_.some(charactersArray, {user: player.user}) || _.some(requestArray, {user: player.user}))
                        return res.status(400).json({message: "Cannot send more than one request"});
                    //group is full
                    else if (charactersArray.length === data.size) return res.status(400).json({
                        message: "Group is full",
                        status: 400
                    });
                    else {
                        requestArray.push(player);
                        Group.findByIdAndUpdate(id, {
                            requests: requestArray
                        }, (err) => {
                            if (err) return res.status(500).json({message: 'Something went wrong', status: 500});
                            else return res.status(200).json({message: 'Request sent', status: 200});
                        })
                    }
                }
            })
        }
    })
}

const newMessage=(req,res)=>{
    let id=req.body.id;
    let userInfo=req.userInfo;
    let user=userInfo.id;
    let username=userInfo.username;
    let isMaster=false;
    let message=req.body.message;
    Group.findById(id,(err,data)=>{
        if(err) return res.status(500).json({message:'Something went wrong',status:500});
        else if(!data) return res.status(404).json({message:'Group does not exist',status:404});
        else {
            let charactersArray=data.characters;
            let messages=data.messages
            //if user is not in group
            if(user !== data.master && !_.some(charactersArray,{user:user})){
                return res.status(403).json({message:'User in not in group',status:403});
            }
            else {
                if (user === data.master) isMaster = true;
                messages.push({username: username, message: message, isMaster: isMaster});
                Group.findByIdAndUpdate(id, {
                    messages: messages
                }, (err) => {
                    if (err) return res.status(500).json({message: 'Something went wrong', status: 500});
                    return res.status(201).json({message: 'Message sent', status: 201})
                })
            }

        }
    })
}

const getMessages=(req,res)=>{
    let id=req.query.id;
    let userInfo=req.userInfo;
    let user=userInfo.id;
    Group.findById(id,(err,data)=>{
        if(err) return res.status(500).json({message:'Something went wrong',status:500});
        else if(!data) return res.status(404).json({message:'Group does not exist',status:404})
        else{
            let messages=data.messages;
            let charactersArray=data.characters;
            if(!_.some(charactersArray,{user:user})) return res.status(403).json({message:'User is not in group',status:403});
            else return res.status(200).json(messages);
        }
    })
}

const rollDice=(req,res)=>{
    let numDadi=req.query.num;
    let dado=req.query.type;
    let id=req.body.id;
    let url='http://localhost:8080/dice?num='+numDadi+'&type='+dado;
    axios.get(url)
        .then((response)=>{
            let message=response.data.result;
            url='http://localhost:8080/group/chat';
            axios.put(url,{id:id,message:message},{headers: {cookie: req.headers.cookie}})
                .then((response)=>{
                    return res.status(201).send();
                })
                .catch((error)=>{
                    return res.status(500).json({Error:error});
                })
        })
        .catch((error)=>{
            return res.status(500).json({Error:error,status:500});
        })
}

module.exports = {
    newGroup,
    getGroups,
    getMyGroups,
    editGroup,
    deleteGroup,
    addPlayer,
    declinePlayer,
    removePlayer,
    requestJoin,
    newMessage,
    getMessages,
    rollDice
};