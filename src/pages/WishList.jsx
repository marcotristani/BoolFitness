import { Link } from "react-router-dom";
import { useApi } from "../contexts/ApiProvider";
import { useWishlist } from "../contexts/WishlistContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
// import { faArrowLeft } from "@fortawesome/free-solidnpm-svg-icons";

function WishList() {
  const { products } = useApi();
  const { wishlist, removeFromWishlist } = useWishlist();

  if (!products) return <p>Caricamento prodotti...</p>;

  const wishListProducts = products.filter((product) =>
    wishlist.includes(product.id),
  );

  // scroll to top quando il prodotto viene caricato
  useEffect(() => {
    if (wishListProducts.length > 0) {
      window.scrollTo(0, 0);
    }
  }, [wishListProducts]);

  return (
    <div className="container-wishlist">
      <div className="content-wishlist">
        <h1 className="title text-center mb-5">Lista Desideri</h1>

        {wishListProducts.length === 0 ? (
          <p className="text-center">La wishlist è vuota</p>
        ) : (
          wishListProducts.map((product) => (
            <div className="col-12 col-md-10 mx-auto mb-3" key={product.id}>
              <div className="card shadow-sm wishlist-card rounded-3 d-flex justify-content-center">
                <div className="row g-0 align-items-center p-3">
                  <div className="col-4 col-md-2 text-center">
                    {product?.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="img-fluid wishlist-img rounded"
                        style={{ maxHeight: "100px", objectFit: "contain" }}
                      />
                    )}
                  </div>

                  <div className="col-4 col-md-6">
                    <Link to={`/products/${product.slug}`}>
                      <h5 className="text-dark">{product.name}</h5>
                    </Link>
                    <span>{product.description}</span>
                  </div>

                  <div className="col-2 text-end">
                    {product.discount_percentage && (
                      <span className="discounted-badge">
                        {`${product.discount_percentage} %`}
                      </span>
                    )}
                    <div className="price-align pe-2 d-flex flex-column">
                      {product.discount_percentage ? (
                        <>
                          <span className="text-decoration-line-through ps-5 ">{product.price}€</span>
                          <span className="search-price fw-bold">{(product.price - (product.price * product.discount_percentage) / 100).toFixed(2)} €</span>


                        </>
                      ) : (
                        <span className="search-price fw-bold">{product.price} €</span>
                      )}
                    </div>
                  </div>

                  <div className="col-12 col-md-2 text-end mt-2 mt-md-0">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeFromWishlist(product.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} color="white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default WishList;
