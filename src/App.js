// src/App.js

import React, { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { AppContext } from "./context/AppContext.jsx";
import "./App.css";
import Footer from "./Components/Navbar/Footer";
import {
  Routes,
  Route,
  BrowserRouter,
  useLocation,
  Outlet,
} from "react-router-dom";
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
import MyAddress from "./Pages/MyAddress.jsx";
import CheckoutPage from "./Pages/CheckoutPage.jsx";
import OtherSettings from "./Pages/OtherSettings.jsx";
import RefundPolicy from "./Pages/RefundPolicy.jsx";
import ReturnPolicy from "./Pages/ReturnPolicy.jsx";
import PrivacyPolicy from "./Pages/PrivacyPolicy.jsx";
import CancellationPolicy from "./Pages/CancellationPolicy.jsx";
import TermsAndConditions from "./Pages/TermsAndConditions.jsx";
import WishlistItems from "./Pages/WishlistItems.jsx";
import CategorySidebar from "./Components/CategorySidebar.jsx";
import PaymentMethods from "./Pages/PaymentMethods.jsx";
import ScrollToTop from "./Components/ScrollToTop.jsx";
import Inbox from "./Pages/Inbox.jsx";
import MyWallet from "./Pages/MyWallet.jsx";

// --- NEW: A Layout for all pages EXCEPT the homepage ---
const OtherPagesLayout = () => {
  const { isCategorySidebarOpen } = useContext(AppContext);

  return (
    <Container fluid>
      <Row>
        {isCategorySidebarOpen && (
          <Col lg={3} className="d-none d-lg-block">
            <CategorySidebar />
          </Col>
        )}

        <Col lg={12} xs={12}>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const noHeaderFooterRoutes = ["/checkout"];
  const showHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname);

  return (
    <div>
      {showHeaderFooter && <Header />}
      <Routes>
        {/* Route 1: Homepage uses its own specific layout */}
        <Route path="/" element={<Home />} />

        {/* Route 2: All other pages are nested inside the flexible layout */}
        <Route element={<OtherPagesLayout />}>
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/shop" element={<CategoryPages />} />
          <Route path="/categories" element={<AllCategoriesPage />} />
          <Route path="/categories/:id" element={<SubCategories />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/cart" element={<MyCart />} />
          <Route path="/my-address" element={<MyAddress />} />
          <Route path="/my-wallet" element={<MyWallet />} />
          <Route path="/security" element={<OtherSettings />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/cancellation-policy" element={<CancellationPolicy />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route path="/wish-list" element={<WishlistItems />} />
        </Route>

        {/* Route 3: Full-screen pages without any layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment-methods" element={<PaymentMethods />} />
        <Route path="/inbox" element={<Inbox />} />
      </Routes>
      {showHeaderFooter && <Information />}
      {showHeaderFooter && <Footer />}
    </div>
  );
}

export default App;
