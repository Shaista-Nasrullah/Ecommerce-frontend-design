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
  const subTotal = totalAmount;
  const tax = subTotal * taxRate;
  const totalWithTax = subTotal + tax + shippingCost;

  const handleRemoveOneFromCart = (productId) => {
    // Dispatch the specific action to decrement quantity or remove if quantity is 1
    dispatch(decrementItemQuantity(productId));
  };

  const handleAddOneToCart = (productId) => {
    // Dispatch the specific action to increment quantity
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
                {/* Simplified shop-section header for individual items if not grouping by actual shop */}
                {/* You might adjust this if you have actual 'categories' or 'shops' associated with cart items */}
                <div className="shop-title">
                  <input type="checkbox" checked readOnly />
                  <span>Product Category (Placeholder)</span>{" "}
                  {/* Placeholder, adjust if you have category data in your cart item */}
                  <FiAlertCircle className="alert-icon" />
                </div>
                <div className="cart-item-card">
                  <div className="item-details">
                    <input type="checkbox" checked readOnly />
                    <img
                      src={item.image}
                      alt={item.name}
                      className="item-image"
                    />
                    <div className="item-info">
                      <p className="item-name">{item.name}</p>
                      {/* <p className="item-variant">Variant : White</p> If your product object has variant data */}
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
                  {/* This needs to be dynamic based on your logic */}
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
              <span>- PKR 0.00</span> {/* Implement discount logic if needed */}
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
          {/* <div className="action-item cart">
            <Link to="/cart">
              {" "}
              <i className="fa fa-shopping-cart"></i>
              <span className="badge">0</span>{" "}
            </Link>
          </div> */}

          <button className="proceed-to-checkout-btn">
            <Link to="/checkout">Proceed to Checkout</Link>
          </button>
          {cartItems.length > 0 && ( // Show clear cart button only if items exist
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
