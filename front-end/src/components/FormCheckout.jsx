import { useEffect, useState } from "react";
import axios from "axios";
//importo context
import { useApi } from "../contexts/ApiProvider";
//richiamo il contesto del carrello
import { useCart } from "../contexts/CartContext";

//importo navigate per poi passare nella pagina di messaggio
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

const endpointBase = import.meta.env.VITE_APP_URL;

function FormCheckout({ coupon_code }) {
  // attivo l'utilizzo del loader dal context principale
  const { setIsLoading } = useApi();

  const navigate = useNavigate();

  //prendo cart dal contesto del carrello
  const { cart, clearCart } = useCart();

  //creo array di oggetti dei prodotti che devo mandare al DB
  const products = cart.map((product) => ({
    product_id: product.id,
    unit_quantity: product.quantity,
  }));

  const initialFormDataCustomer = {
    customer_first_name: "",
    customer_last_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
    customer_city: "",
    customer_cap: "",
    customer_address_shipping: "",
  };
  const [formDataCustomer, setFormDataCustomer] = useState(
    initialFormDataCustomer,
  );

  //var di stato globale per gestire indirizzo di fatturazione/spedizione
  const [sameAddress, setSameAddress] = useState(true);
  useEffect(() => {
    if (sameAddress) {
      // copia automaticamente l’indirizzo di spedizione
      setFormDataCustomer((formdata) => ({
        ...formdata,
        customer_address: formdata.customer_address_shipping,
      }));
    } else {
      // resetta il campo fatturazione quando diventa visibile
      setFormDataCustomer((formdata) => ({
        ...formdata,
        customer_address: "",
      }));
    }
  }, [sameAddress]);

  const handleChange = (e) => {
    setFormDataCustomer({
      ...formDataCustomer,
      [e.target.id]: e.target.value,
    });
  };

  const endpoint = `${endpointBase}api/orders/`;
  const handleSubmit = (e) => {
    e.preventDefault();

    //attivo loader
    setIsLoading(true);

    //creo oggetto finale da mandare come post
    const finalObj = {
      ...formDataCustomer,
      customer_address: sameAddress
        ? formDataCustomer.customer_address_shipping
        : formDataCustomer.customer_address,
      coupon_code: coupon_code,
      products: products,
    };

    let new_id;
    axios
      .post(endpoint, finalObj, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        // svuota campi form (e var di stato)
        setFormDataCustomer(initialFormDataCustomer);
        clearCart();
        new_id = res.data.new_id;
        navigate("/order_success", { state: new_id });
      })
      .catch((err) => {
        //console.log(err);
        if (err.status === 400)
          Swal.fire({
            title: "Errore",
            text: err.response?.data?.error,
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#F09226",
          });

        // window.alert(err.response.data.error);
        if (err.status === 500) navigate("/500_error_internal_server");
      })
      .finally(() => {
        setIsLoading(false);
        //togliere commento per invio email
        axios
          .get(`${endpointBase}api/email/${new_id}`)

          .catch((err) => {
            //console.log(err);
            if (err.status === 500) {
              // window.alert(err.response.data.error);
              // navigate("/500_error_internal_server");
            }
          })
          .finally(console.log(new_id));
      });
  };

  return (
    <form
      className="container p-4 bg-white border rounded-3 shadow-sm my-5"
      onSubmit={handleSubmit}
    >
      <h3 className="mb-4 text-uppercase fw-semibold">Dati Cliente</h3>

      <div className="row g-4">
        <div className="col-md-6">
          <label
            htmlFor="customer_first_name"
            className="form-label text-uppercase small fw-semibold"
          >
            Nome *
          </label>
          <input
            type="text"
            className="form-control form-control-lg"
            id="customer_first_name"
            value={formDataCustomer.customer_first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label
            htmlFor="customer_last_name"
            className="form-label text-uppercase small fw-semibold"
          >
            Cognome *
          </label>
          <input
            type="text"
            className="form-control form-control-lg"
            id="customer_last_name"
            value={formDataCustomer.customer_last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label
            htmlFor="customer_email"
            className="form-label text-uppercase small fw-semibold"
          >
            Email *
          </label>
          <input
            type="email"
            className="form-control form-control-lg"
            id="customer_email"
            value={formDataCustomer.customer_email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label
            htmlFor="customer_phone"
            className="form-label text-uppercase small fw-semibold"
          >
            Telefono *
          </label>
          <input
            type="tel"
            className="form-control form-control-lg"
            id="customer_phone"
            value={formDataCustomer.customer_phone}
            onChange={handleChange}
            maxLength={25}
            required
          />
        </div>
        <div className="col-12">
          <label
            htmlFor="customer_address_shipping"
            className="form-label text-uppercase small fw-semibold"
          >
            Indirizzo di spedizione *
          </label>
          <input
            type="text"
            className="form-control form-control-lg"
            id="customer_address_shipping"
            value={formDataCustomer.customer_address_shipping}
            onChange={handleChange}
            required
          />
        </div>

        {/* chekbox */}
        <div className="form-check mt-2 ms-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="sameAddress"
            checked={sameAddress}
            onChange={() => setSameAddress(!sameAddress)}
          />
          <label className="form-check-label" htmlFor="sameAddress">
            Indirizzo di spedizione coincide con quello di fatturazione
          </label>
        </div>

        {/* se non coincidono, input-text per indirizzo di fatturazione */}
        {!sameAddress && (
          <div className="col-12">
            <label
              htmlFor="customer_address"
              className="form-label text-uppercase small fw-semibold"
            >
              Indirizzo di fatturazione *
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="customer_address"
              value={formDataCustomer.customer_address}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="col-md-6">
          <label
            htmlFor="customer_city"
            className="form-label text-uppercase small fw-semibold"
          >
            Città *
          </label>
          <input
            type="text"
            className="form-control form-control-lg"
            id="customer_city"
            value={formDataCustomer.customer_city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label
            htmlFor="customer_cap"
            className="form-label text-uppercase small fw-semibold"
          >
            CAP *
          </label>
          <input
            type="text"
            className="form-control form-control-lg"
            id="customer_cap"
            value={formDataCustomer.customer_cap}
            onChange={handleChange}
            maxLength={5}
            required
          />
        </div>
        {/* <div className="col-12 mt-3">
          <label
            htmlFor="coupon_code"
            className="form-label text-uppercase small fw-semibold"
          >
            Coupon
          </label>
          <input
            type="text"
            className="form-control form-control-lg"
            id="coupon_code"
            value={formDataCustomer.coupon_code}
            onChange={handleChange}
            placeholder="INSERISCI COUPON"
          />
        </div> */}
      </div>

      <button type="submit" className="search-button mb-3">
        Conferma Ordine
      </button>
      <p className="form-label text-uppercase small fw-semibold pt-2">
        (*) campi obbligatori
      </p>
    </form>
  );
}

export default FormCheckout;
