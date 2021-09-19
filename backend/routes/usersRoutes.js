const express = require("express");
const app = express();
const user = require("../controllers/usersController.js")
const auth = require("../controllers/authController.js")

//192.168.0.29:5000/user/*


//TODO: authentication

app.post("/dodadiUser",auth.authMiddleware,user.dodadiUser)
app.post("/promeniUser", auth.authMiddleware, user.promeniUser)
app.post("/izbrisiUser", auth.authMiddleware, user.izbrisiUser)
module.exports = app;