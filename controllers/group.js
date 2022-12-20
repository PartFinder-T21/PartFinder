const Group = require("../models/group");
var codes = new Set();
var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('codes.txt',)
});
lineReader.on('line', function (line) {
    codes.add(line);
});

const chooseFirst=()=>{
    let it=codes.values();
    let first=it.next().value;
    codes.delete(first);
    return first;
}
const newGroup = (req,res)=>{
    const newGroup=new Group({
        name:req.body.name,
        code:chooseFirst(),
        master:req.body.master,
        description:req.body.description,
        size:req.body.size,
        characters:[],
        requests:[]
    })
    newGroup.save((err,data)=>{
        if(err) return res.status(500).json({Error:err,status:500});
        return res.status(201).json({data:data,status:201});
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

const editGroup=(req,res)=>{
    let id=req.body.id;
    let description=req.body.description;
    let size=req.body.size;
    if(size>5) return res.status(400).json({message:'Size too big',status:400});
    Group.findByIdAndUpdate(id,{
        description:description,
        size:size
    },(err)=>{
        if(err) return res.status(500).json({message:'Something went wrong', status:500});
        return res.status(200).json({message:'Updated',status:200});
    })
}
const deleteGroup=(req, res) => {
    let id = req.body.id;
    Group.findById(id, (err, data) => {
        if (err || !data) return res.status(404).json({message: "Group does not exist", status: 404});
        else{
            Group.findByIdAndDelete(id, (err) => {
                if (err) return res.status(500).json({message: "Error while deleting", status: 500});
                codes.add(Group(data).code);

                return res.status(204).json({message:"Group deleted",status:204});
            });
        }
    })
}
const addPlayer=(req,res)=>{
    let group=Group.findById(req.body.group,(err,data)=>{
        if(err || !data) return res.status(500).json({message:'Something went wrong',status:500})
        return JSON.parse(data);
    })
    let charactersArray=Group(group).characters;
    let requestsArray=Group(group).requests;
    if(charactersArray.length===Group(group).size)
        return res.status(400).json({message:'Group is full',status:400});
    if(charactersArray.includes(req.body.character))
        return res.status(400).json({message:'Character is already in group',status:400})
    charactersArray.push(req.body.character);
    requestsArray.splice(requestsArray.indexOf(req.body.character),1);
    Group.findByIdAndUpdate(req.body.group,{
        characters:charactersArray,
        requests:requestsArray
    },(err) => {
        if(err) return res.status(500).json({message:'Something went wrong',status:500});
        res.status(200).json({message:'Character added',status:200});
    })
}
const declinePlayer=(req,res)=>{
    let group=Group.findById(req.body.group,(err,data)=>{
        if(err || !data) return res.status(500).json({message:'Something went wrong',status:500})
        return JSON.parse(data);
    })
    let requestsArray=Group(group).requests;
    requestsArray.splice(requestsArray.indexOf(req.body.character),1);
    Group.findByIdAndUpdate(req.body.group,{
        requests:requestsArray
    },(err) => {
        if(err) return res.status(500).json({message:'Something went wrong',status:500});
        res.status(200).json({message:'Player declined',status:200});
    })
}
const removePlayer=(req,res)=>{
    let group=Group.findById(req.body.group,(err,data)=>{
        if(err || !data) return res.status(500).json({message:'Something went wrong',status:500})
        return JSON.parse(data);
    })
    let charactersArray=Group(group).characters;
    charactersArray.splice(charactersArray.indexOf(req.body.character),1);
    Group.findByIdAndUpdate(req.body.group,{
        characters:charactersArray
    },(err) => {
        if(err) return res.status(500).json({message:'Something went wrong',status:500});
        res.status(200).json({message:'Player removed',status:200});
    })
}
const requestJoin=(req,res)=>{
    let characterid=req.body.characterid;
    let groupid=req.body.groupid;
    let group=Group.findById(groupid,(err,data)=>{
        if(err || !data) return res.status(500).json({message:'Something went wrong',status:500})
        return JSON.parse(data);
    })
    let requestArray=Group(group).characters;
    requestArray.push(characterid);
    Group.findByIdAndUpdate(groupid,{
        requests:requestArray
    },(err)=>{
        if(err) return res.status(500).json({message:'Something went wrong',status:500});
        return res.status(200).json({message:'Request sent',status:200});
    })
}

const newMessage=(req,res)=>{
    let groupid=req.body.groupid;
    let history=Group.findById(groupid,(err,data)=>{
        if(err) return res.status(500).json({message:'Something went wrong',status:500});
        return JSON.parse(data);
    })
    //if user is not in group
    if(!Group(history).characters.includes({user:req.body.userid}))
        return res.status(403).json({message:'User is not in group',status:403});

    history=Group(history).messages;
    history.push({username:req.body.username,message:req.body.message,isMaster:req.body.master});
    Group.findByIdAndUpdate(groupid,{
        messages:history
    },(err)=>{
        if(err) return res.status(500).json({message:'Something went wrong',status:500});
        return res.status(200).json({message:'Message sent',status:200})
    })
}

const getMessages=(req,res)=>{
    let groupid=req.query.groupid;
    let history=Group.findById(groupid,(err,data)=>{
        if(err) return res.status(500).json({message:'Something went wrong',status:500});
        return JSON.parse(data);
    })
    //if user is not in group
    if(!Group(history).characters.includes({user:req.body.userid}))
        return res.status(403).json({message:'User is not in group',status:403});

    history=Group(history).messages;
    return res.status(200).json(history);
}

module.exports = {
    newGroup,
    getGroups,
    editGroup,
    deleteGroup,
    addPlayer,
    declinePlayer,
    removePlayer,
    requestJoin,
    newMessage,
    getMessages
};