const newCharacter = (req,res)=>{
    Character.findOne({name:req.body.name,user:req.body.user},(err,data)=>{
        if(!data){
            const newCharacter=new Character({
                name:req.body.name,
                user:req.body.user,
                image:req.body.image,
                class:req.body.class,
                stats:req.body.stats,
                inventory:req.body.inventory,
    
            })
            newCharacter.save((err,data)=>{
                if(err) return res.json({Error:err});
                return res.json(data);
            })
        }else{
            if(err) return res.json('Something went wrong ${err}');
            return res.json({message:"Character already exists"});
        }
    })
};

const getAllCharacters=(req,res)=>{
    Character.find({},(err,data)=>{
        if(err) return res.json({Error:err});
        return res.json(data);
    })
}

const getOneCharacter=(req,res)=>{
    let name=req.body.name;
    let user=req.body.user;
    Character.findOne({name:name,user:user},(err,data)=>{
        if(err || !data) return res.json({message:"Character does not exist"});
        return res.json(data);
    })
}

const editCharacter=(req,res)=>{

}
const deleteOneCharacter=(req,res)=>{
    let name=req.body.name;
    let user=req.body.user;
    let char=Character.findOne({name:name,user:user},(err,data)=>{
        if(err || !data) return res.json({message:"Character does not exist"});
        return res.json(data);
    })
    char.deleteOne();
    res.status(204).send();
}


module.exports = {newCharacter,getAllCharacters,getOneCharacter,deleteOneCharacter};