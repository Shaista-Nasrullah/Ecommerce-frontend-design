import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import "./ProductDetail.css";
import lipstickImage from "../Components/Assets/lipstick.webp";
import lipstickImage1 from "../Components/Assets/lipstick1.webp";
import lipstickImage2 from "../Components/Assets/lipstick2.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faHeart } from "@fortawesome/free-solid-svg-icons";
import featuredProducts1 from "../Components/Assets/featured-product1.png";
import featuredProducts2 from "../Components/Assets/featured-product2.png";
import featuredProducts3 from "../Components/Assets/featured-product3.png";
import featuredProducts4 from "../Components/Assets/featured-product4.png";
import featuredProducts5 from "../Components/Assets/featured-product5.png";
import featuredProducts6 from "../Components/Assets/featured-product6.png";
import featuredProducts7 from "../Components/Assets/featured-product7.png";
import featuredProducts8 from "../Components/Assets/featured-product8.png";

import featuredProducts9 from "../Components/Assets/featured-product9.png";
import featuredProducts10 from "../Components/Assets/featured-product10.png";
import featuredProducts11 from "../Components/Assets/featured-product11.png";
import featuredProducts12 from "../Components/Assets/featured-product12.png";

const LatestProducts = [
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
const featuredProducts = [
  {
    id: 5,
    name: "Beauty Facial Cleanser",
    slug: "beauty-facial-cleanser",
    price: "$12.00",
    image: featuredProducts5,
  },
  {
    id: 6,
    name: "Moisturizing Cream",
    slug: "moisturizing-cream",
    price: "$14.00",
    image: featuredProducts6,
  },
  {
    id: 7,
    name: "Tote Bag High Quality",
    slug: "tote-bag-high-quality",
    price: "$20.00",
    image: featuredProducts7,
  },
  {
    id: 8,
    name: "Smart Watch Bluetooth",
    slug: "smart-watch-bluetooth",
    price: "$150.00",
    image: featuredProducts8,
  },
  {
    id: 9,
    name: "Women Smart Watch",
    slug: "women-smart-watch",
    originalPrice: "$550.00",
    price: "$495.00",
    discount: "-$55.00",
    image: featuredProducts9,
  },
  {
    id: 10,
    name: "Samsung S24 Ultra",
    slug: "samsung-s24-ultra",
    price: "$1,150.00",
    image: featuredProducts10,
  },
  {
    id: 11,
    name: "Gaming Headset",
    slug: "gaming-headset",
    price: "$79.99",
    image: featuredProducts11,
  },
  {
    id: 12,
    name: "Wireless Earbuds",
    slug: "wireless-earbuds",
    price: "$129.00",
    image: featuredProducts12,
  },
];

const ProductDetail = () => {
  return (
    <>
      <div className="productDetailContainer">
        <div className="first-column">
          <div className="first-box">
            <div className="PDproduct-image-container">
              <div className="PDimage-container">
                <img src={lipstickImage} alt="lipstick" />
              </div>
              <div className="images-below">
                <div className="firstImage">
                  <img src={lipstickImage} alt="lipstick" />
                </div>
                <div className="secondImage">
                  <img src={lipstickImage1} alt="lipstick" />
                </div>
                <div className="thirdImage">
                  <img src={lipstickImage2} alt="lipstick" />
                </div>
              </div>
            </div>
            <div className="ProductDetailInfo">
              <h2>Beauty Jelly Lipstick</h2>
              <div className="orderAndWishlistContainer">
                <p className="main">
                  <span className="figuresOfOrdersAndWishListed">2</span> Orders
                </p>
                <p className="pipe">|</p>
                <p className="main">
                  <span className="figuresOfOrdersAndWishListed">0</span>{" "}
                  WishListed
                </p>
              </div>
              <div className="PDproductPrice">$32.00</div>
              <div className="quantityContainer">
                <p className="Qty">Qty</p>
                <div className="QtyIncreaseDecrease">
                  <div className="iconStyle">
                    <FontAwesomeIcon icon={faMinus} />{" "}
                  </div>
                  {/* Use FontAwesomeIcon */}
                  <div className="quantity">1</div>

                  <div className="iconStyle">
                    <FontAwesomeIcon icon={faPlus} />{" "}
                  </div>
                  {/* Use FontAwesomeIcon */}
                </div>
              </div>
              <div className="totalPrice">
                <div className="PDproductPrice">
                  <strong className="text">Total Price: </strong> $32.00
                </div>
              </div>
              <div className="buttons">
                <button className="buyNowBtn">Buy now</button>
                <button className="addToCartBtn">Add to Cart</button>
                <button className="wishListBtn"> 0</button>
              </div>
            </div>
          </div>

          <div className="description-section">
            <h2>Detail Description</h2>

            <h3>Product Description:</h3>
            <p>
              Add a touch of vibrant color and hydration with the Beauty Jelly
              Lipstick, a unique, color-changing formula that adjusts to your
              lip's natural pH for a personalized shade. Infused with nourishing
              ingredients, it keeps your lips soft, smooth, and moisturized
              while giving a glossy, natural finish.
            </p>

            <h3>Specifications:</h3>
            <ul>
              <li>
                Formula: Jelly texture, pH-responsive color-changing technology.
              </li>
              <li>
                Ingredients: Enriched with Vitamin E and natural oils for
                hydration.
              </li>
              <li>Finish: Glossy, sheer, and natural look.</li>
              <li>Fragrance: Light floral scent.</li>
              <li>
                Packaging: Clear, sleek tube with a flower encased in the
                lipstick.
              </li>
              <li>
                Usage: Suitable for daily wear, perfect for subtle and natural
                makeup looks.
              </li>
            </ul>

            <h3>Key Features:</h3>
            <ul>
              <li>Moisturizing formula that keeps lips hydrated all day.</li>
            </ul>
          </div>
        </div>

        <div className="second-column">
          <div className="firstSection">
            <p>Fast Delivery all across the country</p>
            <p>Safe Payment</p>
            <p>7 Days Return Policy</p>
            <p>100% Authentic Products</p>
          </div>
          <div className="sideProducts">
            <div className="sideProductsInitial">
              <p>More From Te Store</p> <button>View all</button>
            </div>
            {LatestProducts.map((product) => (
              <div key={product.id} className="fd-product-card">
                {/* <div className="fd-discount-tag">{product.discount}</div> */}
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="similarProducts">
        <h2 className="product-display-section-title mt-5">
          Similar products{" "}
          <Button variant="link" className="product-display-view-all-button">
            View All
          </Button>
        </h2>
        <div className="productsContainer">
          {featuredProducts.map((product) => (
            <div key={product.id} className="product-display-product-card-row2">
              <div className="product-display-product-image-wrapper">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-display-product-info">
                <p>{product.name}</p>
                <p>{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
