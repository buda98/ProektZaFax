const Sequelize = require('sequelize');
const db = require("../db.js");

const Firma = require("./firma")
const BroiloStatus = require("./broiloStatus")

const Faktura = db.define('faktura',{
    arhivskiBroj:{
        type:Sequelize.STRING,
        allowNull: false
    },
    mesec:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    godina:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    platena:{
        type:Sequelize.BOOLEAN,
        defaultValue: false
    },
    platenaNaDatum:{
        type:Sequelize.STRING,
    },
    rokZaNaplata:{
        type:Sequelize.STRING
    },
    kamataOdPrethodniFakturi:{
        type:Sequelize.STRING,
        defaultValue:0
    },
    datumNaIzdavanje:{
        type:Sequelize.STRING
    },
    kamataZaKasnenje:{
        type:Sequelize.FLOAT
    },
    dataOd:{
        type:Sequelize.STRING
    },
    dataDo:{
        type:Sequelize.STRING
    },
    elektricnaEnergija:{
        type:Sequelize.FLOAT
    },
    elektricnaEnergijaBezZelena:{
        type:Sequelize.FLOAT
    },
    elektricnaEnergijaNT:{
        type:Sequelize.FLOAT
    },
    elektricnaEnergijaNTBezZelena:{
        type:Sequelize.FLOAT
    },
    elektricnaEnergijaVT:{
        type:Sequelize.FLOAT
    },
    elektricnaEnergijaVTBezZelena:{
        type:Sequelize.FLOAT
    },
    cenaKwhBezDDVNT:{
        type:Sequelize.FLOAT
    },
    cenaKwhBezDDVVT:{
        type:Sequelize.FLOAT
    },
    vkupenIznosBezDDV:{
        type:Sequelize.FLOAT
    },
    obnovlivaEnergija:{
        type:Sequelize.FLOAT
    },
    cenaObnovlivaEnergija:{
        type:Sequelize.FLOAT
    },
    vkupnaObnovlivaEnergijaBezDDV:{
        type:Sequelize.FLOAT
    },
    nadomestZaOrganizacija:{
        type:Sequelize.FLOAT
    },
    nadomestZaOrganizacijaOdKwh:{
        type:Sequelize.FLOAT
    },
    vkupenIznosNaFakturaBezDDV:{
        type:Sequelize.FLOAT
    },
    DDV:{
        type:Sequelize.FLOAT
    },
    vkupnaNaplata:{
        type:Sequelize.FLOAT
    }
})

Firma.hasMany(Faktura)
Faktura.belongsTo(Firma)

Faktura.hasMany(BroiloStatus, {as: "Broilo"})
BroiloStatus.belongsTo(Faktura)


module.exports = Faktura