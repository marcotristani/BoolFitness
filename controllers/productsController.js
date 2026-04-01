//importo connsessione DB
const connection = require("./../data/db");

//-------definisco funzioni CRUD--------

// index
function index(req, res) {
  //recuper valore chiave order per vedere ordinamento
  const order = req.query.order;
  //recupero valore discount per selezionare solo i prodotti che hanno un discount
  const discount = req.query.discount;

  //dichiaro variabile che andrà a costituirmi la query di ordinamento nella richiesta DB
  let orderBy = "weight";

  //valuto questo valore
  order === "more_price" && (orderBy = "price DESC");
  order === "less_price" && (orderBy = "price");
  order === "latest_arrivals" && (orderBy = "created_date DESC");
  order === "first_arrivals" && (orderBy = "created_date");
  order === "name" && (orderBy = "name");

  //definisco ifDiscount
  //verifico se definita nell'endpoint la key discount per andare a recuperare dal DB solo prodotti in discount
  let ifDiscount = "";
  if (discount)
    //se è uguale a true applico discount altrimenti qualsiasi altro vlore non lo accetto
    discount === "true" && (ifDiscount = "WHERE discount_percentage");

  //definisco query sql
  const sql = `SELECT *
                 FROM products
                 ${ifDiscount}
                 ORDER BY ${orderBy}`;

  //eseguo richiesta al DB
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "database not found" });

    //inizializzo array filtrato come tutto results
    let filteredSearched = results;
    //se esiste un valore di query per searched allore eseguo logica filtraggio
    if (req.query.searched) {
      //recupero valore searched per filtrare i prodotti in base al nome e lo normalizzo
      const searched = req.query.searched.toLowerCase();
      //verifico se il searched arrivato è incluso nel nome del prodotto
      filteredSearched = results.filter((result) => {
        //normalizzo i valori da confrontare
        const normalName = result.name.toLowerCase();

        return normalName.includes(searched);
      });
    }

    res.json(
      filteredSearched.map((product) => {
        return {
          ...product,
          image_url: `${process.env.APP_URL}/${product.image}`,
          image_details_url: `${process.env.APP_URL}/${product.image_details}`,
        };
      }),
    );
  });
}

// show
function show(req, res) {
  const { slug } = req.params;

  const productSql = "SELECT * FROM products WHERE slug = ?";

  // chiamata a DB principale per recuperare il prodotto
  connection.query(productSql, [slug], (err, productResults) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    if (productResults.length === 0)
      return res.status(404).json({ error: "Product not found" });

    // salviamo il risultato in una cost
    const product = productResults[0];

    // aggiunta url alle immagini
    product.image_url = `${process.env.APP_URL}/${product.image}`;
    product.image_details_url = `${process.env.APP_URL}/${product.image_details}`;

    res.json(product);
  });
}

module.exports = { index, show };
