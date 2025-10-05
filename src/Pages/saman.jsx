import React, { useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import "./productDetails.css";
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

const Saman = () => {
  const [quantity, setQuantity] = useState(1);
  const pricePerItem = 32.0; // Assuming this is the base price

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity((prevQty) => prevQty + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prevQty) => prevQty - 1);
    }
  };

  return (
    <Container className="product-detail-page mt-4 mb-4">
      <Row className="g-4">
        {/* Main Product Column */}
        <Col lg={9}>
          <Card className="product-main-card mb-4">
            <Card.Body className="d-flex flex-column flex-md-row">
              <div className="product-image-section me-md-4 mb-4 mb-md-0">
                <div className="main-image-wrapper mb-3">
                  <img
                    src={lipstickImage}
                    alt="lipstick"
                    className="img-fluid"
                  />
                </div>
                <div className="thumbnail-images d-flex justify-content-center gap-2">
                  <div className="thumbnail-wrapper">
                    <img
                      src={lipstickImage}
                      alt="lipstick thumbnail"
                      className="img-fluid"
                    />
                  </div>
                  <div className="thumbnail-wrapper">
                    <img
                      src={lipstickImage1}
                      alt="lipstick thumbnail 1"
                      className="img-fluid"
                    />
                  </div>
                  <div className="thumbnail-wrapper">
                    <img
                      src={lipstickImage2}
                      alt="lipstick thumbnail 2"
                      className="img-fluid"
                    />
                  </div>
                </div>
              </div>

              <div className="product-info-section">
                <h2>Beauty Jelly Lipstick</h2>
                <div className="d-flex align-items-center mb-3 text-muted small">
                  <p className="mb-0 me-2">
                    <span className="fw-bold text-color">2</span> Orders
                  </p>
                  <p className="mb-0 mx-2">|</p>
                  <p className="mb-0">
                    <span className="fw-bold text-color">0</span> WishListed
                  </p>
                </div>
                <p className="product-price fs-4 fw-bold mb-3">
                  ${pricePerItem.toFixed(2)}
                </p>

                <div className="d-flex align-items-center mb-4">
                  <p className="mb-0 me-3 fw-bold">Qty:</p>
                  <div className="quantity-control d-flex border border-primary rounded">
                    <Button
                      variant="light"
                      className="quantity-btn"
                      onClick={() => handleQuantityChange("decrement")}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </Button>
                    <span className="quantity-display px-3 py-2">
                      {quantity}
                    </span>
                    <Button
                      variant="light"
                      className="quantity-btn"
                      onClick={() => handleQuantityChange("increment")}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                  </div>
                </div>

                <div className="total-price-display mb-4">
                  <strong className="fs-5 me-2">Total Price:</strong>
                  <span className="fs-5 fw-bold text-color">
                    ${(pricePerItem * quantity).toFixed(2)}
                  </span>
                </div>

                <div className="d-flex flex-wrap gap-2">
                  <Button variant="warning" className="buy-now-btn">
                    Buy now
                  </Button>
                  <Button variant="primary" className="add-to-cart-btn">
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline-secondary"
                    className="wishlist-btn d-flex align-items-center gap-1"
                  >
                    <FontAwesomeIcon icon={faHeart} /> 0
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Description Section */}
          <Card className="description-card p-4">
            <h2 className="mb-3 fs-5 fw-bold">Detail Description</h2>
            <h3 className="fs-6 fw-bold mt-3">Product Description:</h3>
            <p>
              Add a touch of vibrant color and hydration with the Beauty Jelly
              Lipstick, a unique, color-changing formula that adjusts to your
              lip's natural pH for a personalized shade. Infused with nourishing
              ingredients, it keeps your lips soft, smooth, and moisturized
              while giving a glossy, natural finish.
            </p>
            <h3 className="fs-6 fw-bold mt-3">Specifications:</h3>
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
            <h3 className="fs-6 fw-bold mt-3">Key Features:</h3>
            <ul>
              <li>Moisturizing formula that keeps lips hydrated all day.</li>
            </ul>
          </Card>
        </Col>

        {/* Side Column (Delivery, More From Store) */}
        <Col lg={3}>
          <div className="delivery-info-card mb-4">
            <p className="mb-2 text-muted small info">
              Fast Delivery all across the country
            </p>
            <p className="mb-2 text-muted small">Safe Payment</p>
            <p className="mb-2 text-muted small">7 Days Return Policy</p>
            <p className="mb-0 text-muted small">100% Authentic Products</p>
          </div>

          <div className="more-from-store-card">
            <div className="d-flex justify-content-between align-items-center">
              <p className="mb-0 fw-bold">More From The Store</p>
              <Button variant="link" className="p-0">
                View all
              </Button>
            </div>
            <div>
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
                      {/* {product.rating && (
                        <div className="fd-product-rating">
                          <span className="fd-star-icon">⭐️</span>
                          <span className="fd-rating-value">
                            {product.rating}
                          </span>
                          <span className="fd-reviews-count">
                            {product.reviews}
                          </span>
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>

      {/* Similar Products Section */}
      <Row className="mt-5">
        <Col xs={12}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="fs-4 fw-bold mb-0">Similar products</h2>
            <Button variant="link" className="p-0">
              View All
            </Button>
          </div>
          <Row xs={2} sm={3} md={4} lg={6} className="g-3">
            {featuredProducts.map((product) => (
              <Col key={product.id}>
                <Card className="h-100 product-card-similar text-center">
                  <Card.Img
                    variant="top"
                    src={product.image}
                    alt={product.name}
                    className="img-fluid p-3"
                  />
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <Card.Text className="mb-1">{product.name}</Card.Text>
                    <Card.Text className="fw-bold text-primary">
                      {product.price}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Saman;
