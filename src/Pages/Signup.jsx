import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Import useSelector
import { register, fetchUser } from "../slices/authSlice";
import "./Signup.css";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
} from "react-bootstrap"; // Import Alert
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth); // Get loading and error states

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "", // Assuming backend expects a phone_number field if used
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
    // Clear password mismatch error when typing
    if (name === "password" || name === "confirmPassword") {
      setPasswordMismatchError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordMismatchError(""); // Clear any previous mismatch error

    console.log("Signup: Form data submitted:", formData);

    const {
      email,
      password,
      firstName,
      lastName,
      confirmPassword,
      phoneNumber,
      referCode,
    } = formData;

    // Client-side validation for password match
    if (password !== confirmPassword) {
      setPasswordMismatchError("Passwords do not match!");
      console.log("Signup: Passwords do not match.");
      return;
    }

    // Client-side validation for terms and conditions
    if (!formData.agreeToTerms) {
      alert("You must agree to the Terms and Conditions to sign up.");
      console.log("Signup: Terms and conditions not agreed.");
      return;
    }

    // Prepare payload for registration, matching backend's expected fields
    const registrationPayload = {
      username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}`, // Example: if backend expects username
      email: email,
      password: password,
      first_name: firstName,
      last_name: lastName,
      password_confirmation: confirmPassword,
      // Only include phone_number if it's required by the backend and provided
      ...(phoneNumber && { phone_number: phoneNumber }),
      // Only include refer_code if it's required by the backend and provided
      ...(referCode && { refer_code: referCode }),
    };

    console.log(
      "Signup: Dispatching register action with payload:",
      registrationPayload
    );

    const success = await dispatch(register(registrationPayload));

    if (success) {
      console.log("Signup: Registration successful, navigating to home.");
      // No need to call fetchUser here, as register now dispatches setUser
      navigate("/");
    } else {
      console.log("Signup: Registration failed.");
      // Error message will be displayed by the Alert component
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <h2 className="text-center mb-4 signup-title">Sign Up</h2>
        <div className="signup-card">
          <Form onSubmit={handleSubmit}>
            {/* Display error messages */}
            {passwordMismatchError && (
              <Alert variant="danger">{passwordMismatchError}</Alert>
            )}
            {error && <Alert variant="danger">{error}</Alert>}

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
                    // Consider if phone number is always required by backend
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label className="required-label">Password</Form.Label>
                  <div className="password-input-group">
                    <Form.Control
                      type="password"
                      placeholder="Minimum 8 characters long"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <Form.Label className="required-label">
                    Confirm Password
                  </Form.Label>
                  <div className="password-input-group">
                    <Form.Control
                      type="password"
                      placeholder="Minimum 8 characters long"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength={8}
                    />
                  </div>
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

            <div className="text-center my-3">
              <span className="or-continue-with">Or continue with</span>
            </div>

            <div className="d-flex justify-content-center social-buttons">
              <Button variant="light" className="social-button me-3">
                <img
                  src="https://img.icons8.com/color/48/000000/google-logo.png"
                  alt="Google"
                  width="24"
                  height="24"
                  className="me-2"
                />
              </Button>
              <Button variant="light" className="social-button">
                <img
                  src="https://img.icons8.com/color/48/000000/facebook-new.png"
                  alt="Facebook"
                  width="24"
                  height="24"
                  className="me-2"
                />
              </Button>
            </div>

            <p className="text-center mt-3 font-size-14 extraText">
              Already have account? <a href="/login">Sign in</a>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
