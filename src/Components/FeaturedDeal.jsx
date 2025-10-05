import React from "react";
import "./FeaturedDeal.css";
import featuredProducts1 from "../Components/Assets/featured-product1.png";
import featuredProducts2 from "../Components/Assets/featured-product2.png";
import featuredProducts3 from "../Components/Assets/featured-product3.png";
import featuredProducts4 from "../Components/Assets/featured-product4.png";

const featuredProducts = [
  {
    id: 1,
    name: "Popcorn Running Shoes",
    originalPrice: "$200.00",
    discountedPrice: "$170.00",
    discount: "-15%",
    image: featuredProducts1,
    rating: null,
    reviews: null,
  },
  {
    id: 2,
    name: "Backpack For Women",
    originalPrice: "$60.00",
    discountedPrice: "$57.00",
    discount: "-5%",
    image: featuredProducts2,
    rating: null,
    reviews: null,
  },
  {
    id: 3,
    name: "TV Stands Cabinets",
    originalPrice: "$655.00",
    discountedPrice: "$640.00",
    discount: "-$15.00",
    image: featuredProducts3,
    rating: null,
    reviews: null,
  },
  {
    id: 4,
    name: "T900 Smart Watch",
    originalPrice: "$30.00",
    discountedPrice: "$28.50",
    discount: "-5%",
    image: featuredProducts4,
    rating: 1,
    reviews: "(1)",
  },
];

const FeaturedDeal = () => {
  return (
    <div className="fd-container">
      <div className="fd-header">
        <div className="fd-title">
          <h2>Featured Deal</h2>
          <p>See the latest deals and exciting new offers!</p>
        </div>
        <a href="#" className="fd-view-all">
          View All <span className="fd-arrow">&gt;</span>
        </a>
      </div>
      <div className="fd-product-grid">
        {featuredProducts.map((product) => (
          <div key={product.id} className="fd-product-card">
            <div className="fd-discount-tag">{product.discount}</div>
            <div className="fd-product-card-content">
              <div className="fd-product-image-wrapper">
                <img
                  src={product.image}
                  alt={product.name}
                  className="fd-product-image"
                />
              </div>
              <div className="fd-product-info">
                <h3 className="fd-product-name">{product.name}</h3>
                <div className="fd-price-details">
                  <span className="fd-original-price">
                    {product.originalPrice}
                  </span>
                  <span className="fd-discounted-price">
                    {product.discountedPrice}
                  </span>
                </div>
                {product.rating && (
                  <div className="fd-product-rating">
                    {/* For simplicity, using a static star icon or you can use a library like react-icons */}
                    <span className="fd-star-icon">⭐️</span>
                    <span className="fd-rating-value">{product.rating}</span>
                    <span className="fd-reviews-count">{product.reviews}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedDeal;
