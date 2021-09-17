
const Firma = require("../models/firma.js")
const User = require("../models/users")
const BroiloStatus = require("../models/broiloStatus")

const csv=require("csvtojson");
const generateLog = require("../logs")
const _ = require('lodash');
const { forEach } = require("lodash");

const dodadiFirma = (req, res) => {
    const name=req.body.name;
    const broj=req.body.broj;
    const adresa=req.body.adresaNaFirma;
    const agent=req.body.agent;
    const nagrada=req.body.nagrada;

    if( name==null || broj==null || adresa==null || agent==null || nagrada==null){
        return res.json({"message":"Error","detail":"Missing arguments"})
    }

    User.findOne({where:{username: agent}}).then((user)=>{
        if(user===null){
            return res.json({"message":"No agent","detail":"No agent with that username"})
        }

        Firma.create({
            name,
            adresaNaFirma:adresa,
            broj,
            agent,
            nagrada
        }).then(()=>{
            generateLog("Додаде нова компанија", req.session.username, name)
            return res.send({"message":"success","detail":"Successfully added company"})}).catch(err=>{
          
            console.error( 'Captured validation error: ', err.errors[0]);
            
            return res.json({"code":err.code,"message":err.errors[0].message,"detail":err.errors[0].message});
        })
    })
    

}
const promeniFirma = (req,res) =>{
    

    const name=req.body.name;
    const broj=req.body.broj;
    const adresa=req.body.adresaNaFirma;
    const agent=req.body.agent;
    const nagrada=req.body.nagrada;
    if( req.body.name=="" || req.body.broj=="" || req.body.adresaNaFirma=="" || req.body.agent=="" || req.body.nagrada==""){
        return res.json({"message":"Error","detail":"Missing arguments"})
    }
    const firma = Firma.findOne({where:{id:req.body.id}});
    User.findOne({where:{username:req.body.agent}}).then((agent)=>{
        if(agent===null){
           return res.json({message:"No agent",detail:"No agent with that name"})
        }

    firma.name=req.body.name==="undefined"?firma.name : req.body.name;
    firma.broj=req.body.broj==="undefined"?firma.broj:req.body.broj;
    firma.agent=req.body.agent==="undefined"?firma.agent:req.body.agent;
    firma.adresaNaFirma=req.body.adresaNaFirma==="undefined"?firma.adresaNaFirma:req.body.adresaNaFirma
    ;
    firma.nagrada=req.body.nagrada==="undefined"?firma.nagrada:req.body.nagrada;
    Firma.update(firma, {
        where:{id:req.body.id}
    }).then(()=>{
        generateLog("Промени податоци за компанија", req.session.username, firma.name)
        return res.json({message:"Success",detail:"Updated firma"})
    })
    })
}

const izbrisiFirma = async (req,res) =>{
    const firma = await Firma.findOne({where:{id:req.body.id}})
    Firma.destroy({
        where: {
            id:req.body.id
        }
    }).then(()=>{
        generateLog("Избриша компанија", req.session.username, firma.name)
        return res.json({message:"Success",detail:"Deleted company"})
    }).catch(()=>{
        return res.json({message:"Error",detail:"Failed to delete company"})
    })
}

const zemiFirmi = async (req,res) =>{
    
    const firmi = await Firma.findAndCountAll({limit:req.body.limit, offset:req.body.offset, attributes:["id", "name","adresaNaFirma", "broj","agent","nagrada"],raw : true})
    return res.json(firmi)
}

function zemiBroilaNaFirma  (req, res){
    var id = req.body.id
    var mesec = req.body.mesec
    BroiloStatus.findAll({where:
    {
        firmaId:id,
        mesec

    },
    raw:true
}).then((result)=>{
    return res.json(result)
})
}



module.exports={dodadiFirma, promeniFirma, izbrisiFirma, zemiFirmi, zemiBroilaNaFirma}