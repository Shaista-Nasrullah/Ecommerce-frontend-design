import React, { useState, useEffect } from "react";
import "./CheckoutPage.css";
import logo from "../Components/Assets/logo-in-nav.png";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { clearCart } from "../slices/cartSlice";
import { Modal, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- Redux State ---
  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const isLoggedIn = useSelector((state) => state.auth.user);
  const userToken = useSelector((state) => state.auth.token);

  // --- Component State for Form Fields ---
  const [shippingAddress, setShippingAddress] = useState({
    countryRegion: "",
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isFetchingAddresses, setIsFetchingAddresses] = useState(false);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [isFetchingShippingMethods, setIsFetchingShippingMethods] =
    useState(false);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [isFetchingPaymentOptions, setIsFetchingPaymentOptions] =
    useState(false);
  const [isShippingMethodsOpen, setIsShippingMethodsOpen] = useState(false);
  const [selectedPaymentMethodDetails, setSelectedPaymentMethodDetails] =
    useState([]);
  const [
    isFetchingSelectedPaymentMethodDetails,
    setIsFetchingSelectedPaymentMethodDetails,
  ] = useState(false);
  const [selectedPaymentDetailId, setSelectedPaymentDetailId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address_line_1: "",
    city: "",
    postal_code: "",
    country: "",
    type: "shipping",
    is_default: "no",
  });

  // --- useEffect to fetch Shipping Methods ---
  useEffect(() => {
    const fetchShippingMethods = async () => {
      setIsFetchingShippingMethods(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/shipping-methods`,
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
        const activeShippingMethods = response.data.methods.filter(
          (method) => method.is_active
        );
        setShippingMethods(activeShippingMethods);

        // Set the first active shipping method as default if available
        if (activeShippingMethods.length > 0) {
          setSelectedShippingMethod(activeShippingMethods[0]);
        }
      } catch (error) {
        console.error("Failed to fetch shipping methods:", error);
        // Optionally show an alert to the user
      } finally {
        setIsFetchingShippingMethods(false);
      }
    };

    if (userToken) {
      fetchShippingMethods();
    }
  }, [userToken]);

  // --- Handler for Shipping Method Change ---
  const handleShippingMethodChange = (method) => {
    setSelectedShippingMethod(method);
  };

  // --- useEffect to fetch initial payment options (Credit Card, PayPal, COD etc.) ---
  useEffect(() => {
    const fetchPaymentOptions = async () => {
      setIsFetchingPaymentOptions(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/payment-options`,
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
        const activeOptions = response.data.filter(
          (option) => option.is_active
        );
        setPaymentOptions(activeOptions);

        // Set the first active payment method as default if available
        if (activeOptions.length > 0) {
          setSelectedPaymentMethod(activeOptions[0].code); // Set the 'code' here
        }
      } catch (error) {
        console.error("Failed to fetch payment options:", error);
        // Optionally show an alert to the user
      } finally {
        setIsFetchingPaymentOptions(false);
      }
    };

    if (userToken) {
      fetchPaymentOptions();
    }
  }, [userToken]); // Re-run if userToken changes

  // --- useEffect to fetch specific data for the SELECTED payment method (e.g., saved cards for 'card') ---
  useEffect(() => {
    const fetchSpecificPaymentMethodDetails = async () => {
      if (selectedPaymentMethod && userToken) {
        // These are payment methods that might have user-specific saved details
        const paymentMethodsRequiringDetails = [
          "card",
          "paypal",
          "wallet",
          // "cod" doesn't typically have saved user-specific details to fetch
        ];

        if (paymentMethodsRequiringDetails.includes(selectedPaymentMethod)) {
          setIsFetchingSelectedPaymentMethodDetails(true);
          setSelectedPaymentMethodDetails([]); // Clear previous data
          setSelectedPaymentDetailId(null); // Clear previous selection

          try {
            // Dynamically constructing the URL using selectedPaymentMethod (which holds the 'code')
            const response = await axios.get(
              `${API_BASE_URL}/api/user/payment-methods/${selectedPaymentMethod}`,
              { headers: { Authorization: `Bearer ${userToken}` } }
            );

            if (response.data && response.data.data) {
              setSelectedPaymentMethodDetails(response.data.data);
              // Auto-select the first item if available
              if (response.data.data.length > 0) {
                setSelectedPaymentDetailId(response.data.data[0].id);
              }
            } else {
              setSelectedPaymentMethodDetails([]);
            }
          } catch (error) {
            console.error(
              `Failed to fetch ${selectedPaymentMethod} details:`,
              error
            );
            setSelectedPaymentMethodDetails([]);
            // Optionally, show an alert to the user
          } finally {
            setIsFetchingSelectedPaymentMethodDetails(false);
          }
        } else {
          // For payment methods that don't require fetching user-specific details (e.g., COD, or if a method is not in paymentMethodsRequiringDetails)
          setSelectedPaymentMethodDetails([]);
          setSelectedPaymentDetailId(null);
        }
      } else {
        setSelectedPaymentMethodDetails([]);
        setSelectedPaymentDetailId(null);
      }
    };

    fetchSpecificPaymentMethodDetails();
  }, [selectedPaymentMethod, userToken]); // Re-run when selectedPaymentMethod or userToken changes

  // --- Fetch Saved Addresses on Component Mount ---
  useEffect(() => {
    const fetchAddresses = async () => {
      if (isLoggedIn && userToken) {
        setIsFetchingAddresses(true);
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/user/addresses/all`,
            { headers: { Authorization: `Bearer ${userToken}` } }
          );
          setSavedAddresses(response.data);

          // Find and auto-select the default address
          const defaultAddress = response.data.find((addr) => addr.is_default);
          if (defaultAddress) {
            handleSelectAddress(defaultAddress);
          }
        } catch (error) {
          console.error("Failed to fetch addresses:", error);
          alert("Could not load your saved addresses. Please try again later.");
        } finally {
          setIsFetchingAddresses(false);
        }
      }
    };

    fetchAddresses();
  }, [isLoggedIn, userToken]);

  // --- Handlers ---
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (code) => {
    setSelectedPaymentMethod(code); // Updates selectedPaymentMethod with the 'code' of the parent method (e.g., 'card', 'paypal')
  };

  const handleSelectAddress = (address) => {
    setSelectedAddressId(address.id);
    setShippingAddress({
      countryRegion: address.country,
      fullName: address.name,
      address: address.address_line_1,
      city: address.city,
      postalCode: address.postal_code || "",
      phone: address.phone,
    });
  };

  const handleNewAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "yes" : "no") : value,
    }));
  };

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    setIsAddingAddress(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/user/address/add`,
        newAddress,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const newlyAddedAddress = response.data.address;
      setSavedAddresses([...savedAddresses, newlyAddedAddress]);
      handleSelectAddress(newlyAddedAddress);
      setShowAddressModal(false);
      setNewAddress({
        name: "",
        phone: "",
        address_line_1: "",
        city: "",
        postal_code: "",
        country: "",
        type: "shipping",
        is_default: "no",
      });
    } catch (error) {
      console.error("Failed to add new address:", error);
      alert(
        "Failed to add new address. " +
          (error.response?.data?.message || "Please try again.")
      );
    } finally {
      setIsAddingAddress(false);
    }
  };

  // Handler for selecting a specific item within a payment method (e.g., a specific card)
  const handleSelectPaymentDetail = (detailId) => {
    setSelectedPaymentDetailId(detailId);
  };

  // --- Place Order Function ---
  const handlePlaceOrder = async () => {
    // Basic validation
    if (
      !shippingAddress.fullName ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.phone ||
      !shippingAddress.countryRegion
    ) {
      alert("Please select or fill in a complete delivery address.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // Determine the selected shipping method's ID
    const selectedShippingMethodId = selectedShippingMethod
      ? selectedShippingMethod.id
      : null;
    if (!selectedShippingMethodId) {
      alert("Please select a shipping method.");
      return;
    }

    // Determine the selected payment option's ID
    const selectedPaymentOption = paymentOptions.find(
      (opt) => opt.code === selectedPaymentMethod
    );
    const selectedPaymentOptionId = selectedPaymentOption
      ? selectedPaymentOption.id
      : null;

    if (!selectedPaymentOptionId) {
      alert("Please select a payment method.");
      return;
    }

    const paymentOptionObject = {
      id: selectedPaymentOption.id,
      code: selectedPaymentOption.code,
    };

    // Construct the final order payload
    const payload = {
      products: cartItems.map((item) => ({
        product_id: item.id,
        variation_id: item.variation_id || null,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        unit_price_inc_tax: item.price,
        item_tax: 0,
        tax_id: 0,
        discount_amount: item.discount || 0,
        image: item.image,
        totalPrice: item.totalPrice,
      })),
      item_tax: 0,
      tax_id: 0,
      discount_amount: 0,
      tax_rate_id: 0,
      discount_type: "fixed",
      subtotal: parseFloat(subTotal.toFixed(2)),
      shipping_cost: parseFloat(shippingCost.toFixed(2)),
      tax_amount: parseFloat(tax.toFixed(2)),
      final_total: parseFloat(grandTotal.toFixed(2)),
      sale_note: "",
      is_direct_sale: 0,
      shipping_address_id:
        isLoggedIn && selectedAddressId ? selectedAddressId : null,
      shipping_method_id: selectedShippingMethodId,
      payment_method_id: selectedPaymentOptionId,
      payment_option: paymentOptionObject,
      // Pass the specific payment detail ID if one is selected
      // This is crucial for distinguishing between saved cards/Paypal accounts
      selected_payment_detail_id: selectedPaymentDetailId,
    };

    if (!isLoggedIn || !selectedAddressId) {
      payload.shipping_address = {
        name: shippingAddress.fullName,
        phone: shippingAddress.phone,
        address_line_1: shippingAddress.address,
        city: shippingAddress.city,
        postal_code: shippingAddress.postalCode,
        country: shippingAddress.countryRegion,
        type: "shipping",
        is_default: "no",
      };
      delete payload.shipping_address_id; // Remove if sending full address object
    }

    const headers = { "Content-Type": "application/json" };
    if (isLoggedIn && userToken) {
      headers["Authorization"] = `Bearer ${userToken}`;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/user/orders/online`,
        payload,
        { headers }
      );
      if (response.status === 201 || response.status === 200) {
        alert("Order placed successfully!");
        dispatch(clearCart());
        navigate(`/order-confirmation/${response.data.orderId || "success"}`);
      }
    } catch (error) {
      console.error(
        "Error placing order:",
        error.response?.data || error.message
      );
      alert(
        "Failed to place order. " +
          (error.response?.data?.message || "Please try again.")
      );
    }
  };

  // --- Calculations ---
  const taxRate = 0; // Assuming a fixed tax rate for now

  // Calculate shipping cost based on selectedShippingMethod
  const shippingCost = selectedShippingMethod
    ? parseFloat(selectedShippingMethod.cost)
    : 0;

  const subTotal = totalAmount;
  const tax = subTotal * taxRate;
  const grandTotal = subTotal + tax + shippingCost;

  const formattedShippingCost = shippingCost.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formattedTax = tax.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formattedSubTotal = subTotal.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formattedGrandTotal = grandTotal.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // --- Render Helper Functions ---
  const renderAddressSelection = () => (
    <>
      {isFetchingAddresses ? (
        <div className="text-center my-4">
          <Spinner animation="border" />
        </div>
      ) : savedAddresses.length > 0 ? (
        <div className="saved-addresses-list">
          {savedAddresses.map((address) => (
            <div
              key={address.id}
              className={`address-option ${
                selectedAddressId === address.id ? "selected" : ""
              }`}
              onClick={() => handleSelectAddress(address)}
            >
              <label className="radio-container-left">
                {" "}
                {/* Changed to radio-container-left */}
                <input
                  type="radio"
                  name="deliveryAddress"
                  value={address.id}
                  checked={selectedAddressId === address.id}
                  onChange={() => handleSelectAddress(address)}
                />
                <span className="radiomark"></span>
                <span className="address-details">
                  {" "}
                  {/* This span wraps the address info */}
                  {address.address_line_1}
                  {address.is_default === 1 && (
                    <span className="default-badge">Default</span>
                  )}
                </span>
              </label>
            </div>
          ))}
        </div>
      ) : (
        <Alert variant="info" className="mt-3">
          No saved addresses found. Please add one.
        </Alert>
      )}
      {/* The "Add New Address" button is now in the main return's Delivery section header */}
    </>
  );

  const renderGuestAddressForm = () => (
    <>
      <input
        type="text"
        placeholder="Country/Region"
        className="input-field"
        name="countryRegion"
        value={shippingAddress.countryRegion}
        onChange={handleShippingChange}
        required
      />
      <input
        type="text"
        placeholder="Full name"
        className="input-field"
        name="fullName"
        value={shippingAddress.fullName}
        onChange={handleShippingChange}
        required
      />
      <input
        type="text"
        placeholder="Address"
        className="input-field"
        name="address"
        value={shippingAddress.address}
        onChange={handleShippingChange}
        required
      />
      <div className="city-postal-row">
        <input
          type="text"
          placeholder="City"
          className="input-field city-input"
          name="city"
          value={shippingAddress.city}
          onChange={handleShippingChange}
          required
        />
        <input
          type="text"
          placeholder="Postal code (optional)"
          className="input-field postal-input"
          name="postalCode"
          value={shippingAddress.postalCode}
          onChange={handleShippingChange}
        />
      </div>
      <input
        type="text"
        placeholder="Phone"
        className="input-field"
        name="phone"
        value={shippingAddress.phone}
        onChange={handleShippingChange}
        required
      />
    </>
  );

  return (
    <>
      <div className="checkout-container">
        {/* Left Section: Form */}
        <div className="checkout-form-section">
          {/* Delivery Section */}
          <div className="delivery-section">
            <div className="add-address-header">
              <h3>Delivery</h3>
              {isLoggedIn && (
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setShowAddressModal(true)}
                >
                  + Add new address
                </Button>
              )}
            </div>
            {isLoggedIn ? renderAddressSelection() : renderGuestAddressForm()}
          </div>

          {/* Shipping Method Section */}
          <div className="shipping-method-section">
            <div
              className="shipping-method-header"
              onClick={() => setIsShippingMethodsOpen(!isShippingMethodsOpen)}
            >
              <h3>Choose Shipping method</h3>
              <span
                className={`arrow-icon ${isShippingMethodsOpen ? "open" : ""}`}
              >
                &#9660; {/* Down arrow character */}
              </span>
            </div>
            {isFetchingShippingMethods ? (
              <div className="text-center my-4">
                <Spinner animation="border" size="sm" /> Loading shipping
                methods...
              </div>
            ) : shippingMethods.length === 0 ? (
              <Alert variant="info" className="mt-3">
                No shipping methods available.
              </Alert>
            ) : (
              <div
                className={`shipping-methods-list-wrapper ${
                  isShippingMethodsOpen ? "open" : ""
                }`}
              >
                <div className="shipping-methods-list">
                  {shippingMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`shipping-option-item ${
                        selectedShippingMethod?.id === method.id
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => {
                        handleShippingMethodChange(method);
                        setIsShippingMethodsOpen(false); // Close after selection
                      }}
                    >
                      <label className="radio-container-left">
                        <input
                          type="radio"
                          name="shipping"
                          value={method.id}
                          checked={selectedShippingMethod?.id === method.id}
                          onChange={() => handleShippingMethodChange(method)} // Still needed for radio button functionality
                        />
                        <span className="radiomark"></span>
                        <span className="method-details">
                          <span className="method-name">
                            {method.name} - {method.description}
                          </span>
                          <span className="shipping-price">
                            Rs{" "}
                            {parseFloat(method.cost).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                            .00
                          </span>
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Payment Section - REFACTORED */}
          <div className="payment-section">
            <h3>Payment</h3>
            <p className="secure-text">
              All transactions are secure and encrypted.
            </p>

            {isFetchingPaymentOptions ? (
              <div className="text-center my-4">
                <Spinner animation="border" size="sm" /> Loading payment
                methods...
              </div>
            ) : paymentOptions.length > 0 ? (
              <div className="payment-options-group">
                {paymentOptions.map((option) => (
                  <div key={option.id} className="payment-group-item">
                    <label
                      className={`radio-container payment-method-parent ${
                        selectedPaymentMethod === option.code ? "selected" : ""
                      }`}
                    >
                      {option.name}
                      <input
                        type="radio"
                        name="primaryPaymentMethod" // Use a distinct name for the parent radio group
                        value={option.code}
                        checked={selectedPaymentMethod === option.code}
                        onChange={() => handlePaymentMethodChange(option.code)}
                      />
                      <span className="radiomark"></span>
                    </label>

                    {/* Render saved details if this payment method is selected AND has details */}
                    {selectedPaymentMethod === option.code &&
                      selectedPaymentMethodDetails.length > 0 && (
                        <div className="saved-payment-details-list ps-4 pt-2 pb-2">
                          {isFetchingSelectedPaymentMethodDetails ? (
                            <div className="text-center my-2">
                              <Spinner animation="border" size="sm" /> Loading
                              details...
                            </div>
                          ) : (
                            selectedPaymentMethodDetails.map((detail) => (
                              <label
                                key={detail.id}
                                className={`radio-container-left sub-payment-detail ${
                                  selectedPaymentDetailId === detail.id
                                    ? "selected"
                                    : ""
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="specificPaymentDetail" // Use a distinct name for the child radio group
                                  value={detail.id}
                                  checked={
                                    selectedPaymentDetailId === detail.id
                                  }
                                  onChange={() =>
                                    handleSelectPaymentDetail(detail.id)
                                  }
                                />
                                <span className="radiomark"></span>
                                <div className="detail-text">
                                  <div className="selected-cards">
                                    {option.code === "card" && (
                                      <>
                                        {detail.account_name} (****{" "}
                                        {detail.account_number.slice(-4)})
                                        <br />
                                        Expires: {detail.expiry_month}/
                                        {detail.expiry_year}
                                      </>
                                    )}
                                  </div>
                                  <div className="selected-cards">
                                    {option.code === "paypal" && (
                                      <>
                                        PayPal:{" "}
                                        {detail.paypal_email || detail.name}
                                      </>
                                    )}
                                  </div>

                                  {option.code === "wallet" && (
                                    <>
                                      Wallet ID: {detail.wallet_id || detail.id}{" "}
                                      (Balance: {detail.balance || "N/A"})
                                    </>
                                  )}
                                  {/* Add more conditions for other payment method types if they have saved user details */}
                                </div>
                              </label>
                            ))
                          )}
                          {/* Optionally, add a button to 'Add New Card' or 'Link PayPal Account' here */}
                          <div className="add-new-payment-detail mt-2">
                            <Button variant="outline-secondary" size="sm">
                              + Add New{" "}
                              {
                                paymentOptions.find(
                                  (opt) => opt.code === option.code
                                )?.name
                              }
                            </Button>
                          </div>
                        </div>
                      )}

                    {/* For payment methods that don't have saved details but are selected */}
                    {selectedPaymentMethod === option.code &&
                      selectedPaymentMethodDetails.length === 0 &&
                      !isFetchingSelectedPaymentMethodDetails &&
                      // Exclude 'cod' or other methods that truly have no sub-options
                      !["cod", "jazzcash"].includes(option.code) && (
                        <div className="no-saved-details-message ps-4 pt-2 pb-2">
                          <Alert variant="info" className="my-0 py-2">
                            No saved {option.name} accounts. You can add one.
                            <Button variant="link" size="sm" className="ms-2">
                              Add New {option.name}
                            </Button>
                          </Alert>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            ) : (
              <Alert variant="info" className="mt-3">
                No payment methods available.
              </Alert>
            )}
          </div>
          <button className="complete-order-btn" onClick={handlePlaceOrder}>
            Complete order
          </button>
          <div className="footer-links">
            <a href="#refund">Refund policy</a>
            <a href="#shipping">Shipping policy</a>
            <a href="#privacy">Privacy policy</a>
            <a href="#terms">Terms of service</a>
          </div>
        </div>

        {/* Right Section: Order Summary */}
        <div className="checkout-summary-section">
          <Link to="/" className="store-logo-link" aria-label="Go to homepage">
            <div className="store-logo">
              <img src={logo} alt="Ecom Store Logo" />
              <h3 className="ecom-name">6Valley</h3>
            </div>
          </Link>
          {cartItems.length === 0 ? (
            <p className="text-center mt-4">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item-summary">
                <div className="item-details">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="item-image"
                  />
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
              <span>PKR {formattedSubTotal}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>PKR {formattedShippingCost}</span>
            </div>
            <div className="summary-row">
              <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
              <span>PKR {formattedTax}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <span className="total-amount">PKR {formattedGrandTotal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Address Modal */}
      <Modal
        show={showAddressModal}
        onHide={() => setShowAddressModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Address</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddNewAddress}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Contact Person Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newAddress.name}
                onChange={handleNewAddressChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone *</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={newAddress.phone}
                onChange={handleNewAddressChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address *</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="address_line_1"
                value={newAddress.address_line_1}
                onChange={handleNewAddressChange}
                required
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>City *</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={newAddress.city}
                    onChange={handleNewAddressChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Zip code</Form.Label>
                  <Form.Control
                    type="text"
                    name="postal_code"
                    value={newAddress.postal_code}
                    onChange={handleNewAddressChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Country *</Form.Label>
              <Form.Control
                type="text"
                name="country"
                value={newAddress.country}
                onChange={handleNewAddressChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Set as default address"
                name="is_default"
                checked={newAddress.is_default === "yes"}
                onChange={handleNewAddressChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowAddressModal(false)}
            >
              Close
            </Button>
            <Button variant="primary" type="submit" disabled={isAddingAddress}>
              {isAddingAddress ? (
                <Spinner as="span" animation="border" size="sm" />
              ) : (
                "Save Address"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default CheckoutPage;
