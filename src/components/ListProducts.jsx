// import card del singolo prodotto
import ProductCard from "./ProductCard";
import { useApi } from "../contexts/ApiProvider";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

// import swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

function ListProducts() {
  const { products } = useApi();

  // funzione per renderizzare i prodotti con discount come slide
  function renderDiscountProducts() {
    return products
      .filter((product) => product.discount_percentage !== null)
      .map((product) => (
        <SwiperSlide key={product.id}>
          <ProductCard productProp={product} />
        </SwiperSlide>
      ));
  }

  // funzione per renderizzare i prodotti ultimi arrivi
  function renderLatestArrivals() {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1); // data di un mese fa

    const latest = products
      .filter((product) => {
        // controlla che created_at esista e sia nell'ultimo mese
        return (
          product.created_date && new Date(product.created_date) >= oneMonthAgo
        );
      })
      .map((product) => (
        <SwiperSlide key={product.id}>
          <ProductCard productProp={product} />
        </SwiperSlide>
      ));

    return latest;
  }

  // scroll to top quando il prodotto viene caricato
  useEffect(() => {
    if (products.length > 0) {
      window.scrollTo(0, 0);
    }
  }, [products]);

  if (!products.length) return <div>Nessun prodotto</div>;

  return (
    <>
      <div className="container mt-5">
        <div className="d-flex  justify-content-end px-5">
          <Link className="back-link" to="/products">
            Tutti i prodotti <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
        <h2 className="pt-5">Prodotti in sconto</h2>
        <Swiper
          className="p-5"
          modules={[Navigation]}
          navigation
          spaceBetween={20}
          slidesPerView={4} // quante card si vedono contemporaneamente
          breakpoints={{
            320: { slidesPerView: 1 }, // mobile
            768: { slidesPerView: 2 }, // tablet
            989: { slidesPerView: 3 }, // desktop
            1200: { slidesPerView: 4 }, // desktop lg
          }}
        >
          {renderDiscountProducts()}
        </Swiper>
      </div>

      <div className="container mt-5">
        <h2 className="pt-5">Ultimi arrivi</h2>

        <Swiper
          className="p-5"
          modules={[Navigation]}
          navigation
          spaceBetween={20}
          slidesPerView={4} // quante card si vedono contemporaneamente
          breakpoints={{
            320: { slidesPerView: 1 }, // mobile
            768: { slidesPerView: 2 }, // tablet
            989: { slidesPerView: 3 }, // desktop
            1200: { slidesPerView: 4 }, // desktop lg
          }}
        >
          {renderLatestArrivals()}
        </Swiper>
      </div>
    </>
  );
}

export default ListProducts;
