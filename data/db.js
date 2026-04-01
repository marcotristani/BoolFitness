const mysql = require("mysql2");

//connetto il DB
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

//verifico da console connessione al DB
connection.connect((err) => {
  if (err) throw err;
  console.log("Connesso al mio DB");
});

module.exports = connection;
