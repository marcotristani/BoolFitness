const express = require("express");
const app = express();
const port = process.env.PORT;

// importiamo middleware cors
const cors = require("cors");

// import dei router
const productsRouter = require("./routers/productsRouter.js");
const ordersRouter = require("./routers/ordersRouter.js");
const emailRouter = require("./routers/emailRouter.js");
const couponsRouter = require("./routers/couponsRouter.js");

// import del middelware di gestione errore interno 500
const errorsHandler = require("./middlewares/errorsHandler.js");

// import del middelware di gestione di rotta inesistente
const notFound = require("./middlewares/notFound");

// middleware per il CORS
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

// attivazione della cartella public per uso file statici
app.use(express.static("public"));

// registro il body-parser per "application/json"
app.use(express.json());

// rotta home APP
app.get("/api", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

// rotte principali del back-end
app.use("/api/products", productsRouter); //gestione prodotti
app.use("/api/orders", ordersRouter); // gestione ordini
app.use("/api/coupons", couponsRouter);

//gestione rotta email
app.use("/api/email", emailRouter);

// registriamo middelware di gestione rotta inesistente
app.use(notFound);

// registriamo middelware di gestione err 500
app.use(errorsHandler);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
