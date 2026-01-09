import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Card,
} from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ContactUs = () => {
  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Based on your screenshot: POST api/contact
      const response = await axios.post(
        `${API_BASE_URL}/api/contact`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.data.success) {
        toast.success("Message sent successfully!");
        // Reset form after success
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to send message.";
      toast.error(errorMsg);
      console.error("Contact API error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="text-center mb-5 fw-bold">Contact Us</h2>

      <Row className="align-items-center">
        {/* Left Side: Illustration */}
        <Col md={6} className="text-center mb-4 mb-md-0">
          <img
            src="/assets/contact-illustration.png" // Ensure you have the image in your public folder
            alt="Contact Illustration"
            className="img-fluid"
            style={{ maxWidth: "90%" }}
          />
        </Col>

        {/* Right Side: Form */}
        <Col md={6}>
          <Card className="border-0 shadow-sm p-4">
            <h4 className="text-center mb-4">Send us a message</h4>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-semibold">
                      Your name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-semibold">
                      Email address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-semibold">
                      Your phone
                    </Form.Label>
                    {/* Simplified for standard input to match your logic */}
                    <Form.Control
                      type="text"
                      name="phone"
                      placeholder="+1 Contact number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-semibold">
                      Subject:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="subject"
                      placeholder="Short title"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-semibold">Message</Form.Label>
                <Form.Control
                  as="textarea"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: "#6d4c41", // The brown color from your screenshot
                  border: "none",
                  padding: "10px 30px",
                }}
              >
                {loading ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  "Send"
                )}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactUs;
