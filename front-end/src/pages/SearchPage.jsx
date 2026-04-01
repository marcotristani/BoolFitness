import axios from "axios";
import { useState, useEffect } from "react";
import { useApi } from "../contexts/ApiProvider";
import { Link } from "react-router-dom";
const endpoint = import.meta.env.VITE_APP_URL;
import { useLocation } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import FilterSelect from "../components/FilterSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripVertical, faList } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";

export default function SearchPage() {
  const { setIsLoading } = useApi();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // var di stato per funzione cuore wishlist
  const [inWishlist, setInWishlist] = useState({});
  // var di stato per array di prodotti
  const [filteredProducts, setFilteredProducts] = useState([]);
  // var di stato per layout tasti griglia e lista
  const [layout, setLayout] = useState("grid");
  // var di stato per order dinamico per select passato a componente
  const [order, setOrder] = useState("");
  // var di stato per componente per filter discount
  const [isFilterOn, setIsFilterOn] = useState(false);
  // verifica se siamo su pagina di search per ricerca da barra header
  const location = useLocation();
  const onSearchPage = location.pathname === "/products";
  // var per prendere query da url
  // const queryParams = new URLSearchParams(location.search);
  // const searchFromUrl = queryParams.get("cu") || "";
  const queryParams = new URLSearchParams(location.search);
  const searchFromUrl = queryParams.get("cu") ?? "";
  const normalizedSearch = searchFromUrl.trim();
  // var per verifica se filtro è attivo e modifico url con valore preso da parametro cu che corrisponde al search dell'utente
  const myUrl = isFilterOn
    ? `${endpoint}api/products?order=${order}&searched=${normalizedSearch}&discount=${isFilterOn}`
    : `${endpoint}api/products?order=${order}&searched=${normalizedSearch}`;



  function fetchProduct() {
    // if (!searchFromUrl || searchFromUrl.length < 2 && !onSearchPage) {
    //     setFilteredProducts([]);
    //     return;
    // }

    if (normalizedSearch === "") {
      // pulisce l'URL eliminando ?cu=
      window.history.replaceState({}, "", "/products?cu=");

      setIsLoading(true);
      axios
        .get(`${endpoint}api/products?order=${order}&discount=${isFilterOn}`)
        .then((res) => setFilteredProducts(res.data))
        .catch((err) => console.log(err))
        .finally(() => setIsLoading(false));
      return;
    }

    setIsLoading(true);
    axios
      .get(myUrl)
      .then((res) => {
        setFilteredProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    fetchProduct();
  }, [searchFromUrl, order, isFilterOn]);

  return (
    <div
      id="search-card-list"
      className="row container justify-content-center m-auto gy-5 pb-5"
    >
      <div className="d-flex justify-content-between">
        <div>
          <Link className="back-link" to="/">
            ← Torna alla Home
          </Link>
        </div>
        <div className="layout-buttons">
          <button
            onClick={() => setLayout("grid")}
            className={
              layout === "grid" ? "btn-active me-3" : "btn-not-active me-3"
            }
          >
            <FontAwesomeIcon icon={faGripVertical} />
          </button>
          <button
            onClick={() => setLayout("list")}
            className={layout === "list" ? "btn-active" : "btn-not-active"}
          >
            <FontAwesomeIcon icon={faList} />
          </button>
        </div>
      </div>

      <FilterSelect
        order={order}
        setOrder={setOrder}
        isFilterOn={isFilterOn}
        setIsFilterOn={setIsFilterOn}
      />

      <div className="row justify-content-center gy-3 gx-3">
        {layout === "grid"
          ? filteredProducts.map((product) => (
            <div key={product.id} className="search-grid-card col-lg-3 col-md-4 col-sm-8 col-8 me-2 p-2">
              <button className="wishlist-icon" onClick={() => toggleWishlist(product.id)}>
                <span>
                  <FontAwesomeIcon color="#F09226" icon={isInWishlist(product.id) ? fasHeart : farHeart} />
                </span>
              </button>
              <Link to={`/products/${product.slug}`}>
                {product.discount_percentage ? (
                  <div className="d-flex justify-content-center mb-2">
                    <span className="sale-badge">SALE</span>
                  </div>
                ) : null}
                <img className="img-detail-grid" src={product.image_url} alt={product.name} />
                <h1 className="text-dark">{product.name}</h1>
              </Link>
              <p>{product.description}</p>
              {product.discount_percentage ? (
                <>
                  <div className="d-flex justify-content-between">
                    <p className="fw-bold d-inline search-price text-decoration-line-through">{product.price}€</p>
                    <span className="discounted-badge badge-sale-hide">{`${product.discount_percentage} %`}</span>
                  </div>
                  <span className="fw-bold fs-5 search-price">
                    {(product.price * (1 - product.discount_percentage / 100)).toFixed(2)}€
                  </span>
                </>
              ) : (
                <p className="fw-bold search-price">{`${product.price}€`}</p>
              )}
              <div className="add-cart">
                <button onClick={() => addToCart(product)} className="search-button mb-3">
                  Aggiungi al carrello
                </button>
              </div>
            </div>
          ))
          : filteredProducts.map((product) => (
            <div key={product.id} className="col-12 mb-3 px-0">
              <div className="card search-list-card p-3 p-md-4 position-relative w-100 overflow-visible">

                {product.discount_percentage && (
                  <span className=" sale-badge">
                    SALE
                  </span>
                )}

                <button
                  className="position-absolute top-0 end-0  wishlist-icon-list"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                >
                  <FontAwesomeIcon
                    color="#F09226"
                    icon={isInWishlist(product.id) ? fasHeart : farHeart}
                    size="lg"
                  />
                </button>

                <Link to={`/products/${product.slug}`} className="w-100 text-decoration-none">
                  <div className="row g-3 gx-md-3 align-items-center">
                    <div className="col-12 col-md-4 col-lg-3 px-0 px-md-2">
                      <img src={product.image_url} alt={product.name} className="img-fluid rounded w-100" />
                    </div>
                    <div className="col-12 col-md-5 col-lg-6 px-0 px-md-2">
                      <h3 className="search-list-title fw-bold fs-5 mb-2 text-dark">{product.name}</h3>
                      <p className="fs-6  mb-2 mb-md-3 text-dark">{product.description}</p>
                      {product.discount_percentage ? (
                        <div className="d-flex flex-wrap gap-2 align-items-center">
                          <span className="text-decoration-line-through search-price small">{product.price}€</span>
                          <span className="fw-bold fs-5 search-price">
                            {(product.price * (1 - product.discount_percentage / 100)).toFixed(2)}€
                          </span>
                          <span className="discounted-badge badge-sale-hide ms-3">{`${product.discount_percentage} %`}</span>
                        </div>
                      ) : (
                        <p className="fw-bold fs-5 mb-0 search-price">{product.price}€</p>
                      )}
                    </div>
                    <div className="col-12 col-md-3 px-0 px-md-2 text-md-end mt-2 mt-md-0">
                      <button
                        className="search-button w-100 w-md-auto px-4"
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product);
                        }}
                      >
                        Aggiungi al carrello
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}