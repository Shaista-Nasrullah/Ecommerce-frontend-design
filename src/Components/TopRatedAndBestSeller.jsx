import React from "react";
import featuredProducts5 from "../Components/Assets/featured-product5.png";
import featuredProducts6 from "../Components/Assets/featured-product6.png";
import featuredProducts7 from "../Components/Assets/featured-product7.png";
import featuredProducts8 from "../Components/Assets/featured-product8.png";

import featuredProducts9 from "../Components/Assets/featured-product9.png";
import featuredProducts10 from "../Components/Assets/featured-product10.png";
import featuredProducts11 from "../Components/Assets/featured-product11.png";
import featuredProducts12 from "../Components/Assets/featured-product12.png";
import "./TopRatedAndBestSeller.css";
import { FaStar, FaTrophy } from "react-icons/fa";
import { IoIosTimer } from "react-icons/io";

const TopRatedAndBestSeller = () => {
  const bestSellingProducts = [
    {
      id: 1,
      name: "iPhone 14 Pro Max",
      price: "$1,149.00",
      image: featuredProducts5,
      rating: 5,
      reviews: 1,
    },
    {
      id: 2,
      name: "Straps Plaid Patchwork",
      price: "$20.00",
      image: featuredProducts6,
      rating: 5,
      reviews: 1,
    },
    {
      id: 3,
      name: "Copper Alloy Inlaid",
      price: "$9.00",
      image: featuredProducts7,
      rating: 0,
      reviews: 0,
    },
    {
      id: 4,
      name: "4 French Door",
      price: "$2,484.00",
      image: featuredProducts8,
      rating: 5,
      reviews: 2,
    },
    {
      id: 5,
      name: "Women Beautiful White",
      price: "$70.00",
      image: featuredProducts9,
      rating: 4,
      reviews: 1,
    },
    {
      id: 6,
      name: "Bohemiantee Shirt Tops",
      price: "$22.00",
      image: featuredProducts10,
      rating: 0,
      reviews: 0,
    },
  ];

  const topRatedProducts = [
    {
      id: 1,
      name: "Straps Plaid Patchwork",
      price: "$20.00",
      image: featuredProducts11,
      rating: 5,
      reviews: 1,
    },
    {
      id: 2,
      name: "4 French Door",
      price: "$2,484.00",
      image: featuredProducts12,
      rating: 5,
      reviews: 2,
    },
    {
      id: 3,
      name: "Leather Single Shoes",
      price: "$32.00",
      image: featuredProducts5,
      rating: 5,
      reviews: 1,
    },
    {
      id: 4,
      name: "Leather Ladies Bag",
      price: "$15.00",
      image: featuredProducts6,
      rating: 5,
      reviews: 2,
    },
    {
      id: 5,
      name: "T900 Smart Watch",
      originalPrice: "$30.00",
      price: "$28.50",
      discount: "-5%",
      image: featuredProducts7,
      rating: 5,
      reviews: 1,
    },
    {
      id: 6,
      name: "Women Beautiful White",
      price: "$70.00",
      image: featuredProducts8,
      rating: 4,
      reviews: 1,
    },
  ];

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
        <img src={product.image} alt={product.name} className="product-image" />
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
          {bestSellingProducts.map((product) => (
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
          {topRatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopRatedAndBestSeller;

// import React from "react";
// import featuredProducts5 from "../Components/Assets/featured-product5.png";
// import featuredProducts6 from "../Components/Assets/featured-product6.png";
// import featuredProducts7 from "../Components/Assets/featured-product7.png";
// import featuredProducts8 from "../Components/Assets/featured-product8.png";

// import featuredProducts9 from "../Components/Assets/featured-product9.png";
// import featuredProducts10 from "../Components/Assets/featured-product10.png";
// import featuredProducts11 from "../Components/Assets/featured-product11.png";
// import featuredProducts12 from "../Components/Assets/featured-product12.png";
// import "./TopRatedAndBestSeller.css";

// const TopRatedAndBestSeller = () => {
//   const topRatedProducts = [
//     {
//       id: 5,
//       name: "Beauty Facial Cleanser",
//       price: "$12.00",
//       image: featuredProducts5,
//     },
//     {
//       id: 6,
//       name: "Moisturizing Cream",
//       price: "$14.00",
//       image: featuredProducts6,
//     },
//     {
//       id: 7,
//       name: "Tote Bag High Quality",
//       price: "$20.00",
//       image: featuredProducts7,
//     },
//     {
//       id: 8,
//       name: "Smart Watch Bluetooth",
//       price: "$150.00",
//       image: featuredProducts8,
//     },
//     {
//       id: 9,
//       name: "Women Smart Watch",
//       originalPrice: "$550.00",
//       price: "$495.00",
//       discount: "-$55.00",
//       image: featuredProducts9,
//     },
//     {
//       id: 10,
//       name: "Samsung S24 Ultra",
//       price: "$1,150.00",
//       image: featuredProducts10,
//     },
//     {
//       id: 11,
//       name: "Gaming Headset",
//       price: "$79.99",
//       image: featuredProducts11,
//     },
//     {
//       id: 12,
//       name: "Wireless Earbuds",
//       price: "$129.00",
//       image: featuredProducts12,
//     },
//   ];
//   return (
//     <div className="main-container">
//       <div className="best-Seller">
//         <div className="BestSellerTop">
//           <p>Best Seller</p>
//           <button>View All</button>
//         </div>
//       </div>
//       <div className="top-Rated">
//         <div className="TopRatedTop">
//           <p>Top Rated</p>
//           <button>View All</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopRatedAndBestSeller;
