import React from "react";
import "./MyCart.css";
import { FaTruck } from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux"; // Import Redux hooks
import {
  clearCart,
  incrementItemQuantity,
  decrementItemQuantity,
} from "../slices/cartSlice"; // Import actions
import { Link } from "react-router-dom";

const MyCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  console.log("MyCart.jsx rendered!");
  console.log("Current cartItems in MyCart:", cartItems);
  console.log("Current totalQuantity in MyCart:", totalQuantity);
  console.log("Current totalAmount in MyCart:", totalAmount);

  // You might need to adjust tax/shipping based on your actual business logic
  const taxRate = 0.15; // 15% tax example
  const shippingCost = 0; // Example, could be dynamic

  // Calculate total tax and discount from cart items
  const totalCartTax = cartItems.reduce(
    (sum, item) => sum + (item.item_tax || 0),
    0
  );
  const totalCartDiscount = cartItems.reduce(
    (sum, item) => sum + (item.discount_amount || 0),
    0
  );

  const subTotal = totalAmount; // totalAmount already sums up item.totalPrice
  const tax = subTotal * taxRate; // This is a general cart-level tax, might conflict with item.item_tax
  // If `item.item_tax` represents the tax *per item*, and `totalCartTax` is the sum,
  // then your `tax` calculation here might be redundant or need adjustment based on business rules.
  // For now, I'll keep your original `tax` calculation using `taxRate`.
  // If `item.item_tax` should be the *only* tax, you'd use `totalCartTax` here.

  const totalWithTax = subTotal + tax + shippingCost; // Using the general tax calculation

  const handleRemoveOneFromCart = (productId) => {
    dispatch(decrementItemQuantity(productId));
  };

  const handleAddOneToCart = (productId) => {
    dispatch(incrementItemQuantity(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className="cart-page-wrapper">
      <div className="cart-container">
        <div className="cart-items-section">
          <h3>Shopping cart ({totalQuantity} items)</h3>
          <div className="cart-header">
            <div className="product-header">
              <p>Product</p>
            </div>
            <div className="cart-menu">
              <p>Unit Price</p>
              <p>Qty</p>
              <p>Total</p>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <p className="text-center mt-4">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="shop-section">
                <div className="shop-title">
                  <span>Product Category: {item?.category || "N/A"}</span>{" "}
                  {/* Display actual category */}
                  <FiAlertCircle className="alert-icon" />
                </div>
                <div className="cart-item-card">
                  <div className="item-details">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="item-image"
                    />
                    <div className="item-info">
                      <p className="item-name">{item.name}</p>
                      {/* You can add more details here */}
                      {item.variation_id && (
                        <p className="item-variant">
                          Variation ID: {item.variation_id}
                        </p>
                      )}
                      {item.product_id && (
                        <p className="item-product-id">
                          Product ID: {item.product_id}
                        </p>
                      )}
                      {item.item_tax > 0 && (
                        <p className="item-tax">
                          Item Tax: PKR{" "}
                          {item.item_tax.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      )}
                      {item.discount_amount > 0 && (
                        <p className="item-discount">
                          Discount: -PKR{" "}
                          {item.discount_amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="item-price-quantity-total">
                    <p className="item-unit-price">
                      PKR{" "}
                      {item.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <div className="quantity-control">
                      <button onClick={() => handleRemoveOneFromCart(item.id)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleAddOneToCart(item.id)}>
                        +
                      </button>
                    </div>
                    <p className="item-total">
                      PKR{" "}
                      {item.totalPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
                <div className="delivery-info">
                  <FaTruck className="delivery-icon" />
                  <span>Free Delivery</span>{" "}
                  <span className="free-delivery-text">
                    Add more for free delivery
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-summary-section">
          <div className="summary-card">
            <div className="summary-row">
              <span>Sub total</span>
              <span>
                PKR{" "}
                {subTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>
                PKR{" "}
                {shippingCost.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="summary-row">
              <span>Discount on product</span>
              <span>
                - PKR{" "}
                {totalCartDiscount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>{" "}
              {/* Display total cart discount */}
            </div>
            <div className="summary-row">
              <span>Tax ({taxRate * 100}%)</span>
              <span>
                PKR{" "}
                {tax.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <span>
                PKR{" "}
                {totalWithTax.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          <button className="proceed-to-checkout-btn">
            <Link to="/checkout">Proceed to Checkout</Link>
          </button>
          {cartItems.length > 0 && (
            <button
              className="proceed-to-checkout-btn mt-2"
              onClick={handleClearCart}
            >
              Clear Cart
            </button>
          )}

          <div className="continue-shopping-link">
            <span>&lt;</span>
            <span>Continue Shopping</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCart;
