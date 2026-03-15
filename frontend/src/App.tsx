import { BrowserRouter,useLocation, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout";
import Homepage from "./components/Homepage";
import Store from "./components/Store";
import Product from "./components/Product";
import CartPage from "./components/Cart";
import AddReview from "./components/AddReview";
import Hero from "./components/VideoHero";
import LandingStore from "./components/LandingStore";
import ContactPage from "./components/ContactPage";
import AboutPage from "./components/AboutPage";
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
const App: React.FC = () => {
  return (
    <BrowserRouter>
     <ScrollToTop />
      <Routes>

        <Route element={<Layout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/store">
            <Route index element={<Store />} />
            <Route path=":gender" element={<Store />} />
          </Route>
          <Route path="/store/product/:id" element={<Product />} />
          <Route path="/store/product/:id/submit/review" element={<AddReview />} />

          <Route path="/cart" element={<CartPage />} />
          <Route path="/hero" element={<Hero />} />
          <Route path="/about" element={<AboutPage />} />

          
          <Route path="/contact-us" element={<ContactPage />} />

          <Route path="/store/home" element={<LandingStore />} />


        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;