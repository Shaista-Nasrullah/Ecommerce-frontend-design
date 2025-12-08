// ProductDetail.js - MODIFIED

import React, { useEffect, useContext, useState } from "react";
import { Container, Button } from "react-bootstrap";
import "./ProductDetail.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { AppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const navigate = useNavigate();
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };
  const {
    fetchProductById,
    latests,
    wishlist,
    addToWishlist,
    removeFromWishlist,
  } = useContext(AppContext);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const getProductDetails = async () => {
      if (!productId) {
        setError(new Error("No product ID provided."));
        setLoading(false);
        console.log("No product ID provided.");
        return;
      }

      const fetchedData = await fetchProductById(
        productId,
        setLoading,
        setError
      );

      if (fetchedData && fetchedData.mainProduct) {
        setProduct(fetchedData.mainProduct);
        setSimilarProducts(fetchedData.similarProducts || []); // Set similar products
        // In a real app, you would also fetch and check if this product is in the user's wishlist
        // and set setIsInWishlist(true) if it is.
      } else {
        setProduct(null);
        setSimilarProducts([]);
        console.log("Failed to load product details or similar products.");
      }
    };

    getProductDetails();
  }, [productId, fetchProductById, dispatch, user]);

  const handleToggleWishlist = async () => {
    if (!product) return;
    setIsWishlistLoading(true);

    const variationId = product.variations?.[0]?.id;
    if (!variationId && !isInWishlist) {
      // Only need variationId for adding
      toast.error("Cannot find product variation.");
      setIsWishlistLoading(false);
      return;
    }

    if (isInWishlist) {
      const wishlistItem = wishlist.find(
        (item) => item.product.id === product.id
      );
      if (wishlistItem) {
        await removeFromWishlist(token, wishlistItem.id);
      } else {
        toast.error("Could not find item in wishlist to remove.");
      }
    } else {
      await addToWishlist(token, product.id, variationId);
    }

    setIsWishlistLoading(false);
  };

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

  const productPrice =
    product.variations && product.variations.length > 0
      ? parseFloat(product.variations[0].default_sell_price)
      : 0;

  const handleAddToCart = () => {
    console.log("handleAddToCart called!");
    console.log("Product object when adding to cart:", product);

    if (!product) {
      console.error(
        "Attempted to add item to cart, but 'product' is null or undefined."
      );
      toast.error("Error: Product details not loaded. Cannot add to cart.");
      return;
    }

    // Ensure variations exist and get the first one
    const firstVariation = product.variations?.[0];

    if (!firstVariation) {
      console.error("No variations found for the product. Cannot add to cart.");
      toast.error("Error: Product variations not found. Cannot add to cart.");
      return;
    }

    const priceToUse = parseFloat(firstVariation.default_sell_price);
    const variationId = firstVariation.id;
    const categoryName = product.category?.name || null; // Get category name, or null if not available

    console.log("Dispatching addToCart with:", {
      id: product.id,
      product_id: product.id,
      variation_id: variationId,
      name: product.name,
      unit_price: priceToUse,
      unitPrice: priceToUse,
      image: product.feature_image,
      quantity: quantity,
      category: categoryName,
      item_tax: 0,
      tax_id: 0,
      unit_price_inc_tax: priceToUse,
      discount_amount: 0,
      totalPrice: (priceToUse * quantity).toFixed(2),
    });

    dispatch(
      addToCart({
        id: product.id,
        product_id: product.id,
        variation_id: variationId,
        name: product.name,
        unit_price: priceToUse,
        unitPrice: priceToUse,
        image: product.feature_image,
        quantity: quantity,
        category: categoryName,
        item_tax: 0,
        tax_id: 0,
        unit_price_inc_tax: priceToUse,
        discount_amount: 0,
        totalPrice: (priceToUse * quantity).toFixed(2),
      })
    );
    toast.success(
      `"${quantity} x ${product.name}" has been added to your cart!`
    );
  };

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity((prevQty) => prevQty + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prevQty) => prevQty - 1);
    }
  };

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
                  <span className="figuresOfOrdersAndWishListed">0</span> Orders
                </p>
                <p className="pipe">|</p>
                <p className="main">
                  <span className="figuresOfOrdersAndWishListed">0</span>{" "}
                  WishListed
                </p>
              </div>
              <div className="PDproductPrice">
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
                <button className="buyNowBtn">Buy now</button>
                <button className="addToCartBtn" onClick={handleAddToCart}>
                  Add to Cart
                </button>
                <button
                  className={`wishListBtn ${isInWishlist ? "in-wishlist" : ""}`}
                  onClick={handleToggleWishlist}
                  disabled={!user || isWishlistLoading}
                >
                  {/* Use correct classes for filled/unfilled heart */}
                  <i
                    className={
                      isInWishlist ? "bi bi-heart-fill" : "bi bi-heart"
                    }
                  ></i>
                </button>
              </div>
            </div>
          </div>

          <div className="description-section">
            <h2>Detail Description</h2>
            {product.description ? (
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            ) : (
              <>
                <h3>Product Description:</h3>
                <p>
                  Add a touch of vibrant color and hydration with the Beauty
                  Jelly Lipstick, a unique, color-changing formula that adjusts
                  to your lip's natural pH for a personalized shade. Infused
                  with nourishing ingredients, it keeps your lips soft, smooth,
                  and moisturized while giving a glossy, natural finish.
                </p>
                <h3>Specifications:</h3>
                <ul>
                  <li>
                    Formula: Jelly texture, pH-responsive color-changing
                    technology.
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
                    Usage: Suitable for daily wear, perfect for subtle and
                    natural makeup looks.
                  </li>
                </ul>
                <h3>Key Features:</h3>
                <ul>
                  <li>
                    Moisturizing formula that keeps lips hydrated all day.
                  </li>
                </ul>
              </>
            )}
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
              <p>More From The Store</p>
              <button>View all</button>
            </div>
            {latests.map((simProduct) => (
              <div
                key={simProduct.id}
                className="pd-product-card"
                onClick={() => handleProductClick(simProduct.id)}
              >
                <div className="pd-product-card-content">
                  <div className="pd-product-image-wrapper">
                    <img
                      src={simProduct.feature_image}
                      alt={simProduct.name}
                      className="pd-product-image"
                    />
                  </div>
                  <div className="pd-product-info">
                    <h3 className="pd-product-name">{simProduct.name}</h3>
                    <div className="pd-price-details">
                      <span className="pd-discounted-price">
                        PKR{" "}
                        {simProduct.variations &&
                        simProduct.variations.length > 0
                          ? parseFloat(
                              simProduct.variations[0].default_sell_price
                            ).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {similarProducts.length === 0 && (
              <p className="text-center mt-3">No similar products found.</p>
            )}
          </div>
        </div>
      </div>
      <div className="similarProducts">
        <h2 className="product-display-section-title">
          Similar products{" "}
          <Button variant="link" className="product-display-view-all-button">
            View All
          </Button>
        </h2>
        <div className="pd-productsContainer">
          {similarProducts.map((simProduct) => (
            <div
              key={simProduct.id}
              className="pd-product-card-row-2"
              onClick={() => handleProductClick(simProduct.id)}
            >
              <div className="pd-image-wrapper">
                <img src={simProduct.feature_image} alt={simProduct.name} />
              </div>
              <div className="pd-product-info cursor-pointer">
                <p>{simProduct.name}</p>
                <p>
                  PKR{" "}
                  {simProduct.variations && simProduct.variations.length > 0
                    ? parseFloat(
                        simProduct.variations[0].default_sell_price
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
          ))}
          {similarProducts.length === 0 && (
            <p className="text-center mt-3">
              No similar products found in this section.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
