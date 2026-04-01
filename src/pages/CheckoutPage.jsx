import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import FormCheckout from "../components/FormCheckout";
import CartPreview from "../components/CartPreview";
import axios from "axios";
import "../styles/CheckoutPageStyle.css";
import Swal from "sweetalert2";

const shippingBase = Number(import.meta.env.VITE_SHIPPING_COST);
const endpointBase = import.meta.env.VITE_APP_URL;
const shippingthreshold = Number(import.meta.env.VITE_SHIPPING_THRESHOLD);

function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  // Coupon state
  const [couponCheckBox, setCouponCheckBox] = useState(true);
  const [couponInput, setCouponInput] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponStatus, setCouponStatus] = useState("none");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  const subtotal = cart.reduce(
    (acc, item) =>
      acc +
      (item.price - (item.price * item.discount_percentage) / 100) *
        item.quantity,
    0,
  );

  const discountedTotal =
    couponStatus === "valid"
      ? subtotal * (1 - discountPercentage / 100)
      : subtotal;

  const shippingCost = discountedTotal > shippingthreshold ? 0 : shippingBase;

  const finalTotal = (discountedTotal + shippingCost).toFixed(2);

  const couponValidator = (e) => {
    e.preventDefault();

    const endpoint = `${endpointBase}api/coupons/${couponInput}`;

    axios
      .get(endpoint)
      .then((res) => {
        if (res.data.valid) {
          setCouponStatus("valid");
          setDiscountPercentage(res.data.coupon_percentage);
          setCouponMessage(res.data.message);
          setCouponCode(couponInput);
        } else {
          setCouponStatus("invalid");
          setCouponMessage(res.data.message);
        }

        setCouponInput("");
      })
      .catch(() => {
        setCouponStatus("invalid");
        setCouponMessage("Errore durante la verifica del coupon.");
      });
  };

  // scroll to top quando il prodotto viene caricato
  useEffect(() => {
    if (cart.length > 0) {
      window.scrollTo(0, 0);
    }
  }, []);

  if (cart.length === 0) {
    return (
      <div className="container d-flex justify-content-center align-items-center container-order-success">
        <div
          className="bg-white border rounded-3 shadow-sm p-4 p-md-5"
          style={{ maxWidth: "900px", width: "100%" }}
        >
          <h1 className="h3 mb-3 text-success text-uppercase fw-semibold">
            INSERISCI PRODOTTI NEL CARRELLO PRIMA DI ACCEDERE AL CHECKOUT
          </h1>
          <Link to="/" className="search-button mb-3 text-black fw-semibold">
            Torna alla Home
          </Link>
        </div>
      </div>
    );
  }

  const renderCouponUI = () => {
    if (!couponCheckBox) return null;

    if (couponStatus === "none") {
      return (
        <div className="col-12 mb-5">
          <form onSubmit={couponValidator}>
            <input
              type="text"
              className="form-control form-control-lg"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="INSERISCI COUPON"
            />
            <button className="search-button mt-2" type="submit">
              Verifica
            </button>
          </form>
        </div>
      );
    }

    const isValid = couponStatus === "valid";
    const bg = isValid ? "bg-success" : "bg-danger";

    return (
      <div className="col-12 mb-3">
        <div className={`p-3 ${bg} bg-gradient text-white rounded-3`}>
          <h2 className="h5 text-center mb-3 fw-semibold">
            {couponMessage}
            {isValid && (
              <span className=" fw-bolder px-3">- {discountPercentage} %</span>
            )}
          </h2>

          <div className="text-center">
            <button
              className="search-button w-auto fw-semibold px-4 py-2"
              onClick={() => setCouponStatus("none")}
            >
              Cambia Coupon
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="top-nav-bar">
        <Link className="back-link" to="/">
          ← Ritorna alla Home
        </Link>
      </div>

      <div className="row g-4">
        <div className="col-12 col-xxl-6">
          <div className="cart-wrapper shadow-sm p-3 rounded">
            <CartPreview />

            <div className="cart-footer">
              <div className="form-check mt-2 ms-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={couponCheckBox}
                  onChange={() => {
                    setCouponCheckBox(!couponCheckBox);
                    setCouponStatus("none");
                  }}
                />
                <label className="form-check-label">
                  Inserisci un codice sconto
                </label>
              </div>

              {renderCouponUI()}

              <p className="fw-medium">
                Costo spedizione:
                <span className="search-price"> {shippingCost} €</span>
              </p>

              <div className="totals-wrapper mt-3">
                {/* Totale originale sbarrato (solo se coupon valido) */}
                {couponStatus === "valid" && (
                  <div className="d-flex align-items-center">
                    <span className="fw-semibold">Totale originale:</span>
                    <span className="ms-2 fs-5 text-decoration-line-through search-price">
                      {subtotal.toFixed(2)} €
                    </span>
                    <span className="text-danger fw-bolder px-3">
                      -{discountPercentage} %
                    </span>
                  </div>
                )}

                {couponStatus === "valid" && (
                  <div className="d-flex align-items-center">
                    <span className="fw-semibold">
                      Totale scontato (senza spedizione):
                    </span>
                    <span className="ms-2 fs-5 search-price">
                      {discountedTotal.toFixed(2)} €
                    </span>
                  </div>
                )}

                <div className="d-flex align-items-center mt-2">
                  <span className="fs-3 fw-bold">Totale finale:</span>
                  <span className="ms-2 fw-bold fs-4 search-price">
                    {finalTotal} €
                  </span>
                </div>
              </div>

              <button
                className="search-button mt-3"
                onClick={() => {
                  Swal.fire({
                    title: "ATTENZIONE",
                    text: "Sei sicuro di voler svuotare il tuo carrello?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Conferma",
                    cancelButtonText: "Annulla",
                    confirmButtonColor: "#F09226",
                    cancelButtonColor: "rgb(251, 3, 3)",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      clearCart();
                      // QUI fai l'azione di conferma
                      console.log("Confermato!");
                    }
                  });
                }}
              >
                Svuota Carrello
              </button>
            </div>
          </div>
        </div>

        <div className="col-12 col-xxl-6 mb-5">
          <div className="shadow-sm p-3 rounded bg-white">
            <FormCheckout coupon_code={couponCode} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
