import React, { useEffect, useContext, useState } from "react";
import { Container, Button } from "react-bootstrap";
import "./ProductDetail.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
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
import { AppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice"; // Import addToCart action

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
  const { fetchProductById } = useContext(AppContext);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch(); // Initialize useDispatch
  const [quantity, setQuantity] = useState(1); // State for quantity on product detail page

  useEffect(() => {
    const getProductDetails = async () => {
      if (!productId) {
        setError(new Error("No product ID provided."));
        setLoading(false);
        // toast.error("Invalid product URL.");
        console.log("No product ID provided.");
        return;
      }

      const fetchedProduct = await fetchProductById(
        productId,
        setLoading,
        setError
      );
      if (fetchedProduct) {
        setProduct(fetchedProduct);
      } else {
        // fetchProductById already sets an error, but ensure product is null if fetch fails
        setProduct(null);
        console.log("Failed to load product details.");
        // toast.error("Failed to load product details.");
      }
    };

    getProductDetails();
  }, [productId, fetchProductById]);

  if (loading) {
    return (
      <Container className="product-detail-page mt-5">
        <p className="text-center">Loading product details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="product-detail-page mt-5">
        <p className="text-center text-danger">
          Error: {error.message}. Please try again later.
        </p>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="product-detail-page mt-5">
        <p className="text-center">Product not found.</p>
      </Container>
    );
  }

  // Determine the price to send to cart
  const productPrice =
    product.variations && product.variations.length > 0
      ? parseFloat(product.variations[0].default_sell_price)
      : 0; // Default to 0 if no variations/price

  const handleAddToCart = () => {
    console.log("handleAddToCart called!");
    console.log("Product object when adding to cart:", product);

    if (!product) {
      console.error(
        "Attempted to add item to cart, but 'product' is null or undefined."
      );
      alert("Error: Product details not loaded. Cannot add to cart.");
      return; // Stop execution if product is not available
    }

    // Use the actual product price derived from variations, not a hardcoded value.
    // Ensure `productPrice` is correctly populated based on your API response.
    // If variations can have different prices, you might need to select one.
    // For now, assuming `productPrice` is the correct single unit price.
    const priceToUse = productPrice; // Use the dynamically determined productPrice

    console.log("Dispatching addToCart with:", {
      id: product.id,
      name: product.name,
      price: priceToUse, // Use the correct unit price
      image: product.feature_image,
      quantity: quantity, // Pass the selected quantity
    });

    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: priceToUse,
        image: product.feature_image,
        quantity: quantity, // Pass the selected quantity from state
      })
    );
    alert(`${quantity} x ${product.name} added to cart!`);
  };

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity((prevQty) => prevQty + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prevQty) => prevQty - 1);
    }
  };

  // Total price calculation for display on product detail page
  const displayedTotalPrice = (productPrice * quantity).toFixed(2);

  return (
    <>
      <div className="productDetailContainer">
        <div className="first-column">
          <div className="first-box">
            <div className="PDproduct-image-container">
              <div className="PDimage-container">
                <img src={product.feature_image} alt={product.name} />
              </div>
              <div className="images-below">
                {/* Assuming these are additional images for the current product */}
                <div className="firstImage">
                  <img src={product.feature_image} alt="product thumbnail" />
                </div>
                <div className="secondImage">
                  <img src={product.feature_image} alt="product thumbnail" />
                </div>
                <div className="thirdImage">
                  <img src={product.feature_image} alt="product thumbnail" />
                </div>
              </div>
            </div>
            <div className="ProductDetailInfo">
              <h2>{product.name}</h2>
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
              <div className="PDproductPrice">
                {" "}
                {product.variations && product.variations.length > 0
                  ? `PKR ${productPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : "N/A"}
              </div>
              <div className="quantityContainer">
                <p className="Qty">Qty</p>
                <div className="QtyIncreaseDecrease">
                  <div
                    className="iconStyle"
                    onClick={() => handleQuantityChange("decrement")}
                  >
                    <FontAwesomeIcon icon={faMinus} />{" "}
                  </div>
                  <div className="quantity">{quantity}</div>
                  <div
                    className="iconStyle"
                    onClick={() => handleQuantityChange("increment")}
                  >
                    <FontAwesomeIcon icon={faPlus} />{" "}
                  </div>
                </div>
              </div>
              <div className="totalPrice">
                <div className="PDproductPrice">
                  <strong className="text">Total Price: </strong> PKR{" "}
                  {parseFloat(displayedTotalPrice).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
              <div className="buttons">
                {/* You might want to pass the current quantity to addToCart here as well if you want it to add that specific quantity */}
                <button className="buyNowBtn">Buy now</button>
                <button className="addToCartBtn" onClick={handleAddToCart}>
                  Add to Cart
                </button>
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
