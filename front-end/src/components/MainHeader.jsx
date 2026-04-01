// import link
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/boolshop-logo-2nd.svg";
import logoSm from "../assets/logo-just-barbell.svg";

// import context
import { useApi } from "../contexts/ApiProvider";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";

const shippingthreshold = Number(import.meta.env.VITE_SHIPPING_THRESHOLD);

function MainHeader() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { wishlist } = useWishlist();

  const [search, setSearch] = useState("");
  const [placeholder, setPlaceholder] = useState("Cerca il tuo prodotto");

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");

    const updatePlaceholder = () => {
      if (media.matches) {
        setPlaceholder("Cerca...");
      } else {
        setPlaceholder("Cerca il tuo prodotto");
      }
    };

    updatePlaceholder();

    media.addEventListener("change", updatePlaceholder);

    return () => {
      media.removeEventListener("change", updatePlaceholder);
    };
  }, []);

  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   const value = e.target.value.trim();
  //   setSearch(value);
  //   const searchQuery = value;

  //   if (searchQuery) {
  //     navigate(`/search?cu=${encodeURIComponent(searchQuery)}`);
  //   }
  // };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    // Se l'utente cancella tutto → resetta l'URL
    if (value === "") {
      navigate("/products?cu=");
      return;
    }

    // Altrimenti aggiorna normalmente
    navigate(`/products?cu=${encodeURIComponent(value)}`);
  };

  return (
    <>
      <header className="sticky-top d-flex flex-column no-padding">
        {/* Banner  */}
        <div className="py-2 text-center banner">
          <span className="fw-bold text-dark">SPEDIZIONI GRATUITE</span>
          <span className="text-dark ms-1">
            SU ORDINI SOPRA I {shippingthreshold}&euro;
          </span>
        </div>
        {/* Navbar */}
        <div className="main-header d-flex justify-content-between align-items-center">
          <Link to={"/"} className="d-none d-md-block logo">
            <img src={logo} alt="" />
          </Link>
          <Link to={"/"} className="d-md-none logo">
            <img src={logoSm} alt="" />
          </Link>
          <form className="search-bar" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              className="my-search-bar form-control-plaintext "
              placeholder={placeholder}
              value={search}
              onChange={handleSearch}
            />
          </form>
          <nav className="navbar">
            <ul>
              <Link to={"/wishlist"}>
                <FontAwesomeIcon icon={faHeart} color="grey" />
                {wishlist.length > 0 && (
                  <div className="container-badge">
                    <p>
                      <span className="badge-cart-wishlist ms-5">
                        {wishlist.length}
                      </span>
                      {console.log(wishlist)}
                      {console.log(typeof wishlist)}
                    </p>
                  </div>
                )}
              </Link>
              <Link to={"/cart"}>
                <FontAwesomeIcon
                  icon={faCartShopping}
                  color="grey"
                  className="me-5"
                />
                {cart.length > 0 && (
                  <div className="container-badge">
                    <p>
                      <span className="badge-cart">{cart.length}</span>
                    </p>
                  </div>
                )}
              </Link>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}

export default MainHeader;
