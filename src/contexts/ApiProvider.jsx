import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

import Loader from "../components/Loader";

const endpoint = import.meta.env.VITE_APP_URL;
const ApiContext = createContext();

export function ApiProvider({ children }) {
  //setter loader
  const [isLoading, setIsLoading] = useState(false);

  const [products, setProducts] = useState([]);

  function fetchProduct() {
    //attivo loader
    setIsLoading(true);
    axios
      .get(`${endpoint}api/products`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(fetchProduct, []);

  return (
    // passo products con array dei prodotti e search per ricerca
    <ApiContext.Provider
      value={{
        products,
        setProducts,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);
  return context;
}
