//importo connsessione DB
const connection = require("./../data/db");

//importo validator per email
const validator = require("validator");

//definisco funzioni CRUD

// show order 1
function show(req, res) {
  //recupero parametro id dell'ordine da req
  const order_id = req.params.order_id;

  //definisco query sql per recuperare i dati dello'ordine
  const sqlCheckForm = `SELECT *
                        FROM orders 
                        WHERE id = ?`;

  //definisco query sql per recuperare i prodotti dell'ordine
  const sqlCheckProducts = `SELECT product_id,name,price,discount_percentage,unit_price,unit_quantity,image,order_id
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
          image_url: `${process.env.APP_URL}/${product.image}`,
        };
      });

      res.json({ products: checkProducts, order: checkForm });
    });
  });
}

//rotta STORE per andare a salvare un nuovo ordine con i dati ricevuti dal from e i prodotti salavati nel carrello front-end
function store(req, res) {
  //recupero tutti i dati inseriti dall'utente nel form
  const {
    customer_first_name,
    customer_last_name,
    customer_city,
    customer_cap,
    customer_email,
    customer_phone,
    customer_address,
    coupon_code,
  } = req.body;

  // //validazione input

  if (req.body.customer_first_name === "" || !req.body.customer_first_name) {
    return res.status(400).json({ error: `Inserire Nome` });
  }

  if (req.body.customer_last_name === "" || !req.body.customer_last_name) {
    return res.status(400).json({ error: `Inserire Cognome` });
  }

  if (req.body.customer_city === "" || !req.body.customer_city) {
    return res.status(400).json({ error: `Inserire Città` });
  }

  if (req.body.customer_cap === "" || !req.body.customer_cap) {
    return res.status(400).json({ error: `Inserire CAP` });
  }

  if (req.body.customer_email === "" || !req.body.customer_email) {
    return res.status(400).json({ error: `Inserire Email` });
  } else if (!validator.isEmail(req.body.customer_email)) {
    return res.status(400).json({ error: "Email non valida" });
  }

  if (req.body.customer_phone === "" || !req.body.customer_phone) {
    return res.status(400).json({ error: `Inserire Telefono` });
  } else if (!validator.isMobilePhone(req.body.customer_phone, "any")) {
    return res.status(400).json({ error: "Numero di telefono non valido" });
  }

  if (req.body.customer_address === "" || !req.body.customer_address) {
    return res.status(400).json({ error: `Inserire Indirizzo` });
  }

  //definisco query da fare al db

  //QUERY PER CARICARE I DATI
  const sqlStoreOreders = `INSERT INTO orders(customer_first_name, customer_last_name, customer_city, customer_cap, customer_email, customer_phone, customer_address, order_date, coupon_percentage, total)
                           VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, 0);`;

  //------------------LOGICA PER VERIFICARE COUPON---------------------------

  //definisco query sql per prendere lista coupon
  const sqlCoupons = `SELECT *
                      FROM coupons`;

  //recuopero data attuale per verificare che nel momento in cui viene inserito il coupon sia valido
  const dataCorrente = new Date();

  //creo oggetto vuoto dove andare a salvare risposte di verifica
  let coupon = {};

  //eseguo prima query al DB per recuperare coupon ed eseguire verifica
  connection.query(sqlCoupons, (err, results) => {
    if (err) return res.status(500).json({ error: "database not found" });

    //se coupon-code non è una stringa vuota allora faccio le verifiche sul coupon, altrimenti mando un messaggio in cui dico coupon non inserito
    if (coupon_code === "") {
      coupon = {
        valid: false,
        message: "coupon non inserito",
        coupon_percentage: undefined,
      };
    } else {
      //recupero l'oggetto del coupon ricercato
      const obj_coupon = results.find((coupon) => coupon.code === coupon_code);

      //verifico se il codice esiste nei coupons e quindi se l'oggetto coupon recuperato col find non sia vuoto
      if (!obj_coupon) {
        //se l'oggetto è vuoto mando messaggio di coupon non valido
        coupon = {
          valid: false,
          message: "coupon non valido",
          coupon_percentage: undefined,
        };
      }
      //se quindi il codice coupon è valido vado avanti con la verifica della data
      //se la data corrente è compresa tra le date di validazione coupon mando oggetto con codice accettato e le varie poprietà
      else if (
        dataCorrente >= obj_coupon.start_date &&
        dataCorrente <= obj_coupon.end_date
      ) {
        coupon = {
          valid: true,
          message: "coupon valido",
          coupon_percentage: parseInt(obj_coupon.coupon_percentage),
        };
      } else {
        coupon = {
          valid: false,
          message: `coupon scaduto in data : ${obj_coupon.end_date.toLocaleDateString()}`,
          coupon_percentage: undefined,
        };
      }
    }

    //eseguo query per andare a caricare i dati nell'ordine con totale nullo perchè ancora non inseriti i prodotti
    connection.query(
      sqlStoreOreders,
      [
        customer_first_name,
        customer_last_name,
        customer_city,
        customer_cap,
        customer_email,
        customer_phone,
        customer_address,
        coupon.coupon_percentage,
      ],
      (err, results) => {
        if (err) return res.status(500).json({ error: err });

        //recupero id del nuovo ordine appena creato
        const new_id = results.insertId;
        //-----------------------LOGICA PER ANDARE A INSERIRE I PRODOTTI-------------------------------
        //STORE per inserire un nuovo prodotto nell'ordine
        //prendo l'array dei prodotti in ingresso
        const { products } = req.body;
        //variabile di verifica quantità
        let verify_quantity = true;
        //eseguo un ciclo sull'array dei prodotti per andare a salvare uno alla volta i prodotti nel DB realitvi all'ordine appena creato
        products.forEach((product, index) => {
          //-----------------RECUPERO DA DB PREZZO E SCONTO DEL PRODOTTO------------------------
          const sqlProduct = `SELECT name, price, discount_percentage
                      FROM products
                      WHERE id = ?`;

          //eseguo query al DB
          connection.query(sqlProduct, [product.product_id], (err, results) => {
            if (product.unit_quantity < 1) {
              verify_quantity = false;
              return res.status(400).json({
                error: `Il prodotto ${results[0].name} ha quantità non valida`,
              });
            }

            //definisco product price come intero per utlizzarlo nelle operazioni di verifica
            const product_price = parseFloat(results[0].price);
            const discount_percentage = parseInt(
              results[0].discount_percentage,
            );

            //definisco il prezzo finale per il singolo prodotto
            let unit_price = product_price;

            //se esiste il valore discount percentage, e quindi il prodotto è in promozione allora definisco il totate scontato
            discount_percentage &&
              (unit_price =
                product_price - product_price * (discount_percentage / 100));

            //definisco sql per andare a crearmi la nuova riga nell'ordine con il nuovo prodotto
            const sqlAddProduct = `INSERT INTO order_product (product_id, order_id, unit_quantity, unit_price)
                VALUES (?, ?, ?, ?)`;

            //eseguo richiesta al DB per andare ad aggiungere il prodotto
            connection.query(
              sqlAddProduct,
              [product.product_id, new_id, product.unit_quantity, unit_price],
              (err, results) => {
                if (err)
                  return res.status(500).json({ error: "database not found" });

                //quando viene inserito l'ultimo prodotto dell'ordine allora vado a calcolarmi il totale
                if (index === products.length - 1 && verify_quantity) {
                  //-------------------------LOGICA PER ESTRAPOLARE TOTALE---------------------------
                  //definisco query sql per ottenere la somma dell'ordine ricercato
                  const sqlTotal = `SELECT SUM(unit_quantity* unit_price) AS total_sum
                    FROM order_product
                    WHERE order_id = ?`;

                  //eseguo query al DB per ottenere la somma relativo all'ordine
                  connection.query(sqlTotal, [new_id], (err, results) => {
                    if (err) return res.status(500).json({ error: err });

                    //recupero questo valore di somma da risposta DB
                    const total_sum = parseFloat(results[0].total_sum);

                    //creo variabile totale da andare a caricare come ordine totale, inizializzo come totale somma dei prodotti ricavata dal DB
                    let total_order = total_sum;

                    //se esiste il valore coupon percentage, e quindi precedentemente è stato inserito un coupon valido allora definisco il totate scontato
                    coupon.coupon_percentage &&
                      (total_order =
                        total_sum -
                        total_sum * (coupon.coupon_percentage / 100));

                    //----------------------------LOGICA PER AGGIUNGERE TOTALE ALL'ORDINE----------------------------------------------------
                    //definisco sql per aggiungere il totale dell'ordine all'ordine in questione
                    const sqlAddTotal = `UPDATE orders
                                             SET total = ?
                                             WHERE id = ?`;

                    //eseguo query al DB per ottenere la somma relativo all'ordine
                    connection.query(
                      sqlAddTotal,
                      [total_order, new_id],
                      (err, results) => {
                        if (err) return res.status(500).json({ error: err });
                        //ora che ho aggiunto tutti i dati nell'ordine posso forzare lo stato della chiamata e rispondere con un oggetto
                        //con le informazioni che servono per elaborare i dati nel FE
                        res.status(201).json({
                          new_id: new_id,
                          coupon_valid: coupon.valid,
                          message_coupon: coupon.message,
                          discount_coupon: coupon.coupon_percentage,
                          total_order: Number(total_sum.toFixed(2)),
                          total_order_discount: Number(total_order.toFixed(2)),
                        });
                      },
                    );
                  });
                }
              },
            );
          });
        });
      },
    );
  });
}

module.exports = { show, store };
