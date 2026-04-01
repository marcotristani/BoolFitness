const express = require("express");
const couponsRouter = express.Router();

const couponsController = require("./../controllers/couponsController");

//--------------------DEFINIZIONE ROTTE---------------------

//rotta di index
couponsRouter.get("/:code", couponsController.show);

module.exports = couponsRouter;
