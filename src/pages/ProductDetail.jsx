import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
//importo componente di ref per dettaglio
import CardDetail from "../components/CardDetail";
//salvo endpoint in var
const endpoint = import.meta.env.VITE_APP_URL;

//iporto componente per prodotti correlati
import RelatedProducts from "../components/RelatedProducts";

//set funzione per il dettaglio
export default function ProductDetail() {
  //recupero id di ref attraverso params
  const { slug } = useParams();

  //setto var di stato per gestione prodotto
  const [product, setProduct] = useState({});

  const navigate = useNavigate();

  //setto funzione per gestione chiamata alla show del db
  function fetchProduct() {
    //chiamata
    axios
      .get(`${endpoint}api/products/${slug}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.log("Prodotto non trovato", err);
        navigate("/notfound");
      })
      .finally();
  }

  //richiamo effect per il controllo su effetti collaterali
  useEffect(fetchProduct, [slug]);

  // scroll to top quando il prodotto viene caricato
  useEffect(() => {
    if (product.id) {
      window.scrollTo(0, 0);
    }
  }, [product]);

  return (
    <>
      <CardDetail product={product} />
    </>
  );
}
