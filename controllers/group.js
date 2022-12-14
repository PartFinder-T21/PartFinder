const Group = require("../models/group");
var codes=new Set();
{
    let letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let length=5;
    let size=4084101;
    let code="";
    for(let it=0;it<size;it++) {
        do {
            for (let i = 0; i < length; i++) {
                code += letters.charAt(Math.floor(Math.random() * length))
            }
        } while (codes.has(code));
        codes.add(code);
    }
}
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

const getAllGroups=(req,res)=>{
    Group.find({},(err,data)=>{
        if(err) return res.status(500).json({Error:err,status:500});
        return res.status(200).json({data:data,status:200});
    })
}

const getOneGroup=(req,res)=>{
    let code=req.query.code;
    Group.findOne({code:code},(err,data)=>{
        if(err || !data) return res.status(404).json({message:"Group does not exist",status:404});
        return res.status(200).json({data:data,status:200});
    })
}

const editGroup=(req,res)=>{
    let id=req.body.id;
    Group.findByIdAndUpdate(id,{
        description:req.body.description,
        size:req.body.size
    },(err)=>{
        if(err) return res.status(500).json({message:'Something went wrong', status:500});
        return res.status(200).json({message:'Updated',status:200});
    })
}
const deleteGroup=(req,res)=>{
    let id=req.body.id;
    let group=Group.findById(id,(err,data)=>{
        if(err || !data) return res.status(404).json({message:"Group does not exist",status:404});
        return res.json(data);
    })
    code=group.code;
    codes.add(code);
    group.deleteOne();
    res.status(204).send();
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
    requestsArray.splice(request.indexOf(req.body.character),1);
    Group.findByIdAndUpdate(req.body.group,{
        characters:charactersArray,
        requests:requestsArray
    },(err) => {
        if(err) return res.status(500).json({message:'Something went wrong',status:500});
        res.status(200).json({message:'Updated',status:200});
    })
}


module.exports = {newGroup,getAllGroups,getOneGroup,editGroup,deleteGroup,addPlayer};