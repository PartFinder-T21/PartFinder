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
    let code=req.body.code;
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
        return res.status(200).json({message:'Updated',status:500});
    })
}
const deleteGroup=(req,res)=>{
    let id=req.body.id;
    let group=Group.findById(id,(err,data)=>{
        if(err || !data) return res.status(404).json({message:"Group does not exist",status:404});
        return res.status(200).json(data);
    })
    group.deleteOne();
    res.status(204).send();
}


module.exports = {newGroup,getAllGroups,getOneGroup,editGroup,deleteGroup};