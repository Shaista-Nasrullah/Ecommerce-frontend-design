import React from "react";
import logo from "../Assets/logo-in-nav.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, logout } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => {
    console.log("Header: Redux state.auth.user:", state.auth.user); // Log the user data from Redux state
    return state.auth.user;
  });
  const navigate = useNavigate();
  const [searchOverlay, setSearchOverlay] = React.useState(false);
  const [userDropdown, setUserDropdown] = React.useState(false);

  React.useEffect(() => {
    console.log(
      "Header: Component mounted or dispatch changed. Attempting to fetch user data."
    );
    // Only fetch user if a token exists and user data isn't already loaded
    // This prevents unnecessary API calls if the user data is already in state/localStorage
    const token = localStorage.getItem("token");
    if (token && !user) {
      dispatch(fetchUser());
    } else if (user) {
      console.log(
        "Header: User already present in state, skipping fetchUser call."
      );
    } else {
      console.log("Header: No token found, user not fetched.");
    }
  }, [dispatch, user]); // Added user to dependency array to react to user state changes

  const handleLogout = () => {
    console.log("Header: User logout initiated.");
    dispatch(logout());
    navigate("/login");
  };

  const toggleSearchOverlay = () => {
    setSearchOverlay(true);
    console.log("Header: Search overlay toggled ON.");
  };

  const handleCancelSearch = () => {
    setSearchOverlay(false);
    console.log("Header: Search overlay toggled OFF (cancelled).");
  };

  const toggleUserDropdown = () => {
    setUserDropdown(!userDropdown);
    console.log("Header: User dropdown toggled. Current state:", !userDropdown);
  };

  // Determine the display name for the user
  const getUserDisplayName = () => {
    if (!user) return "Guest";
    // Prioritize first_name if available
    if (user.first_name) {
      return user.first_name;
    }
    // Fallback to username if first_name is not available
    if (user.username) {
      return user.username;
    }
    // Fallback to email if neither first_name nor username are available
    if (user.email) {
      return user.email;
    }
    return "User"; // Default fallback
  };

  return (
    <>
      <div className="navbar-top">
        <div className="menu">
          <i className="fa fa-bars"></i>
        </div>
        {/* <a href="/"> */}
        <div className="brand-logo">
          <img src={logo} alt="6Valley Logo " />
          <p className="brand-name">6Valley</p>
        </div>
        {/* </a> */}
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
            <i className="fa fa-heart"></i>
            <span className="badge">0</span>
          </div>
          <div
            className="action-item user-icon-wrapper"
            onClick={toggleUserDropdown}
          >
            {/* Conditional Rendering: Display user's name if logged in, otherwise display icon */}
            {user ? (
              <span className="user-display-name">
                {getUserDisplayName()} <br />
                Dashboard ^
              </span>
            ) : (
              <i className="fa fa-user"></i>
            )}

            {userDropdown && (
              <div className="user-dropdown-menu">
                {user ? (
                  <>
                    <a href="/profile" className="dropdown-item">
                      <i className="fa fa-user-circle"></i>{" "}
                      <span>My Profile</span>
                    </a>
                    <a href="/orders" className="dropdown-item">
                      <i className="fa fa-shopping-bag"></i>{" "}
                      <span>My Orders</span>
                    </a>
                    <div className="dropdown-item" onClick={handleLogout}>
                      <i className="fa fa-sign-out-alt"></i> <span>Logout</span>
                    </div>
                  </>
                ) : (
                  <>
                    {console.log(
                      "Header: User not logged in, displaying sign in/up options."
                    )}
                    <a href="/login" className="dropdown-item">
                      <i className="fa fa-sign-in-alt"></i> <span>Sign In</span>
                    </a>
                    <a href="/signup" className="dropdown-item">
                      <i className="fa fa-user-plus"></i> <span>Sign Up</span>
                    </a>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="action-item cart">
            <i className="fa fa-shopping-cart"></i>
            <span className="badge">0</span>
          </div>
        </div>
      </div>
      <div className="navbar-spacer"></div>
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
      <div className="navbar-bottom-container">
        <nav className="navbar-bottom">
          <div className="categories-dropdown">
            <i className="fa fa-th"></i>
            <span>Categories</span>
            <i className="fa fa-chevron-down"></i>
          </div>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/products">Products</a>
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
              <a href="/contact">Contact Us</a>
            </li>
            <li>
              <a href="/about">About Us</a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Header;
