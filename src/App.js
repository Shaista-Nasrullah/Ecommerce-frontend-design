import "./App.css";
import Footer from "./Components/Navbar/Footer";
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom"; // Import useLocation
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
import CheckoutPage from "./Pages/CheckoutPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <AppContent /> {/* Create a wrapper component to use useLocation */}
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation(); // Get current location
  const noHeaderFooterRoutes = ["/checkout"]; // Define routes without header/footer

  const showHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname);

  return (
    <div>
      {showHeaderFooter && <Header />}
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
        <Route path="/checkout" element={<CheckoutPage />} />{" "}
        {/* Move checkout inside Routes */}
      </Routes>
      {showHeaderFooter && <Information />}
      {showHeaderFooter && <Footer />}
    </div>
  );
}

export default App;

// import "./App.css";
// import Footer from "./Components/Navbar/Footer";
// import { Routes, Route, BrowserRouter } from "react-router-dom";
// import Header from "./Components/Navbar/Header";
// import Home from "./Pages/Home";
// import AboutUs from "./Pages/AboutUs";
// import ContactUs from "./Pages/ContactUs";
// import Login from "./Pages/Login";
// import Signup from "./Pages/Signup";
// import ProductDetail from "./Pages/ProductDetail";
// import CategoryPages from "./Pages/categoryPages.jsx";
// import AllCategoriesPage from "./Pages/Categories.jsx";
// import SubCategories from "./Pages/SubCategories.jsx";
// import Brands from "./Pages/pageForBrands.jsx";
// import Information from "./Components/Navbar/Information.jsx";
// import MyProfile from "./Pages/MyProfile.jsx";
// import MyOrders from "./Pages/MyOrders.jsx";
// import MyCart from "./Pages/MyCart.jsx";
// import CheckoutPage from "./Pages/CheckoutPage.jsx";

// function App() {
//   return (
//     <BrowserRouter>
//       {" "}
//       {/* Add BrowserRouter here */}
//       <div>
//         <Header />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/about" element={<AboutUs />} />
//           <Route path="/contact" element={<ContactUs />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/product/:productId" element={<ProductDetail />} />
//           <Route path="/shop" element={<CategoryPages />} />
//           <Route path="/categories" element={<AllCategoriesPage />} />
//           <Route path="/categories/:id" element={<SubCategories />} />
//           <Route path="/brands" element={<Brands />} />
//           <Route path="/profile" element={<MyProfile />} />
//           <Route path="/orders" element={<MyOrders />} />
//           <Route path="/cart" element={<MyCart />} />
//         </Routes>
//         <Information />
//         <Footer />
//         <Route path="/checkout" element={<CheckoutPage />} />
//       </div>
//     </BrowserRouter> // Close BrowserRouter here
//   );
// }

// export default App;
