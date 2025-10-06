import React, { useContext } from "react";
// import featuredProducts5 from "../Components/Assets/featured-product5.png";
// import featuredProducts6 from "../Components/Assets/featured-product6.png";
// import featuredProducts7 from "../Components/Assets/featured-product7.png";
// import featuredProducts8 from "../Components/Assets/featured-product8.png";
// import featuredProducts11 from "../Components/Assets/featured-product11.png";
// import featuredProducts12 from "../Components/Assets/featured-product12.png";
import "./TopRatedAndBestSeller.css";
import { FaStar, FaTrophy } from "react-icons/fa";
import { IoIosTimer } from "react-icons/io";
import { AppContext } from "../context/AppContext";

const TopRatedAndBestSeller = () => {
  const { topRated, loading, error } = useContext(AppContext);

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

  // const bestSellingProducts = [
  //   {
  //     id: 1,
  //     name: "Straps Plaid Patchwork",
  //     price: "$20.00",
  //     image: featuredProducts11,
  //     rating: 5,
  //     reviews: 1,
  //   },
  //   {
  //     id: 2,
  //     name: "4 French Door",
  //     price: "$2,484.00",
  //     image: featuredProducts12,
  //     rating: 5,
  //     reviews: 2,
  //   },
  //   {
  //     id: 3,
  //     name: "Leather Single Shoes",
  //     price: "$32.00",
  //     image: featuredProducts5,
  //     rating: 5,
  //     reviews: 1,
  //   },
  //   {
  //     id: 4,
  //     name: "Leather Ladies Bag",
  //     price: "$15.00",
  //     image: featuredProducts6,
  //     rating: 5,
  //     reviews: 2,
  //   },
  //   {
  //     id: 5,
  //     name: "T900 Smart Watch",
  //     originalPrice: "$30.00",
  //     price: "$28.50",
  //     discount: "-5%",
  //     image: featuredProducts7,
  //     rating: 5,
  //     reviews: 1,
  //   },
  //   {
  //     id: 6,
  //     name: "Women Beautiful White",
  //     price: "$70.00",
  //     image: featuredProducts8,
  //     rating: 4,
  //     reviews: 1,
  //   },
  // ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar key={i} className={i < rating ? "star-filled" : "star-empty"} />
      );
    }
    return stars;
  };

  const ProductCard = ({ product }) => (
    <div className="product-card">
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
          {product.originalPrice && (
            <span className="original-price">{product.originalPrice}</span>
          )}
          <span className="current-price">{product.price}</span>
        </div>
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
          <button className="view-all-btn">View All</button>
        </div>
        <div className="products-grid">
          {topRated.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <div className="top-Rated-section">
        <div className="section-header">
          <div className="section-title">
            <IoIosTimer className="icon" />
            <p>Top rated</p>
          </div>
          <button className="view-all-btn">View All</button>
        </div>
        <div className="products-grid">
          {topRated.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopRatedAndBestSeller;
