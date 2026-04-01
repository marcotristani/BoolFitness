import { BrowserRouter, Routes, Route } from "react-router-dom";
import DefaultLayout from "./layout/DefaultLayout";
import Homepage from "./pages/Homepage";
import ProductDetail from "./pages/ProductDetail";
import { ApiProvider } from "./contexts/ApiProvider";
import CartPage from "./pages/CartPage";
import WishList from "./pages/WishList";
import ErrorPage from "./pages/ErrorPage";
import { CartProvider } from "./contexts/CartContext";
import SearchPage from "./pages/SearchPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccess from "./pages/OrderSuccess";
import { WishlistProvider } from "./contexts/WishlistContext";

function App() {
  return (
    <BrowserRouter>
      <ApiProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              <Route element={<DefaultLayout />}>
                <Route index element={<Homepage />} />
                <Route path="products/:slug" element={<ProductDetail />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/products" element={<SearchPage />} />
                <Route path="/wishlist" element={<WishList />} />
                <Route path="/notfound" element={<ErrorPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order_success" element={<OrderSuccess />} />
                <Route path="*" element={<ErrorPage />} />
              </Route>
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </ApiProvider>
    </BrowserRouter>
  );
}

export default App;
