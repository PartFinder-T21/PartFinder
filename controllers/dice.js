const throwDice=(req,res)=>{
    let numDadi=parseInt(req.query.num);
    let dado=parseInt(req.query.type);
    let result=0;
    let dadi=[4,6,8,20];
    if(!dadi.includes(dado) || numDadi <= 0 || numDadi > 100){
        console.log(dado);
        console.log(dadi.includes(dado));
        return res.status(400).json({message:'Bad requestDadoz',status:400});
    }
    else{
        if(dado !== 20){
            for(let i=0;i<numDadi;i++){
                result += (1+Math.floor(Math.random()*dado));
            }
            return res.status(200).json({result:result,status:200});
        }
        else{
            let string = "";
            for(let i=0;i<numDadi;i++){
                let calc=(1+Math.floor(Math.random()*dado))
                result += calc;
                string += calc.toString()+"  ";
            }
            string += "Total: "+result.toString();
            return res.status(200).json({result:string,status:200});
        }
    }

}

module.exports={throwDice}