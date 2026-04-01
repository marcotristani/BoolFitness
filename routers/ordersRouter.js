const express = require("express");
const ordersRouter = express.Router();

//------------------------------------IMPORTO CONTROLLER----------------------
const ordersController = require("./../controllers/ordersController");
//-------------------------------------DEFINIZIONE ROTTE----------------------

//rotta index
ordersRouter.get("/:order_id", ordersController.show);

ordersRouter.post("/", ordersController.store);

module.exports = ordersRouter;

//prova2
// const express = require("express");
// const router = express.Router();

// //------------------------------------IMPORTO CONTROLLER e destrutturazione----------------------
// const ordersController2 = require("./../controllers/ordersController2");
// const { show, create } = ordersController2;

// //-------------------------------------DEFINIZIONE ROTTE----------------------
// router.post("/", create);
// router.get("/:id", show);

// module.exports = router;
