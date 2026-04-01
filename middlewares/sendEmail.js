const nodemailer = require("nodemailer");

//definisco il trasporter con i dati del servizio che manderà l'email
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASS,
  },
});

//STORE per generare email con rotta post
function store(order) {
  //recupero informazioni da body
  const { email_customer, subject, text } = req.body;

  //definisco  dati dell'email del consumatore
  const mailCustomer = {
    from: process.env.EMAIL_SENDER,
    to: email_customer,
    subject: subject,
    text: text,
  };

  //definisco i dati dell'email del venditore
  const mailSalesperson = {
    from: process.env.EMAIL_SENDER,
    to: process.env.EMAIL_SALESPERSON,
    subject: "invio a venditore",
    text: "lorem sjas nda nsdn abds absd sand sand asond prova 2",
  };

  //mando la prima mail al cliente
  transporter.sendMail(mailCustomer, (error, info) => {
    if (error) {
      console.log("Errore:", error);
      return res.status(500).json({ error: "Errore nell'invio email" });
    }
  });

  //aspetto 10 secondi e mando l'email al venditore
  setTimeout(() => {
    transporter.sendMail(mailSalesperson, (error2, info2) => {
      if (error2) {
        console.log("Errore:", error2);
        return res
          .status(500)
          .json({ error: "Errore nell'invio email", message: error2 });
      }

      res.json({ message: "Inviate entrambe email con successo" });
    });
  }, 10000);
}

module.exports = { store };
