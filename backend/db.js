const Sequelize = require('sequelize');

module.exports =  new Sequelize("postgres://backend:backend@test_db:5432/proekt", {
  host: 'test_db',
  dialect: 'postgres',
  operatorsAliases: 0,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});