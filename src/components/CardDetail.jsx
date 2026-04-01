import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";
import RelatedProducts from "./RelatedProducts";

//importo stile
import "../styles/CardDetailStyle.css";

export default function CardDetail({ product }) {
  const { cart, addToCart, decreseFromCart } = useCart();
  const product_cart = cart.find((prod_cart) => product.id === prod_cart.id);
  const quantity_product_cart = product_cart ? product_cart.quantity : 0;
  const [quantity, setQuantity] = useState(quantity_product_cart);
  useEffect(
    () => setQuantity(quantity_product_cart),
    [quantity, quantity_product_cart],
  );
  const addQuantityChange = () => {
    setQuantity((quantity) => quantity + 1);
  };

  const decreseQuantityChange = () => {
    setQuantity((quantity) => quantity - 1);
  };

  console.log(product);

  return (
    <div className="product-page-wrapper">
      <div className="top-nav-bar">
        <Link className="back-link" to="/">
          ← Torna alla Home
        </Link>
      </div>
      {/* ---------------------------------------------------------------- */}
      {/* SEZIONE SUPERIORE - SFONDO NERO */}
      <section className="bg-black bg-gradient text-light py-5">
        <div className="container py-4">
          <div className="row align-items-center g-4">
            {/* IMMAGINE PRINCIPALE */}
            <div className="col-12 col-md-6">
              <img
                src={product.image_url}
                alt={product.name}
                className="img-fluid rounded shadow"
              />
            </div>

            {/* TESTO PRINCIPALE */}
            <div className="col-12 col-md-6">
              <h2 className="fw-bold fs-1 mb-3 text-uppercase">
                {product.name}
              </h2>

              <p className="mb-3 fw-bold">{product.description}</p>

              <p className="mb-0">{product.details}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEZIONE INFERIORE - SFONDO GRIGIO */}
      <section className="bg-dark bg-gradient py-5">
        <div className="container py-4">
          <div className="row align-items-center g-4">
            {/* TESTO DETTAGLI TECNICI */}
            <div className="col-12 col-md-6">
              <h3 className="fw-semibold search-price-homepage mb-3 text-uppercase">
                Dettagli Tecnici
              </h3>

              <ul className="list-unstyled text-light fs-5">
                <li className="mb-2">
                  <strong>Modello:</strong> {product.model}
                </li>
                <li className="mb-2">
                  <strong>Peso:</strong> {product.weight}
                </li>
                <li className="mb-2">
                  <strong>Dimensioni:</strong> {product.dimensions}
                </li>
                <li className="mb-2">
                  <strong>Garanzia:</strong> {product.warranty}
                </li>
              </ul>
            </div>

            {/* IMMAGINE DETTAGLI TECNICI */}
            <div className="col-12 col-md-6">
              <img
                src={product.image_details_url}
                alt={`${product.name} - Dettagli tecnici`}
                className="img-fluid rounded shadow"
              />
            </div>
          </div>
        </div>
      </section>
      {/* ----------------------------------------------------------------- */}
      <RelatedProducts
        category_id={product.category_id}
        product_id={product.id}
      />

      <div className="product-sticky-wrapper my-5 pb-2">
        <div className="container">
          <div className="product-sticky bg-dark text-light p-3 rounded shadow-lg d-flex flex-column flex-md-row align-items-center justify-content-between gap-4">
            {/* BLOCCO SINISTRO: IMMAGINE + INFO */}
            <div className="d-flex align-items-center gap-3 flex-grow-1">
              <img
                src={product.image_url}
                alt={product.name}
                className="rounded shadow-sm"
                style={{ width: "65px", height: "65px", objectFit: "cover" }}
              />

              <div className="d-flex flex-column">
                <span className="fw-bold text-uppercase">{product.name}</span>

                {product.discount_percentage ? (
                  <>
                    <span className="search-price-homepage fw-semibold text-decoration-line-through">
                      {product.price}€
                    </span>
                    <span className="fw-bold fs-5 search-price-homepage">
                      {` ${(product.price - (product.price * product.discount_percentage) / 100).toFixed(2)}€`}
                    </span>
                  </>
                ) : (
                  <span className="text-warning fw-semibold">
                    {product.price}€
                  </span>
                )}
              </div>
            </div>

            {/* BLOCCO DESTRO: QUANTITÀ + PREZZO + CTA */}
            {quantity > 0 ? (
              <div className="d-flex align-items-center gap-3">
                {/* PREZZO TOTALE */}
                <span className="fw-bold fs-4 search-price-homepage mb-0">
                  {(
                    (product.price -
                      (product.price * product.discount_percentage) / 100) *
                    quantity
                  ).toFixed(2)}
                  €
                </span>

                {/* QUANTITÀ */}
                <div className="d-flex align-items-center bg-secondary bg-opacity-25 px-3 py-2 rounded-pill shadow-sm">
                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={() => {
                      decreseFromCart(product);
                      decreseQuantityChange();
                    }}
                    disabled={quantity < 1}
                  >
                    -
                  </button>

                  <span className="mx-3 fw-bold fs-5">{quantity}</span>

                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={() => {
                      addToCart(product);
                      addQuantityChange();
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="search-button w-auto px-4 py-2 mx-auto ms-md-0"
                onClick={() => addToCart(product)}
              >
                Aggiungi al carrello
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
