import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Modal,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { Trash, CreditCard, CheckCircleFill } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import axios from "axios";
import ProfileSidebar from "../Components/ProfileSidebar.jsx";
import "./PaymentMethods.css";
import "react-toastify/dist/ReactToastify.css";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PaymentMethods = () => {
  const token = useSelector((state) => state.auth.token);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);

  // This initial state matches your API spec
  const initialFormData = {
    type: "card",
    provider_name: "",
    account_name: "",
    account_number: "",
    cvc: "",
    expiry_month: "",
    expiry_year: "",
    paypal_email: "",
    wallet_number: "", // Used for various wallet types
    is_default: false,
    status: "inactive",
    meta: null,
  };

  const [formData, setFormData] = useState(initialFormData);

  // --- API CALLS ---
  const fetchPaymentMethods = async () => {
    setIsFetching(true);
    setFetchError(null);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/user/payment-methods`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPaymentMethods(response.data || []);
    } catch (err) {
      const errorMsg = "Failed to load payment methods.";
      setFetchError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPaymentMethods();
    }
  }, [token]);

  const handleDelete = async (methodId) => {
    if (!window.confirm("Are you sure you want to remove this payment method?"))
      return;
    try {
      await axios.delete(
        `${API_BASE_URL}/api/user/payment-methods/${methodId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Payment method removed successfully!");
      fetchPaymentMethods();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove method.");
    }
  };

  const handleSetDefault = async (methodId) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/user/payment-method/set-default/${methodId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Default payment method updated!");
      fetchPaymentMethods();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not set as default.");
    }
  };

  // POST a new payment method
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Create a payload with only the necessary fields for the selected type
    const payload = {
      type: formData.type,
      is_default: formData.is_default,
    };

    if (formData.type === "card") {
      payload.provider_name = formData.provider_name;
      payload.account_name = formData.account_name;
      payload.account_number = formData.account_number;
      payload.cvc = formData.cvc;
      payload.expiry_month = formData.expiry_month;
      payload.expiry_year = formData.expiry_year;
    } else if (formData.type === "paypal") {
      payload.paypal_email = formData.paypal_email;
    } else if (["wallet", "easypaisa", "jazzcash"].includes(formData.type)) {
      payload.wallet_number = formData.wallet_number;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/user/payment-methods`,
        payload, // Send the cleaned payload
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(response.data.message || "New payment method added!");
      fetchPaymentMethods();
      handleCloseModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- MODAL & FORM HANDLERS ---
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData(initialFormData);
  };
  const handleShowModal = () => setShowModal(true);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // --- RENDER FUNCTIONS ---
  const renderPaymentMethods = () => {
    if (isFetching) {
      return (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      );
    }
    if (fetchError) {
      return <Alert variant="danger">{fetchError}</Alert>;
    }
    if (!paymentMethods || paymentMethods.length === 0) {
      return (
        <div className="text-center my-5">
          <h5>No Payment Methods Found!</h5>
        </div>
      );
    }

    const maskIdentifier = (method) => {
      switch (method.type) {
        case "card":
          return `**** **** **** ${method.account_number.slice(-4)}`;
        case "paypal":
          return method.paypal_email;
        case "wallet":
        case "easypaisa":
        case "jazzcash":
          return method.wallet_number;
        default:
          return "N/A";
      }
    };

    return paymentMethods.map((method) => (
      <Card
        key={method.id}
        className={`mb-3 shadow-sm payment-method-card ${
          method.is_default ? "default-card" : ""
        }`}
      >
        <Card.Body>
          <Row>
            <Col xs={8}>
              <h6 className="mb-2 text-capitalize">
                <CreditCard className="me-2" />
                {method.provider_name || method.type}
              </h6>
              <p className="mb-1 card-number">{maskIdentifier(method)}</p>
              {method.type === "card" && (
                <p className="mb-0 text-muted small">
                  Expires: {method.expiry_month}/{method.expiry_year}
                </p>
              )}
            </Col>
            <Col xs={4} className="text-end">
              {method.is_default ? (
                <div className="text-success fw-bold">
                  <CheckCircleFill className="me-1" /> Default
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => handleSetDefault(method.id)}
                >
                  Set as Default
                </Button>
              )}
              <Button
                variant="link"
                className="p-1 mt-2"
                onClick={() => handleDelete(method.id)}
              >
                <Trash size={20} className="text-danger" />
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    ));
  };

  return (
    <>
      <Container className="mt-4">
        <Row>
          <Col md={3}>
            <ProfileSidebar />
          </Col>
          <Col md={9}>
            <div className="profile-container">
              <Card.Header className="d-flex justify-content-between align-items-center bg-white mb-3">
                <h5 className="mb-0">My Payment Methods</h5>
                <Button variant="primary" onClick={handleShowModal}>
                  Add New Method
                </Button>
              </Card.Header>
              <Card.Body>{renderPaymentMethods()}</Card.Body>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Add New Method Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Payment Method</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleFormSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Payment Type</Form.Label>
              <Form.Select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="card">Card</option>
                <option value="paypal">PayPal</option>
                <option value="easypaisa">EasyPaisa</option>
                <option value="jazzcash">JazzCash</option>
                <option value="wallet">Wallet</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>

            {/* == Card Fields == */}
            {formData.type === "card" && (
              <>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Card Provider</Form.Label>
                      <Form.Control
                        type="text"
                        name="provider_name"
                        placeholder="e.g., Visa, Mastercard"
                        value={formData.provider_name}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Cardholder Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="account_name"
                        value={formData.account_name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Card Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_number"
                    value={formData.account_number}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>CVC</Form.Label>
                  <Form.Control
                    type="text"
                    name="cvc"
                    value={formData.cvc}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Expiry Month (MM)</Form.Label>
                      <Form.Control
                        type="text"
                        name="expiry_month"
                        value={formData.expiry_month}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Expiry Year (YYYY)</Form.Label>
                      <Form.Control
                        type="text"
                        name="expiry_year"
                        value={formData.expiry_year}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}

            {/* == PayPal Field == */}
            {formData.type === "paypal" && (
              <Form.Group className="mb-3">
                <Form.Label>PayPal Email</Form.Label>
                <Form.Control
                  type="email"
                  name="paypal_email"
                  placeholder="Enter your PayPal email address"
                  value={formData.paypal_email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            )}

            {/* == Wallet Fields == */}
            {(formData.type === "wallet" ||
              formData.type === "easypaisa" ||
              formData.type === "jazzcash") && (
              <Form.Group className="mb-3">
                <Form.Label>Wallet Number / ID</Form.Label>
                <Form.Control
                  type="text"
                  name="wallet_number"
                  placeholder="Enter your wallet number or ID"
                  value={formData.wallet_number}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            )}

            <hr />

            <Form.Check
              type="checkbox"
              label="Set as default payment method"
              name="is_default"
              checked={formData.is_default}
              onChange={handleChange}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Add Method"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default PaymentMethods;
