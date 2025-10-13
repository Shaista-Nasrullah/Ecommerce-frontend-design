import React, { useState } from "react";
import "./CheckoutPage.css"; // Import the CSS file
import logo from "../Components/Assets/logo-in-nav.png";
import boughtProduct from "../Components/Assets/DealOfTheDay.png";
import { useSelector } from "react-redux"; // Import Redux hooks to get cart data
import { Link } from "react-router-dom";

const CheckoutPage = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod"); // Default to Cash on Delivery

  // Fetch cart items and summary data from Redux store
  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  const handlePaymentChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  // Calculate summary values based on cart data
  const taxRate = 0.15; // 15% tax example, should be consistent with MyCart.jsx
  const shippingCost = 250; // Example, could be dynamic. Using a placeholder here.
  const subTotal = totalAmount; // This comes directly from the cart totalAmount
  const tax = subTotal * taxRate;
  const totalWithTax = subTotal + tax + shippingCost;

  return (
    <div className="checkout-container">
      <div className="checkout-form-section">
        <div className="contact-section">
          <div className="section-header">
            <h3>Contact</h3>
            <span className="log-in">Log in</span>
          </div>
          <input
            type="text"
            placeholder="Email or mobile phone number"
            className="input-field"
          />
          <label className="checkbox-container">
            Send me news & offers on Email/SMS/Whatsapp
            <input type="checkbox" />
            <span className="checkmark"></span>
          </label>
        </div>

        <div className="delivery-section">
          <h3>Delivery</h3>
          <input
            type="text"
            placeholder="Country/Region"
            className="input-field"
          />
          <input type="text" placeholder="Full name" className="input-field" />
          <input type="text" placeholder="Address" className="input-field" />
          <div className="city-postal-row">
            <input
              type="text"
              placeholder="City"
              className="input-field city-input"
            />
            <input
              type="text"
              placeholder="Postal code (optional)"
              className="input-field postal-input"
            />
          </div>
          <input type="text" placeholder="Phone" className="input-field" />
          <label className="checkbox-container">
            Text me with news and offers
            <input type="checkbox" />
            <span className="checkmark"></span>
          </label>
        </div>

        <div className="shipping-method-section">
          <h3>Shipping method</h3>
          <div className="shipping-option selected">
            <label className="radio-container">
              Standard Shipping
              <input type="radio" name="shipping" defaultChecked />
              <span className="radiomark"></span>
            </label>
            <span className="shipping-price">
              Rs {shippingCost.toLocaleString()}.00
            </span>
          </div>
        </div>

        <div className="payment-section">
          <h3>Payment</h3>
          <p className="secure-text">
            All transactions are secure and encrypted.
          </p>

          <div
            className={`payment-option ${
              selectedPaymentMethod === "cod" ? "selected" : ""
            }`}
          >
            <label className="radio-container">
              Cash on Delivery (COD)
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={selectedPaymentMethod === "cod"}
                onChange={handlePaymentChange}
              />
              <span className="radiomark"></span>
            </label>
            <button
              className="pay-cod-button"
              disabled={selectedPaymentMethod !== "cod"}
            >
              PAY CASH ON DELIVERY
            </button>
          </div>

          <div
            className={`payment-option ${
              selectedPaymentMethod === "jazzcash" ? "selected" : ""
            }`}
          >
            <label className="radio-container">
              Jazz Cash / Easy Paisa
              <input
                type="radio"
                name="payment"
                value="jazzcash"
                checked={selectedPaymentMethod === "jazzcash"}
                onChange={handlePaymentChange}
              />
              <span className="radiomark"></span>
            </label>
          </div>
          {selectedPaymentMethod === "jazzcash" && (
            <div className="payment-details-form">
              <p>Please transfer the amount to the following details:</p>
              <p>
                <strong>Account Name:</strong> Matrina's Boutique
              </p>
              <p>
                <strong>JazzCash / EasyPaisa Number:</strong> 0300-1234567
              </p>
              <p>
                <strong>Reference Code (Optional):</strong> Your Order ID will
                be sent via email.
              </p>
              <p>
                After transfer, please share a screenshot of the transaction
                with us on WhatsApp for confirmation.
              </p>
            </div>
          )}

          <div
            className={`payment-option ${
              selectedPaymentMethod === "bank" ? "selected" : ""
            }`}
          >
            <label className="radio-container">
              Bank Deposit
              <input
                type="radio"
                name="payment"
                value="bank"
                checked={selectedPaymentMethod === "bank"}
                onChange={handlePaymentChange}
              />
              <span className="radiomark"></span>
            </label>
          </div>
          {selectedPaymentMethod === "bank" && (
            <div className="payment-details-form">
              <p>Please deposit the amount to the following bank account:</p>
              <p>
                <strong>Bank Name:</strong> ABC Bank Ltd.
              </p>
              <p>
                <strong>Account Title:</strong> Matrina's Traditional Boutique
              </p>
              <p>
                <strong>Account Number:</strong> 0123-456789012345
              </p>
              <p>
                <strong>IBAN:</strong> PKXXABCYXXXXXXXXXXXXXXXXXXXX
              </p>
              <p>
                Once deposited, please email us the deposit slip or transaction
                reference.
              </p>
            </div>
          )}
        </div>

        <button className="complete-order-btn">Complete order</button>

        <div className="footer-links">
          <a href="#refund">Refund policy</a>
          <a href="#shipping">Shipping policy</a>
          <a href="#privacy">Privacy policy</a>
          <a href="#terms">Terms of service</a>
          <a href="#contact">Contact information</a>
        </div>
      </div>

      <div className="checkout-summary-section">
        <Link to="/" className="store-logo-link" aria-label="Go to homepage">
          <div className="store-logo">
            <img src={logo} alt="Ecom Store Logo" />
            <h3 className="ecom-name">6Valley</h3>
          </div>
        </Link>
        {/* <a className="store-logo-link" aria-label="Go to homepage">
          <div className="store-logo">
            <img src={logo} alt="Ecom Store Logo" />
            <h3 className="ecom-name">6Valley</h3>
          </div>
        </a> */}

        {cartItems.length === 0 ? (
          <p className="text-center mt-4">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item-summary">
              <div className="item-details">
                <img src={item.image} alt={item.name} className="item-image" />
                <span className="item-name">
                  {item.name} x {item.quantity}
                </span>
              </div>
              <span className="item-price">
                PKR{" "}
                {item.totalPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          ))
        )}

        <div className="summary-details">
          <div className="summary-row">
            <span>Subtotal ({totalQuantity} items)</span>
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
            <span className="total-amount">
              PKR{" "}
              {totalWithTax.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
