import React, { useContext } from "react";
import "./TopRatedAndBestSeller.css";
import { FaStar, FaTrophy } from "react-icons/fa";
import { IoIosTimer } from "react-icons/io";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const TopRatedAndBestSeller = () => {
  const { topRated, loading, error } = useContext(AppContext);
  const navigate = useNavigate();

  // NEW: Click handler for individual products
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="categories-section-container">Loading categories...</div>
    );
  }

  if (error) {
    return (
      <div className="categories-section-container">
        Error loading categories: {error.message}
        <p>Please check your network connection and API endpoint.</p>
        <p>
          If you see a CORS error in the console, your API needs to be
          configured to allow requests from your frontend's origin.
        </p>
      </div>
    );
  }

  // Check homePageCategories length
  if (topRated.length === 0) {
    return (
      <div className="categories-section-container">No categories found.</div>
    );
  }

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar key={i} className={i < rating ? "star-filled" : "star-empty"} />
      );
    }
    return stars;
  };

  // NEW: Handler for "View All" Top Rated
  const handleViewAllTopRated = () => {
    navigate("/shop?section=top-rated");
  };
  const ProductCard = ({ product, onProductClick }) => (
    <div className="product-card" onClick={() => onProductClick(product.id)}>
      <div className="product-image-container">
        {product.discount && (
          <div className="discount-badge">{product.discount}</div>
        )}
        <img
          src={product.feature_image}
          alt={product.name}
          className="product-image"
        />
      </div>
      <div className="product-info">
        <p className="product-name">{product.name}</p>
        <div className="product-rating">
          {renderStars(product.rating)}
          {product.reviews > 0 && <span>({product.reviews})</span>}
        </div>
        <div className="product-price">
          {product.variations && product.variations.length > 0
            ? `PKR ${parseFloat(
                product.variations[0].default_sell_price
              ).toFixed(2)}`
            : "N/A"}
        </div>
        {/* <div className="product-price">
          {product.variations.default_sell_price && (
            <span className="original-price">1000</span>
          )}
          <span className="current-price">
            {product.variations.default_sell_price}
          </span>
        </div> */}
      </div>
    </div>
  );

  return (
    <div className="main-container">
      <div className="best-Seller-section">
        <div className="section-header">
          <div className="section-title">
            <FaTrophy className="icon" />
            <p>Best sellings</p>
          </div>
          <button className="view-all-btn" onClick={handleViewAllTopRated}>
            View All
          </button>
        </div>
        <div className="products-grid">
          {topRated.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onProductClick={handleProductClick}
            />
          ))}
        </div>
      </div>

      <div className="top-Rated-section">
        <div className="section-header">
          <div className="section-title">
            <IoIosTimer className="icon" />
            <p>Top rated</p>
          </div>
          <button className="view-all-btn" onClick={handleViewAllTopRated}>
            View All
          </button>
        </div>
        <div className="products-grid">
          {topRated.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onProductClick={handleProductClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopRatedAndBestSeller;
