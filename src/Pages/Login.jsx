import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../slices/authSlice";
import "./Login.css";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // 1. Import toast

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      // 2. Dispatch the login action and use .unwrap()
      await dispatch(login({ email, password })).unwrap();

      // 3. Show success toast on successful login
      toast.success("Login successful! Welcome back.");
      navigate("/"); // Navigate to home or dashboard
    } catch (error) {
      // 4. Show error toast on failure
      const errorMessage =
        error.message || "Login failed! Please check your credentials.";
      toast.error(errorMessage);
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="user-icon-circle mx-auto mb-3">
          <i className="bi bi-person-circle login-user-icon"></i>
        </div>
        <h6>Sign In</h6>
        <div className="login-card-custom">
          <div className="left-section-custom">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label className="required-label">Email</Form.Label>
                <Form.Control
                  type="email" // Use type="email" for better validation
                  placeholder="Enter email"
                  name="email"
                  value={formData.email}
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
                <Button
                  type="submit"
                  className="login-button"
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
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
