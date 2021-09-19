const User = require("../models/users.js")
const bcrypt = require("bcryptjs")
const session=require("express-session")
const generateLog = require("../logs")

const login = async function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    if(username===""){return res.json({"message":"enter username"})}
    const user = await User.findOne({where:{username: req.body.username}})
    if(user === null){
        return res.json({"message":"No user","detail":"no user with that username"})
    }
    const passwordresult = await bcrypt.compare(password, user.password)
    if(passwordresult){
        req.session.isLoggedIn=true;
        req.session.username=username;
        generateLog("Се најави", username)
        return res.json({"message":"Logged in"})
    }
    else{
        return res.json({"message":"wrong password","detail":"wrong password"})
    }

}

const getUsers= async function(req,res){
    const users = await User.findAll({attributes:["id","username", "ime", "prezime", "isAdmin"],raw : true})
    return res.json(users)
}

const logout = async function(req,res){
    req.session.isLoggedIn=false;
    req.session.username='';
    return res.json({"message":"Logged out"})
}

const whoAmI = async function (req, res){
    const user = await User.findOne({where:{username: req.session.username}})
    if(user === null){
        return res.json({"message":"No user","detail":"no user with that username"})
    }
    res.json({"message":"Authenticated", "username":user.username,"isAdmin":user.isAdmin})
}

const changePassword = async function(req,res){
    const username=req.session.username;
    const password=await bcrypt.hash(req.body.password,null,null,10);
    const newPassword=req.body.newPassword;
   
    const hashed = await bcrypt.hash(newPassword,10);
   
    const user = await User.findOne({where:{username: username}})
    if(user === null){
        return res.json({"message":"No user","detail":"no user with that username"})
    }
    const passwordresult = await bcrypt.compare(password, user.password)
    if(passwordresult){
        req.session.isLoggedIn=null;
        req.session.username=null;
        user.update({"password":hashed})
        generateLog("Ја промени лозинката", req.session.username, user.username)
        return res.send("Se smeni")
    }
    else{
        return res.json({"message":"wrong password","detail":"wrong password"})
    }
}



const register = async function(req,res){

    const username = req.body.username;
    const password = await bcrypt.hash(req.body.password,10);
    const ime = req.body.ime;
    const prezime = req.body.prezime;
    const isAdmin = req.body.isAdmin;
    User.create({
        username,
        password,
        ime,
        prezime,
        isAdmin
    }).then(()=>{
        generateLog("Се креира нова сметка", actedon=req.body.username)
        return res.send("Successfully registered")}).catch(err=>{
      
        console.error( 'Captured validation error: ', err.errors[0]);
        
        return res.json({"code":err.code,"message":err.errors[0].message,"detail":err.errors[0].message});
    })

}

const isAdmin = async function(req, res, next){
    if(req.session.isLoggedIn){
        const user = await User.findOne({where:{username: req.session.username}})
        if(user === null){
            return res.json({"message":"No user","detail":"no user with that username"})
        }

        if(user.isAdmin){
            next();
        }else{
            return res.json({"message":"No permission","detail":"you are not an admin"})
        }

    }else{
        return res.json({"message":"Unauthenticated","detail":"You need to be authenticated to access this"})
    }
}

const resetPassword = async function(req,res){
    const user = await User.findOne({where:{username:req.body.username}})
   
    if(user === null){
        return res.json({"message":"No user","detail":"no user with that username"})
    }
    const hash = await bcrypt.hash("changeme",10);
    user.update({"password":hash})
    return res.json({"message":"success","detail":"password changed"})
}

const authMiddleware = async function(req, res, next){
    if(req.session.isLoggedIn){
        next();
    }else{
        return res.json({"message":"Unauthenticated","detail":"You need to be authenticated to access this"})
    }


}


module.exports={login,register,changePassword,authMiddleware,isAdmin, resetPassword, whoAmI, logout,getUsers}