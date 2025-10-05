import "./App.css";
import Footer from "./Components/Navbar/Footer";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Header from "./Components/Navbar/Header";
import Home from "./Pages/Home";
import AboutUs from "./Pages/AboutUs";
import ContactUs from "./Pages/ContactUs";
import Products from "./Pages/Products";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ProductDetail from "./Pages/ProductDetail";
import Saman from "./Pages/saman";
import CategoryPages from "./Pages/categoryPages.jsx";
import Categories from "./Pages/Categories.jsx";
import SubCategories from "./Pages/SubCategories.jsx";
import Brands from "./Pages/pageForBrands.jsx";

function App() {
  return (
    <BrowserRouter>
      {" "}
      {/* Add BrowserRouter here */}
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/details" element={<Saman />} />
          <Route path="/categoriesProducts" element={<CategoryPages />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:id" element={<SubCategories />} />
          <Route path="/brands" element={<Brands />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter> // Close BrowserRouter here
  );
}

export default App;
