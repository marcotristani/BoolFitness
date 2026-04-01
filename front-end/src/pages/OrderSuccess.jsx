import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./../styles/OrderSuccess.css";

const endpoint = import.meta.env.VITE_APP_URL;
function OrderSuccess() {
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const new_id = location.state;

  // Se non arriva l'ID → NON AUTORIZZATO
  if (!new_id) {
    return (
      <>
        <div className="top-nav-bar">
          <Link className="back-link" to="/">
            ← Torna alla Home
          </Link>
        </div>
        <div className="container d-flex justify-content-center align-products-center py-5">
          <div className="bg-white border rounded-3 shadow-sm p-4 p-md-5 unauthorized">
            <h1 className="h3 mb-3 text-success text-uppercase fw-semibold">
              NON AUTORIZZATO
            </h1>
            <Link to="/">
              <button className="search-button mb-3">Vai allo shopping</button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  function fetchOrder() {
    setIsLoading(true);

    axios
      .get(`${endpoint}api/orders/${new_id}`)
      .then((res) => {
        setOrderData(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(fetchOrder, []);

  //scroll to top quando i dati dell'ordine arrivano
  useEffect(() => {
    if (orderData) {
      window.scrollTo(0, 0);
    }
  }, [orderData]);

  // Loader
  if (isLoading || !orderData) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success"></div>
      </div>
    );
  }

  const { products, order } = orderData;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="top-nav-bar">
          <Link className="back-link" to="/">
            ← Torna alla Home
          </Link>
        </div>

        <div className="col-12 col-md-10 col-lg-7">
          <div className="bg-white border rounded-3 shadow-sm p-4 p-md-5">
            <h1 className="h4 mb-4 text-success text-uppercase fw-semibold text-center">
              Grazie per il tuo ordine!
            </h1>

            <h2 className="h6 fw-semibold mb-3">Riepilogo prodotti</h2>

            <div className="list-group mb-4">
              {products.map((product) => (
                <div
                  key={product.product_id}
                  className="list-group-product border-0 border-bottom py-3 px-0"
                >
                  <div className="d-flex align-products-center gap-3 ">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="rounded product-img "
                    />

                    <div className="flex-grow-1">
                      <div className="fw-semibold">{product.name}</div>
                      <div className="text-muted small">
                        Quantità: {product.unit_quantity}
                      </div>
                      {product.discount_percentage && (
                        <div className="text-success small fw-medium">
                          -{product.discount_percentage}% di sconto
                        </div>
                      )}
                    </div>

                    <div className="text-end">
                      <div className="fw-semibold">
                        € {Number(product.unit_price).toFixed(2)}
                      </div>
                      {product.discount_percentage && (
                        <div className="text-muted small text-decoration-line-through">
                          € {Number(product.price).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="h6 fw-semibold mb-3">Dati del cliente</h2>

            <div className="bg-light rounded-3 p-3 mb-4">
              <div className="mb-2">
                <span className="fw-medium">Nome:</span>
                <span className="ms-2 text-muted">
                  {order.customer_first_name} {order.customer_last_name}
                </span>
              </div>

              <div className="mb-2">
                <span className="fw-medium">Email:</span>
                <span className="ms-2 text-muted">{order.customer_email}</span>
              </div>

              <div className="mb-2">
                <span className="fw-medium">Telefono:</span>
                <span className="ms-2 text-muted">{order.customer_phone}</span>
              </div>

              <div className="mb-2">
                <span className="fw-medium">Indirizzo di fatturazione:</span>
                <span className="ms-2 text-muted">
                  {order.customer_address}
                </span>
              </div>

              <div className="mb-2">
                <span className="fw-medium">Città:</span>
                <span className="ms-2 text-muted">
                  {order.customer_city} ({order.customer_cap})
                </span>
              </div>

              <div>
                <span className="fw-medium">Data ordine:</span>
                <span className="ms-2 text-muted">
                  {new Date(order.order_date).toLocaleDateString()}
                </span>
              </div>
            </div>

            {order.coupon_percentage && (
              <div className="p-3 bg-light rounded-3 mb-4">
                <h2 className="h6 fw-semibold mb-2">Coupon applicato</h2>
                <div className="d-flex justify-content-between">
                  <span className="fw-medium">Sconto coupon</span>
                  <span className="text-success fw-semibold">
                    -{order.coupon_percentage}%
                  </span>
                </div>
              </div>
            )}

            <div className="border-top pt-3">
              <div className="d-flex justify-content-between mb-1">
                <span className="fw-medium">Totale ordine</span>
                <span className="fw-bold fs-5">
                  € {Number(order.total).toFixed(2)}
                </span>
              </div>
            </div>

            <p className="text-center text-muted mt-4 mb-0">
              Riceverai un'email con tutti i dettagli dell’ordine.
            </p>
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
        <Link to="/">
          <button className="search-button mb-3">Torna allo shopping</button>
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccess;
