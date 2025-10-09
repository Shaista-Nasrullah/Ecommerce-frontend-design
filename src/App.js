import "./App.css";
import Footer from "./Components/Navbar/Footer";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Header from "./Components/Navbar/Header";
import Home from "./Pages/Home";
import AboutUs from "./Pages/AboutUs";
import ContactUs from "./Pages/ContactUs";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ProductDetail from "./Pages/ProductDetail";
import CategoryPages from "./Pages/categoryPages.jsx";
import AllCategoriesPage from "./Pages/Categories.jsx";
import SubCategories from "./Pages/SubCategories.jsx";
import Brands from "./Pages/pageForBrands.jsx";
import Information from "./Components/Navbar/Information.jsx";
import MyProfile from "./Pages/MyProfile.jsx";
import MyOrders from "./Pages/MyOrders.jsx";
import MyCart from "./Pages/MyCart.jsx";

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
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/shop" element={<CategoryPages />} />
          <Route path="/categories" element={<AllCategoriesPage />} />
          <Route path="/categories/:id" element={<SubCategories />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/cart" element={<MyCart />} />
        </Routes>
        <Information />
        <Footer />
      </div>
    </BrowserRouter> // Close BrowserRouter here
  );
}

export default App;
