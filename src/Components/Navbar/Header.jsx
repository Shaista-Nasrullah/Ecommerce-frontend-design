// src/Components/Header/Header.jsx
import React, { useState, useEffect, useContext } from "react";
import logo from "../Assets/logo-in-nav.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, logout } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Header.css";
import { AppContext } from "../../context/AppContext";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const totalQuantity = useSelector((state) => state.cart?.totalQuantity || 0);
  const totalAmount = useSelector((state) => state.cart?.totalAmount || 0);
  const [searchOverlay, setSearchOverlay] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [viewMoreCategories, setViewMoreCategories] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState(null);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [brandsError, setBrandsError] = useState(null);
  const [viewMoreBrands, setViewMoreBrands] = useState(false);
  const {
    allCategories,
    allBrands,
    fetchAllCategoriesData,
    fetchBrandsData,
    wishlistCount,
    fetchWishlist,
    toggleCategorySidebar,
  } = useContext(AppContext);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUser());
    }
    if (token) {
      fetchWishlist(token);
    }
  }, [dispatch, token, user, fetchWishlist]);

  useEffect(() => {
    if (mobileMenuOpen || categoriesOpen) {
      if (
        allCategories.length === 0 &&
        !categoriesLoading &&
        !categoriesError
      ) {
        fetchAllCategoriesData(setCategoriesLoading, setCategoriesError);
      }
    }
  }, [
    mobileMenuOpen,
    categoriesOpen,
    allCategories.length,
    categoriesLoading,
    categoriesError,
    fetchAllCategoriesData,
  ]);

  useEffect(() => {
    if (mobileMenuOpen || brandsOpen) {
      if (allBrands.length === 0 && !brandsLoading && !brandsError) {
        fetchBrandsData(setBrandsLoading, setBrandsError);
      }
    }
  }, [
    mobileMenuOpen,
    brandsOpen,
    allBrands.length,
    brandsLoading,
    brandsError,
    fetchBrandsData,
  ]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const toggleSearchOverlay = () => {
    setSearchOverlay(true);
  };

  const handleCancelSearch = () => {
    setSearchOverlay(false);
  };

  const toggleUserDropdown = () => {
    setUserDropdown(!userDropdown);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      setUserDropdown(false);
      setCategoriesOpen(false); // Close categories dropdown when opening mobile menu
      setBrandsOpen(false); // Close brands dropdown when opening mobile menu
    }
  };

  const toggleCategoriesInMenu = () => {
    setCategoriesOpen(!categoriesOpen);
    if (!categoriesOpen) setBrandsOpen(false); // Close brands if opening categories
  };

  const toggleBrandsInMenu = () => {
    setBrandsOpen(!brandsOpen);
    if (!brandsOpen) setCategoriesOpen(false); // Close categories if opening brands
  };

  const toggleViewMoreCategories = () => {
    setViewMoreCategories(!viewMoreCategories);
  };

  const getUserDisplayName = () => {
    if (!user) return "Guest";
    if (user.first_name) {
      return user.first_name;
    }
    if (user.username) {
      return user.username;
    }
    if (user.email) {
      return user.email;
    }
    return "User";
  };

  // Use `allCategories` from context, filter to take first 9 for initial display
  const initialCategories = allCategories.slice(0, 9);
  const moreCategories = allCategories.slice(9);

  // Use `allBrands` from context for display
  const initialBrands = allBrands.slice(0, 9); // Show first 9 brands
  const moreBrands = allBrands.slice(9); // The rest of the brands

  const toggleViewMoreBrands = () => {
    setViewMoreBrands(!viewMoreBrands);
  };

  return (
    <>
      <div className="navbar-top">
        <div className="menu" onClick={toggleMobileMenu}>
          <i className="fa fa-bars"></i>
        </div>
        <Link to="/" className="brand-link-wrapper">
          {" "}
          <div className="brand-logo">
            <img src={logo} alt="6Valley Logo " />
            <p className="brand-name">6Valley</p>
          </div>
        </Link>
        <div className="search-bar">
          <input type="text" placeholder="Search for items..." />
          <button className="search-button">
            <i className="fa fa-search"></i>
          </button>
        </div>
        <div className="user-actions">
          <div className="search-icon" onClick={toggleSearchOverlay}>
            <i className="fa fa-search"></i>
          </div>
          <div className="action-item">
            <Link to="/wish-list">
              <i className="fa fa-heart"></i>
              {/* NEW: Use wishlistCount from context */}
              {wishlistCount > 0 && (
                <span className="badge wishlist-badge">{wishlistCount}</span>
              )}
            </Link>
          </div>
          <div
            className="action-item user-icon-wrapper"
            onClick={toggleUserDropdown}
          >
            {user ? (
              <>
                <i className="fa fa-user user-icon-logged-in"></i>{" "}
                <span className="user-display-name">
                  {getUserDisplayName()} <br />
                  Dashboard ^
                </span>
              </>
            ) : (
              // If user is not logged in, just render the default icon.
              <i className="fa fa-user"></i>
            )}

            {userDropdown && (
              <div className="user-dropdown-menu">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setUserDropdown(false)}
                    >
                      <i className="fa fa-user-circle"></i>{" "}
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to="/orders"
                      className="dropdown-item"
                      onClick={() => setUserDropdown(false)}
                    >
                      <i className="fa fa-shopping-bag"></i>{" "}
                      <span>My Orders</span>
                    </Link>
                    <div className="dropdown-item" onClick={handleLogout}>
                      <i className="fa fa-sign-out-alt"></i> <span>Logout</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="dropdown-item"
                      onClick={() => setUserDropdown(false)}
                    >
                      <i className="fa fa-sign-in-alt"></i> <span>Sign In</span>
                    </Link>
                    <Link
                      to="/signup"
                      className="dropdown-item"
                      onClick={() => setUserDropdown(false)}
                    >
                      <i className="fa fa-user-plus"></i> <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="action-item cart">
            <Link to="/cart">
              <i className="fa fa-shopping-cart"></i>
              <span className="badge">{totalQuantity}</span>{" "}
            </Link>
            <span className="cart-total-amount">
              PKR{" "}
              {totalAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>
      <div className="navbar-spacer"></div>

      {/* Mobile Menu Sidebar */}
      <div className={`mobile-menu-sidebar ${mobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <span className="mobile-menu-close" onClick={toggleMobileMenu}>
            <i className="fa fa-times"></i>
          </span>
        </div>
        <div className="mobile-menu-content">
          <Link to="/" className="mobile-menu-item" onClick={toggleMobileMenu}>
            Home
          </Link>

          <div
            className="mobile-menu-category-toggle"
            onClick={toggleCategoriesInMenu}
          >
            Categories{" "}
            <i
              className={`fa ${
                categoriesOpen ? "fa-chevron-up" : "fa-chevron-down"
              }`}
            ></i>
          </div>

          {categoriesOpen && (
            <div className="mobile-menu-categories">
              {categoriesLoading ? (
                <div className="mobile-category-item">
                  Loading categories...
                </div>
              ) : categoriesError ? (
                <div className="mobile-category-item error-message">
                  Error: {categoriesError.message}
                </div>
              ) : allCategories.length === 0 ? (
                <div className="mobile-category-item">No categories found.</div>
              ) : (
                <>
                  {initialCategories.map((category) => (
                    <Link
                      to={`/category/${category.slug}`} // Assuming 'slug' is available for URL
                      key={category.id} // Use unique ID as key
                      className="mobile-category-item"
                      onClick={toggleMobileMenu}
                    >
                      {/* You might need a default icon or handle if category.icon is not available */}
                      <i className={category.icon || "fa fa-folder"}></i>{" "}
                      {category.name} <i className="fa fa-chevron-right"></i>
                    </Link>
                  ))}
                  {viewMoreCategories &&
                    moreCategories.map((category) => (
                      <Link
                        to={`/category/${category.slug}`}
                        key={category.id}
                        className="mobile-category-item"
                        onClick={toggleMobileMenu}
                      >
                        <i className={category.icon || "fa fa-folder"}></i>{" "}
                        {category.name} <i className="fa fa-chevron-right"></i>
                      </Link>
                    ))}
                  {moreCategories.length > 0 && (
                    <div
                      className="mobile-category-item view-more"
                      onClick={toggleViewMoreCategories}
                    >
                      {viewMoreCategories ? "View less" : "View more"}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* New Brands Section in Mobile Menu */}
          <div
            className="mobile-menu-category-toggle" // Reusing this class for styling consistency
            onClick={toggleBrandsInMenu}
          >
            Brands{" "}
            <i
              className={`fa ${
                brandsOpen ? "fa-chevron-up" : "fa-chevron-down"
              }`}
            ></i>
          </div>

          {brandsOpen && (
            <div className="mobile-menu-categories">
              {" "}
              {/* Reusing categories styles for now */}
              {brandsLoading ? (
                <div className="mobile-category-item">Loading brands...</div>
              ) : brandsError ? (
                <div className="mobile-category-item error-message">
                  Error: {brandsError.message}
                </div>
              ) : allBrands.length === 0 ? (
                <div className="mobile-category-item">No brands found.</div>
              ) : (
                <>
                  {initialBrands.map((brand) => (
                    <Link
                      to={`/brand/${brand.id}`}
                      key={brand.id}
                      className="mobile-category-item"
                      onClick={toggleMobileMenu}
                    >
                      {brand.name}
                      <i className="fa fa-chevron-right"></i>
                    </Link>
                  ))}
                  {viewMoreBrands &&
                    moreBrands.map((brand) => (
                      <Link
                        to={`/brand/${brand.slug}`}
                        key={brand.id}
                        className="mobile-category-item"
                        onClick={toggleMobileMenu}
                      >
                        {brand.name}
                        <i className="fa fa-chevron-right"></i>
                      </Link>
                    ))}
                  {moreBrands.length > 0 && (
                    <div
                      className="mobile-category-item view-more"
                      onClick={toggleViewMoreBrands}
                    >
                      {viewMoreBrands ? "View less" : "View more"}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ... (rest of your mobile menu items) ... */}
          <Link
            to="/shop"
            className="mobile-menu-item"
            onClick={toggleMobileMenu}
          >
            Products
          </Link>

          {user ? (
            <>
              <Link
                to="/profile"
                className="mobile-menu-item sign-item"
                onClick={toggleMobileMenu}
              >
                <i className="fa fa-user-circle"></i> <span>My Profile</span>
              </Link>
              <Link
                to="/orders"
                className="mobile-menu-item sign-item"
                onClick={toggleMobileMenu}
              >
                <i className="fa fa-shopping-bag"></i> <span>My Orders</span>
              </Link>
              <div
                className="mobile-menu-item sign-item"
                onClick={handleLogout}
              >
                <i className="fa fa-sign-out-alt"></i> <span>Logout</span>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="mobile-menu-item sign-item"
                onClick={toggleMobileMenu}
              >
                <i className="fa fa-sign-in-alt"></i> <span>Sign In</span>
              </Link>
              <Link
                to="/signup"
                className="mobile-menu-item sign-item"
                onClick={toggleMobileMenu}
              >
                <i className="fa fa-user-plus"></i> <span>Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Overlay for search */}
      {searchOverlay && (
        <div className="search-overlay">
          <div className="search-overlay-content">
            <input type="text" placeholder="Search for items..." autoFocus />
            <button
              onClick={handleCancelSearch}
              className="search-overlay-cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Desktop bottom navigation (hidden on mobile) */}
      <div className="navbar-bottom-container">
        <nav className="navbar-bottom">
          <div className="categories-dropdown" onClick={toggleCategorySidebar}>
            <i className="fa fa-th"></i>
            <span>Categories</span>
            <i className="fa fa-chevron-down"></i>
          </div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/shop">Products</Link>
            </li>
            <li>
              <a href="#offers">
                Offers <i className="fa fa-chevron-down"></i>
              </a>
            </li>
            <li>
              <a href="#publication">Publication House</a>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Header;
