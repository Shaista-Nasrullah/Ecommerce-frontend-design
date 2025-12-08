import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { ThreeDotsVertical } from "react-bootstrap-icons";
import ProfileSidebar from "../Components/ProfileSidebar.jsx";
import "./ProfileStyles.css";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const OtherSettings = () => {
  // --- COMPONENT STATE ---
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");

  // State for loading and API feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // --- API REQUEST HANDLER ---
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Client-side validation
    if (newPassword !== newPasswordConfirmation) {
      setError("New passwords do not match.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    const passwordData = {
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirmation: newPasswordConfirmation,
    };

    try {
      // Retrieve the auth token from local storage
      const token = localStorage.getItem("token") || "YOUR_AUTH_TOKEN";
      const response = await fetch(
        `${API_BASE_URL}/api/user/account/password/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(passwordData),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(data.message || "Password updated successfully!");
        // Clear input fields on success
        setOldPassword("");
        setNewPassword("");
        setNewPasswordConfirmation("");
      } else {
        setError(
          data.message ||
            "Failed to update password. Please check your old password."
        );
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error("Password update error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="custom-container-width mt-4">
      <Row>
        <Col md={3}>
          {/* Include the shared sidebar component */}
          <ProfileSidebar />
        </Col>
        <Col md={9}>
          <div className="profile-container">
            <Card.Header className="d-flex justify-content-between align-items-center bg-white">
              <h5 className="mb-3 text-lg text-center">Update Password</h5>
              <ThreeDotsVertical />
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleUpdatePassword}>
                <Form.Group className="mb-3" controlId="formOldPassword">
                  <Form.Label>Old Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your old password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formNewPassword">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm your new password"
                    value={newPasswordConfirmation}
                    onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-end mt-4">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        <span className="ms-2">Updating...</span>
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default OtherSettings;
