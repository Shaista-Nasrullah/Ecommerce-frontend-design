import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../slices/authSlice";
import "./Signup.css";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    referCode: "",
    agreeToTerms: false,
  });
  const [passwordMismatchError, setPasswordMismatchError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "password" || name === "confirmPassword") {
      setPasswordMismatchError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordMismatchError("");

    const {
      password,
      confirmPassword,
      agreeToTerms,
      firstName,
      lastName,
      email,
      phoneNumber,
      referCode,
    } = formData;

    // --- Client-side validation ---
    if (password !== confirmPassword) {
      setPasswordMismatchError("Passwords do not match!");
      toast.error("Passwords do not match!");
      return;
    }

    if (!agreeToTerms) {
      toast.warn("You must agree to the Terms and Conditions to sign up.");
      return;
    }

    const registrationPayload = {
      username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
      email: email,
      password: password,
      first_name: firstName,
      last_name: lastName,
      password_confirmation: confirmPassword,
      ...(phoneNumber && { phone_number: phoneNumber }),
      ...(referCode && { refer_code: referCode }),
    };

    try {
      // Dispatch the action and .unwrap() to handle the promise
      await dispatch(register(registrationPayload)).unwrap();

      // --- Success Notification ---
      toast.success("Registration successful! Welcome.");
      navigate("/"); // Navigate to home or dashboard
    } catch (error) {
      // --- Error Notification ---
      // This block now reliably catches errors thrown from the async thunk
      const errorMessage =
        error.message || "Registration failed. Please check your details.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <h2 className="text-center mb-4 signup-title">Sign Up</h2>
        <div className="signup-card">
          <Form onSubmit={handleSubmit}>
            {passwordMismatchError && (
              <Alert variant="danger">{passwordMismatchError}</Alert>
            )}

            {/* Form fields remain the same */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formFirstName">
                  <Form.Label className="required-label">First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ex: John"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formLastName">
                  <Form.Label className="required-label">Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ex: Doe"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label className="required-label">
                    Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formPhoneNumber">
                  <Form.Label className="required-label">
                    Phone Number
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter phone number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label className="required-label">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Minimum 8 characters long"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <Form.Label className="required-label">
                    Confirm Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Minimum 8 characters long"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={8}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group
              className="mb-3 refer-code-group"
              controlId="formReferCode"
            >
              <Form.Label>
                Refer Code <small>(Optional)</small>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Use referral code"
                name="referCode"
                value={formData.referCode}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formTermsAndConditions">
              <Form.Check
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                required
                label={
                  <>
                    I agree to Your <a href="#terms">Terms and condition</a>
                  </>
                }
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button
                variant="primary"
                type="submit"
                className="signup-button"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign up"}
              </Button>
            </div>
            {/* Social buttons and other elements remain the same */}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
