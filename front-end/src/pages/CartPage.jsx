import { useCart } from "../contexts/CartContext";
import { useApi } from "../contexts/ApiProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";

function CartPage() {
  const { cart, removeFromCart, addToCart, decreseFromCart, clearCart } =
    useCart();
  const { products } = useApi();
  const emptyCart = cart.length === 0;

  const total = cart
    .reduce(
      (acc, item) =>
        acc +
        (item.price - (item.price * item.discount_percentage) / 100) *
          item.quantity,
      0,
    )
    .toFixed(2);

  // scroll to top quando il prodotto viene caricato
  useEffect(() => {
    if (cart.length > 0) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="container">
      <div className="d-flex p-5">
        <Link className="back-link" to="/">
          <FontAwesomeIcon icon={faArrowLeft} />
          Torna alla Home
        </Link>
      </div>
      <div className="d-flex justify-content-between">
        <h1>Riepilogo Carrello</h1>
        {cart.length != 0 && (
          <Link>
            <button
              className="search-button w-auto mb-4"
              onClick={
                () => {
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
                }

                //   () => {
                //   if (
                //     window.confirm(
                //       "Sei sicuro di voler svuotare il tuo carrello?",
                //     )
                //   ) {
                //     clearCart();
                //   }
                // }
              }
            >
              Svuota Carrello
            </button>
          </Link>
        )}
      </div>
      {cart.length === 0 && <p>Il carrello è vuoto</p>}
      {cart.map((item) => {
        // trova il prodotto completo dal backend
        const product = products.find((p) => p.id === item.id);
        console.log(item);

        return (
          <div className="col-12 col-md-10 mx-auto mb-3" key={item.id}>
            <div className="card shadow-sm rounded-3">
              <div className="row g-0 align-items-center p-3">
                {/* imgs */}

                <div className="col-4 col-md-2 text-center">
                  {product?.image_url && (
                    <Link to={`/products/${item.slug}`}>
                      <img
                        src={product.image_url}
                        alt={item.name}
                        className="img-fluid rounded"
                        style={{ maxHeight: "100px", objectFit: "contain" }}
                      />
                    </Link>
                  )}
                </div>

                {/* info product */}
                <div className="col-8 col-md-4 ">
                  <Link to={`/products/${item.slug}`}>
                    <h5 className="mb-1 text-black">{item.name}</h5>
                    {product?.description && (
                      <p className="mb-0 text-muted small">
                        {product.description}
                      </p>
                    )}
                    {item.discount_percentage && (
                      <span className="discounted-badge">
                        {`${item.discount_percentage} %`}
                      </span>
                    )}
                  </Link>
                </div>

                {/* quantity */}
                <div className="col-4 col-md-1 d-flex align-items-center mt-2 mt-md-0">
                  <button
                    className="btn btn-outline-secondary btn-sm me-2"
                    onClick={() => decreseFromCart(item)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="btn btn-outline-secondary btn-sm ms-2"
                    onClick={() => addToCart(item)}
                  >
                    +
                  </button>
                </div>

                {/* price */}
                <div className="col-4 col-md-2 text-md-end mt-2 mt-md-0">
                  {item.discount_percentage ? (
                    <>
                      <div>
                        <small className="text-muted text-decoration-line-through">
                          ({item.price}€/pz)
                        </small>
                      </div>
                      <small className="text-muted ">
                        (
                        {(
                          item.price -
                          (item.price * item.discount_percentage) / 100
                        ).toFixed(2)}
                        €/pz)
                      </small>
                    </>
                  ) : (
                    <div>
                      <small className="text-muted ">({item.price}€/pz)</small>
                    </div>
                  )}
                </div>
                <div className="col-4 col-md-2 text-end mt-2 mt-md-0 fw-bold">
                  {(
                    (item.price -
                      (item.price * item.discount_percentage) / 100) *
                    item.quantity
                  ).toFixed(2)}
                  €
                </div>

                {/* trash */}
                <div className="col-12 col-md-1 text-end mt-2 mt-md-0">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} color="white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {!emptyCart && (
        <div className="col-12 col-md-10 mx-auto mb-3">
          <div className="d-flex align-items-center justify-content-end mt-2 ">
            <span className="fs-3 fw-bold">Totale:</span>
            <span className="ms-2 fw-bold fs-4 search-price">{total} €</span>
          </div>
          <Link to={"/checkout"}>
            <button className="search-button mb-4">Vai al checkout</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default CartPage;
