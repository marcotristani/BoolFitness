import { useCart } from "../contexts/CartContext";
import { useApi } from "../contexts/ApiProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function CartPreview() {
  const { cart, removeFromCart, addToCart, decreseFromCart } = useCart();
  const { products } = useApi();

  const total = cart
    .reduce(
      (acc, item) =>
        acc +
        (item.price - (item.price * item.discount_percentage) / 100) *
          item.quantity,
      0,
    )
    .toFixed(2);

  return (
    <div className="cart-preview-container">
      {cart.length === 0 && <h1>Il carrello è vuoto</h1>}

      <div className="cart-items-scroll">
        {cart.map((item) => {
          const product = products.find((p) => p.id === item.id);

          return (
            <div className="col-12 col-md-10 mx-auto mb-3" key={item.id}>
              <div className="card shadow-sm rounded-3">
                <div className="row g-0 align-items-center p-3">
                  <div className="col-4 col-md-2 text-center">
                    {product?.image_url && (
                      <Link to={`/products/${item.slug}`}>
                        <img
                          src={product.image_url}
                          alt={item.name}
                          className="img-fluid rounded"
                          style={{ maxHeight: "50px", objectFit: "contain" }}
                        />
                      </Link>
                    )}
                  </div>
                  <div className="col-8 col-md-4 ">
                    <Link to={`/products/${item.slug}`}>
                      <h5 className="mb-1 text-black">{item.name}</h5>

                      {item.discount_percentage && (
                        <span className="text-danger fw-bolder">
                          {`- ${item.discount_percentage} %`}
                        </span>
                      )}
                    </Link>
                  </div>

                  <div className="col-12 col-md-6 mt-3 mt-md-0">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center w-100 gap-2">
                      {/* quantity */}
                      <div className="d-flex align-items-center ">
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

                      {/* price + trash */}
                      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center text-start text-md-end gap-2">
                        {/* price */}
                        <div>
                          <span className="d-block fw-bold">
                            {(
                              (item.price -
                                (item.price * item.discount_percentage) / 100) *
                              item.quantity
                            ).toFixed(2)}
                            €
                          </span>

                          {item.discount_percentage ? (
                            <small className="text-muted fs-6">
                              (
                              {(
                                item.price -
                                (item.price * item.discount_percentage) / 100
                              ).toFixed(2)}
                              €/pz)
                            </small>
                          ) : (
                            <div>
                              <small className="text-muted fs-6">
                                ({item.price}€/pz)
                              </small>
                            </div>
                          )}
                        </div>

                        {/* trash */}
                        <button
                          className="btn btn-danger btn-sm align-self-start align-self-md-end"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} color="white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CartPreview;
