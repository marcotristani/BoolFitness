const nodemailer = require("nodemailer");
const connection = require("./../data/db");

//definisco il trasporter con i dati del servizio che manderà l'email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASS,
  },
});

function store(req, res) {
  //recupero parametro id dell'ordine da req
  const order_id = req.params.order_id;

  //definisco query sql per recuperare i dati dello'ordine
  const sqlCheckForm = `SELECT *
                        FROM orders 
                        WHERE id = ?`;

  //definisco query sql per recuperare i prodotti dell'ordine
  const sqlCheckProducts = `SELECT product_id,name,price,discount_percentage,unit_price,unit_quantity
                            FROM order_product
                            JOIN products ON order_product.product_id = products.id
                            WHERE order_id = ?`;

  // chiamata a DB per recuperare dati utente, sconto coupon e costo totale carrello scontato
  connection.query(sqlCheckForm, [order_id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    if (results.length === 0)
      return res.status(404).json({ error: "Order not found" });

    // salviamo il risultato in una cost
    const checkForm = results[0];

    //faccio chiamata per recuperare lista prodotti nell'ordine
    connection.query(sqlCheckProducts, [order_id], (err, results) => {
      if (err) return res.status(500).json({ error: "Database query failed" });
      if (results.length === 0)
        return res.status(404).json({ error: "Order not found" });

      // salviamo il risultato in una cost e aggiungiamo image_url
      const checkProducts = results.map((product) => {
        return {
          ...product,
        };
      });

      //definisco testo email
      const productList = checkProducts.map(
        (product) =>
          `
    • ${product.name} – Quantità: ${product.unit_quantity} – Prezzo: € ${product.unit_price}`,
      );

      const emailTextCustomer = `
Ciao ${checkForm.customer_first_name} ${checkForm.customer_last_name},
grazie per aver scelto i nostri prodotti! Il tuo ordine N.${checkForm.id} è stato ricevuto e ora è in fase di elaborazione.

🛒 Dettagli dell'ordine
${productList}

💸 Riepilogo costi
${checkForm.coupon_percentage ? `Sconto applicato con il coupon : ${checkForm.coupon_percentage}` : "Nessun coupon sconto inserito"}
Totale: € ${checkForm.total}

Riceverai un aggiornamento non appena il tuo ordine verrà spedito.
A presto,
Il team
`;

      const emailTextSalesperson = `
Nuovo ordine ricevuto!

🧾 Dettagli ordine
ID Ordine: ${checkForm.id}
Cliente: ${checkForm.customer_first_name} ${checkForm.customer_last_name}
Email cliente: ${checkForm.customer_email}

🛒 Prodotti venduti
${productList}

💸 Riepilogo costi
${
  checkForm.coupon_percentage
    ? `Sconto applicato (${checkForm.coupon_percentage})`
    : "Nessun coupon sconto applicato"
}
Totale ordine: € ${checkForm.total}

📦 L'ordine è ora in fase di elaborazione.
`;

      const subject = `Conferma ordine N ${checkForm.id}`;
      //definisco  dati dell'email del consumatore
      const mailCustomer = {
        from: process.env.EMAIL_SENDER,
        to: checkForm.customer_email,
        subject: subject,
        text: emailTextCustomer,
      };

      //definisco i dati dell'email del venditore
      const mailSalesperson = {
        from: process.env.EMAIL_SENDER,
        to: process.env.EMAIL_SALESPERSON,
        subject: subject,
        text: emailTextSalesperson,
      };

      let isError = false;
      //mando la prima mail al cliente
      transporter.sendMail(mailCustomer, (error, info) => {
        if (error) {
          isError = true;
          return res.status(500).json({ error: "Errore nell'invio email" });
        }
      });
      //aspetto 10 secondi e mando l'email al venditore

      setTimeout(() => {
        if (!isError) {
          transporter.sendMail(mailSalesperson, (error2, info2) => {
            if (error2) {
              console.log("Errore:", error2);
              return res
                .status(500)
                .json({ error: "Errore nell'invio email", message: error2 });
            }

            res.json({ message: "Inviate entrambe email con successo" });
          });
        }
      }, 15000);
    });
  });
}

module.exports = { store };
