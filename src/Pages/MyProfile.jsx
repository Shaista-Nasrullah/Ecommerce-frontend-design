import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Dropdown, 
} from "react-bootstrap";
import {
  PersonCircle,
  CameraFill,
  ThreeDotsVertical,
} from "react-bootstrap-icons";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileSidebar from "../Components/ProfileSidebar.jsx";
import "./ProfileStyles.css";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const MyProfile = () => {
  // --- COMPONENT STATE ---
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // State for loading
  const [loading, setLoading] = useState(false);

  // --- API REQUESTS ---

  // 1. Get User Data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token") || "YOUR_AUTH_TOKEN";
        const response = await axios.get(`${API_BASE_URL}/api/user/userInfo`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data;
        if (userData) {
          setUserId(userData.id);
          // setUsername(userData.username || "");
          setEmail(userData.email || "");
          // Set other fields if they exist in the API response
          setFirstName(userData.first_name || "");
          setLastName(userData.last_name || "");
          setPhone(userData.phone || "");
        }
      } catch (err) {
        toast.error("Failed to fetch user data. Please try again later.");
        console.error("Fetch user data error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // 2. Update User Data
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedData = {
      id: userId,
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      email: email,
    };

    try {
      const token = localStorage.getItem("token") || "YOUR_AUTH_TOKEN";
      const response = await axios.put(
        `${API_BASE_URL}/api/user/userInfo/update`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || "Failed to update user data.");
      }
    } catch (err) {
      toast.error("An error occurred while updating the profile.");
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Delete User Account
  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action is permanent."
      )
    ) {
      setLoading(true);
      try {
        const token = localStorage.getItem("token") || "YOUR_AUTH_TOKEN";
        const response = await axios.delete(
          `${API_BASE_URL}/api/user/account/delete`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.status === "success") {
          toast.success("Account deleted successfully.");
        } else {
          toast.error(response.data.message || "Failed to delete account.");
        }
      } catch (err) {
        toast.error("An error occurred during account deletion.");
        console.error("Delete error:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const getUserDisplayName = () => {
    if (firstName && lastName) return `${firstName} ${lastName}`;
    return "User";
  };

  return (
    <>

      <Container className="custom-container-width mt-4">
        <Row>
          <Col md={3}>
            <ProfileSidebar />
          </Col>
          <Col md={9}>
            <div className="profile-container">
              <Card.Header className="d-flex justify-content-between align-items-center bg-white">
                <h5 className="mb-0">Profile Info</h5>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="link"
                    id="dropdown-basic"
                    className="no-caret"
                  >
                    <ThreeDotsVertical />
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end">
                    <Dropdown.Item
                      onClick={handleDelete}
                      className="text-danger"
                    >
                      Delete Account
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Card.Header>
              <Card.Body>
                {loading && !userId ? (
                  <div className="text-center p-5">
                    <Spinner animation="border" />
                    <p className="mt-2">Loading Profile...</p>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-4">
                      <div className="profile-pic-wrapper mx-auto">
                        <PersonCircle size={60} className="text-secondary" />
                        <div className="profile-pic-camera-icon">
                          <CameraFill size={15} />
                        </div>
                      </div>
                      <h5 className="mb-0 mt-2">{getUserDisplayName()}</h5>
                      <p className="text-muted">{email}</p>
                    </div>

                    <Form onSubmit={handleUpdate}>
                      <Row className="mb-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter your first name"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter your last name"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter your phone number"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="email"
                              value={email}
                              readOnly
                              disabled
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <div className="text-end mt-4">
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={loading}
                          className="update-button"
                        >
                          {loading ? (
                            <Spinner as="span" animation="border" size="sm" />
                          ) : (
                            "Update Information"
                          )}
                        </Button>
                      </div>
                    </Form>
                  </>
                )}
              </Card.Body>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MyProfile;
