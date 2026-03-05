import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Homepage from "./components/Homepage";
import Store from "./components/Store";
import Product from "./components/Product";
import CartPage from "./components/Cart";
import AddReview from "./components/AddReview";
import Hero from "./components/VideoHero";
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<Layout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/store/:gender" element={<Store />} />
          <Route path="/store/product/:id" element={<Product />} />
          <Route path="/store/product/:id/submit/review" element={<AddReview />} />

          <Route path="/cart" element={<CartPage />} />
          <Route path="/hero" element={<Hero />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;