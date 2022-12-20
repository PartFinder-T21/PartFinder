const throwDice=(req,res)=>{
    let numDadi=req.query.num;
    let dado=req.query.type;
    let dadi=[4,6,8,20];
    if(!dadi.includes(dado) || numDadi <= 0 || numDadi > 100)
        return res.status(400).json({message:'Bad request',status:400});

}

module.exports={throwDice}