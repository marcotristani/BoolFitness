//importo connsessione DB
const connection = require("./../data/db");

// show
function show(req, res) {
  const { code } = req.params;

  //recuopero data attuale per verificare che nel momento in cui viene inserito il coupon sia valido
  const dataCorrente = new Date();

  const couponSql = "SELECT * FROM coupons WHERE code = ?";

  // chiamata a DB principale per recuperare il prodotto
  connection.query(couponSql, [code], (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    if (results.length === 0) {
      return res.json({
        valid: false,
        message: "coupon non valido",
        coupon_percentage: undefined,
      });
    } else if (
      dataCorrente >= results[0].start_date &&
      dataCorrente <= results[0].end_date
    ) {
      return res.json({
        valid: true,
        message: "coupon valido",
        coupon_percentage: parseInt(results[0].coupon_percentage),
      });
    } else {
      return res.json({
        valid: false,
        message: `coupon scaduto in data : ${results[0].end_date.toLocaleDateString()}`,
        coupon_percentage: undefined,
      });
    }
  });
}
module.exports = { show };
