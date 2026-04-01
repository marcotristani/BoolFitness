const express = require("express");
const emailRouter = express.Router();

const emailController = require("./../controllers/emailController");

//--------------------DEFINIZIONE ROTTE---------------------

//rotta di index
emailRouter.get("/:order_id", emailController.store);

module.exports = emailRouter;
