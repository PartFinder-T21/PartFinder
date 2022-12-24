const Character = require("../models/character");
const newCharacter = (req,res)=>{
    let stats=req.body.stats;
    let userInfo=req.userInfo;
    let user=userInfo.id;
    if(stats.length===4) {
        const newCharacter = new Character({
            name: req.body.name,
            user: user,
            image: req.body.image,
            class: req.body.class,
            stats: stats,
            inventory: [],
        })
        newCharacter.save((err, data) => {
            if (err) return res.status(500).json({Error: err, status: 500});
            return res.status(201).json({data: data, status: 201});
        })
    }
    else return res.status(400).json({message:"Stats array size is too big",status:400});
};

const getCharacters=(req,res)=>{
    let userInfo=req.userInfo;
    let user=userInfo.id;
    let id=req.query.id;
    if(!id)
        Character.find({user: user}, (err, data) => {
            if (err) return res.status(500).json({Error: err, status: 500});
            else return res.status(200).json({data: data, status: 200});
        })
    else
        Character.findById(id,(err,data)=>{
            if (err) return res.status(500).json({Error: err, status: 500});
            else return res.status(200).json({data: data, status: 200});
        })
}
const editCharacter=(req,res)=>{
    let userInfo=req.userInfo;
    let user=userInfo.id;
    let id=req.body.id;
    Character.findById(id,(err,data)=>{
        if(err) return res.status(500).json({message:'Something went wrong', status:500});
        else if(!data) return res.status(404).json({message:'Character does not exist',status:404});
        else if(data.user!==user) return res.status(403).send();
        else
            Character.findByIdAndUpdate(id,{
                name:req.body.name,
                image:req.body.image,
                class:req.body.class,
                stats:req.body.stats,
                inventory:req.body.inventory,
            },(err)=>{
                if(err) return res.status(500).json({message:'Something went wrong', status:500});
                return res.status(200).json({message:'Updated',status:200});
            })
    })

}
const deleteOneCharacter=(req,res)=>{
    let id=req.body.id;
    let userInfo=req.userInfo;
    let user=userInfo.id;
    Character.findById(id,(err,data)=>{
        if(err) return res.status(500).json({message:"Unexpected error",status:500});
        else if(!data) return res.status(404).json({message:"Character does not exist",status:404});
        else if(data.user!==user) return res.status(403).send();
        else
            Character.findByIdAndDelete(id,(err)=>{
                if(err) return res.status(500).json({message:"Unexpected error",status:500});
                else return res.status(204).send();
            })
    })
}


module.exports = {newCharacter,getCharacters,editCharacter,deleteOneCharacter};