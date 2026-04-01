const express = require("express");
const router = express.Router();

//-----------------Import e destrutturazione di productsController----------
const productsController = require("./../controllers/productsController");
const { index, show } = productsController;

//--------------------DEFINIZIONE ROTTE---------------------

//rotta di index
router.get("/", index);

//rotta di show
router.get("/:slug", show);

module.exports = router;
