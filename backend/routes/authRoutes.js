const express = require("express");
const app = express();
const auth = require("../controllers/authController.js")


//192.168.0.29:5000/auth/*
app.post("/changePassword",auth.authMiddleware,auth.changePassword)
app.post("/register",auth.register);
app.post("/login",auth.login)
app.post("/logout",auth.logout)
app.post("/whoami",auth.authMiddleware,auth.whoAmI)
app.post("/getUsers",auth.authMiddleware,auth.getUsers)
app.post("/admin",auth.isAdmin, (req,res)=>{
    res.json({"asd":"asd"})
})
app.post("/resetPassword",auth.isAdmin,auth.resetPassword)


module.exports = app;