import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../slices/authSlice";
import "./Login.css";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      // Dispatch the login action
      await dispatch(
        login({
          email,
          password,
        })
      ).unwrap(); // .unwrap() to handle success/failure from thunk
      navigate("/"); // Navigate to home or dashboard on successful login
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed! Please check your credentials."); // Basic error feedback
    }
  };
  return (
    <div className="login-container">
      <div className="login-header">
        <div className="user-icon-circle mx-auto mb-3">
          <i className="bi bi-person-circle login-user-icon"></i>{" "}
        </div>
        <h6>Sign In</h6>
        <div className="login-card-custom">
          <div className="left-section-custom">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formEmailOrPhone">
                <Form.Label className="required-label">
                  Email / Phone
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter email or phone"
                  name="email"
                  value={formData.emailOrPhone}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label className="required-label">Password</Form.Label>
                <div className="password-input-group">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <span
                    className="password-toggle-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i
                      className={`bi ${
                        showPassword ? "bi-eye" : "bi-eye-slash"
                      }`}
                    ></i>
                  </span>
                </div>
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <Form.Group controlId="formRememberMe" className="mb-0">
                  <Form.Check
                    type="checkbox"
                    label="Remember me"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                </Form.Group>
                <a href="#forgot-password" className="forgot-password-link">
                  Forgot password?
                </a>
              </div>

              <div className="login-button-wrapper d-grid gap-2 mb-4">
                <Button type="submit" className="login-button">
                  Sign In
                </Button>
              </div>
            </Form>
          </div>
          <div className="or-divider-wrapper ">
            <span className="or-text">Or Sign in with</span>
          </div>
          <div className="right-section-custom">
            <div className="social-login-buttons-wrapper">
              <Button variant="light" className="social-button mb-3 ">
                <img
                  src="https://img.icons8.com/color/48/000000/google-logo.png"
                  alt="Google"
                  width="24"
                  height="24"
                  className="me-2"
                />
                Google
              </Button>
              <Button variant="light" className="social-button mb-3">
                <img
                  src="https://img.icons8.com/color/48/000000/facebook-new.png"
                  alt="Facebook"
                  width="24"
                  height="24"
                  className="me-2"
                />
                Facebook
              </Button>
            </div>

            <p className="text-center mt-3 mb-0 signup-link-text">
              Enjoy New experience <a href="/signup">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
