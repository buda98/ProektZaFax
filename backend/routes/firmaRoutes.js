const express = require("express");
const app = express();
const firma = require("../controllers/firmaController.js")
const auth = require("../controllers/authController.js")

//172.21.0.3:5000/firmi/*

//TODO: authentication
app.post("/dodadiFirma",auth.authMiddleware,firma.dodadiFirma)
app.post("/promeniFirma", auth.authMiddleware, firma.promeniFirma)
app.post("/zemiFirmi", auth.authMiddleware, firma.zemiFirmi)
app.post("/izbrisiFirma", auth.authMiddleware, firma.izbrisiFirma)
app.post("/zemiBroilaNaFirma", auth.authMiddleware, firma.zemiBroilaNaFirma)
module.exports = app;