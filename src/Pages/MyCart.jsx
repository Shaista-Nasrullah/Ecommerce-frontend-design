import React from "react";
import "./MyCart.css";
import { FaTruck } from "react-icons/fa"; // FaShieldAlt, FaUndo, FaCheckCircle are removed
import { FiAlertCircle } from "react-icons/fi";
import bohemianteeShirt from "../Components/Assets/lipstick.webp";
import copperRing from "../Components/Assets/featured-product10.png";

const MyCart = () => {
  return (
    <div className="cart-page-wrapper">
      <div className="cart-container">
        <div className="cart-items-section">
          <h3>Shopping cart</h3>
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

          {/* Shop 1: Evvalley CMS */}
          <div className="shop-section">
            <div className="shop-title">
              <input type="checkbox" checked readOnly />
              <span>Category Name</span>
              <FiAlertCircle className="alert-icon" />
            </div>
            <div className="cart-item-card">
              <div className="item-details">
                <input type="checkbox" checked readOnly />
                <img
                  src={bohemianteeShirt}
                  alt="Bohemiantee Shirt Tops"
                  className="item-image"
                />
                <div className="item-info">
                  <p className="item-name">Bohemiantee Shirt Tops</p>
                  <p className="item-variant">Variant : White</p>
                </div>
              </div>
              <div className="item-price-quantity-total">
                <p className="item-unit-price">$22.00</p>
                <div className="quantity-control">
                  <button>-</button>
                  <span>7</span>
                  <button>+</button>
                </div>
                <p className="item-total">$154.00</p>
              </div>
            </div>
            <div className="delivery-info">
              <FaTruck className="delivery-icon" />
              <span>$846.00</span>
              <span className="free-delivery-text">
                Add more for free delivery
              </span>
            </div>
          </div>

          {/* Shop 2: Bicycle Shop */}
          <div className="shop-section">
            <div className="shop-title">
              <input type="checkbox" checked readOnly />
              <span>Category Name</span>
            </div>
            <div className="cart-item-card">
              <div className="item-details">
                <input type="checkbox" checked readOnly />
                <img
                  src={copperRing}
                  alt="Copper Alloy Inlaid Zircon Round Ring Female"
                  className="item-image"
                />
                <div className="item-info">
                  <p className="item-name">
                    Copper Alloy Inlaid Zircon Round Ring Female
                  </p>
                </div>
              </div>
              <div className="item-price-quantity-total">
                <p className="item-unit-price">$9.00</p>
                <div className="quantity-control">
                  <button>-</button>
                  <span>6</span>
                  <button>+</button>
                </div>
                <p className="item-total">$54.00</p>
              </div>
            </div>
            <div className="delivery-info">
              <FaTruck className="delivery-icon" />
              <span>$846.00</span>
              <span className="free-delivery-text">
                Add more for free delivery
              </span>
            </div>
          </div>
        </div>

        <div className="cart-summary-section">
          <div className="summary-card">
            <div className="summary-row">
              <span>Sub total</span>
              <span>$382.00</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>$0.00</span>
            </div>
            <div className="summary-row">
              <span>Discount on product</span>
              <span>- $0.00</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>$57.30</span>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <span>$439.30</span>
            </div>
          </div>

          {/* Guarantee Section Removed */}

          <button className="proceed-to-checkout-btn">
            Proceed to Checkout
          </button>
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
