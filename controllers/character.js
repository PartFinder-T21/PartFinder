const newCharacter = (req,res)=>{
    const newCharacter=new Character({
        name:req.body.name,
        user:req.body.user,
        image:req.body.image,
        class:req.body.class,
        stats:req.body.stats,
        inventory:req.body.inventory,
    })
    newCharacter.save((err,data)=>{
        if(err) return res.status(500).json({Error:err,status:500});
        return res.status(201).json({data:data,status:201});
    })
};

const getAllCharacters=(req,res)=>{
    Character.find({},(err,data)=>{
        if(err) return res.status(500).json({Error:err,status:500});
        return res.status(200).json({data:data,status:200});
    })
}

const getOneCharacter=(req,res)=>{
    let id=req.body.id;
    Character.findById(id,(err,data)=>{
        if(err || !data) return res.status(404).json({message:"Character does not exist",status:404});
        return res.status(200).json({data:data, status: 200});
    })
}

const editCharacter=(req,res)=>{
    let id=req.body.id;
    Character.findByIdAndUpdate(id,{
        name:req.body.name,
        user:req.body.user,
        image:req.body.image,
        class:req.body.class,
        stats:req.body.stats,
        inventory:req.body.inventory,
    },(err)=>{
        if(err) return res.status(500).json({message:'Something went wrong', status:500});
        return res.status(200).json({message:'Updated',status:500});
    })
}
const deleteOneCharacter=(req,res)=>{
    let id=req.body.id;
    let char=Character.findOne({_id:id},(err,data)=>{
        if(err || !data) return res.json({message:"Character does not exist"});
        return res.json(data);
    })
    char.deleteOne();
    res.status(204).send();
}


module.exports = {newCharacter,getAllCharacters,getOneCharacter,editCharacter,deleteOneCharacter};