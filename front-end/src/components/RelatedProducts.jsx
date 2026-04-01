// import card del singolo prodotto
import ProductCard from "./ProductCard";
import { useApi } from "../contexts/ApiProvider";

// import swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

function RelatedProducts({ category_id, product_id }) {
  const { products } = useApi();
  // funzione per renderizzare i prodotti con stessa categoria come slide
  function renderRelatedProducts() {
    return products
      .filter(
        (product) =>
          product.category_id == category_id && product.id !== product_id,
      )
      .map((product) => (
        <SwiperSlide key={product.id}>
          <ProductCard productProp={product} />
        </SwiperSlide>
      ));
  }
  return (
    <div className="container mt-5">
      <h2 className="pt-5">Prodotti Correlati</h2>

      <Swiper
        className="p-5"
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={4} // quante card si vedono contemporaneamente
        breakpoints={{
          320: { slidesPerView: 1 }, // mobile
          768: { slidesPerView: 2 }, // tablet
          1024: { slidesPerView: 4 }, // desktop
        }}
      >
        {renderRelatedProducts()}
      </Swiper>
    </div>
  );
}

export default RelatedProducts;
