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
import ProfileSidebar from "../Components/ProfileSidebar.jsx";
import axios from "axios";
import "./ProfileStyles.css";
import { useSelector } from "react-redux";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { toast } from "react-toastify";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const MyAddress = () => {
  const token = useSelector((state) => state.auth.token);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const initialFormData = {
    name: "",
    phone: "",
    address_line_1: "",
    city: "",
    postal_code: "",
    country: "",
    type: "shipping",
    is_default: "no",
  };

  const [formData, setFormData] = useState(initialFormData);

  const fetchAddresses = async () => {
    setIsFetching(true);
    setFetchError(null);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/user/addresses/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddresses(response.data);
    } catch (err) {
      setFetchError("Failed to load addresses.");
      toast.error("Failed to load addresses.");
      console.error("Fetch addresses error:", err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAddresses();
    }
  }, [token]);

  const handleClose = () => {
    setShow(false);
    setEditingAddress(null);
    setFormData(initialFormData);
  };
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? (checked ? "yes" : "no") : value,
    }));
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;
    try {
      await axios.delete(
        `${API_BASE_URL}/api/user/address/delete/${addressId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Address deleted successfully!");
      fetchAddresses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete address.");
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      phone: address.phone,
      address_line_1: address.address_line_1,
      city: address.city,
      postal_code: address.postal_code || "",
      country: address.country,
      type: address.type,
      is_default: address.is_default ? "yes" : "no",
    });
    handleShow();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const apiCall = editingAddress
      ? axios.put(
          `${API_BASE_URL}/api/user/address/update/${editingAddress.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
      : axios.post(`${API_BASE_URL}/api/user/address/add`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

    try {
      const response = await apiCall;
      toast.success(
        response.data.message ||
          `Address ${editingAddress ? "updated" : "added"} successfully!`
      );
      fetchAddresses();
      handleClose();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderAddressContent = () => {
    if (isFetching)
      return (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      );
    if (fetchError) return <Alert variant="danger">{fetchError}</Alert>;
    if (!addresses || addresses.length === 0)
      return (
        <div className="text-center my-5">
          <h5>No Address Found!</h5>
        </div>
      );

    return addresses.map((address) => (
      <Card key={address.id} className="mb-3 shadow-sm address-card">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            <span>Permanent</span>
            <span className="text-muted fw-normal ms-2">
              ({address.type} address)
            </span>
          </div>
          <div>
            <Button
              variant="link"
              className="p-1"
              onClick={() => handleEdit(address)}
            >
              <PencilSquare size={20} className="text-primary" />
            </Button>
            <Button
              variant="link"
              className="p-1"
              onClick={() => handleDelete(address.id)}
            >
              <Trash size={20} className="text-danger" />
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="address-details-row">
            <div className="address-details-label">Name</div>
            <div className="address-details-value">: {address.name}</div>
          </div>
          <div className="address-details-row">
            <div className="address-details-label">Phone</div>
            <div className="address-details-value">: {address.phone}</div>
          </div>
          <div className="address-details-row">
            <div className="address-details-label">City</div>
            <div className="address-details-value">: {address.city}</div>
          </div>
          <div className="address-details-row">
            <div className="address-details-label">Zip code</div>
            <div className="address-details-value">
              : {address.postal_code || "N/A"}
            </div>
          </div>
          <div className="address-details-row">
            <div className="address-details-label">Address</div>
            <div className="address-details-value">
              : {address.address_line_1}
            </div>
          </div>
          <div className="address-details-row">
            <div className="address-details-label">Country</div>
            <div className="address-details-value">: {address.country}</div>
          </div>
        </Card.Body>
      </Card>
    ));
  };

  return (
    <>
      {/* <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      /> */}

      <Container className="custom-container-width mt-4">
        <Row>
          <Col md={3}>
            <ProfileSidebar />
          </Col>
          <Col md={9}>
            <div className="mb-4 profile-container">
              <Card.Header className="d-flex justify-content-between align-items-center bg-white border-bottom-0 pt-3 pb-3">
                <h5 className="mb-0">My Address</h5>
                <Button variant="primary" onClick={handleShow}>
                  <i className="bi bi-geo-alt-fill me-2"></i> Add Address
                </Button>
              </Card.Header>
              <Card.Body>{renderAddressContent()}</Card.Body>
            </div>
          </Col>
        </Row>
      </Container>

      <Modal
        className="add-address-modal"
        show={show}
        onHide={handleClose}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingAddress ? "Update Address" : "Add New Address"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleFormSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Address Type *</Form.Label>
              <div>
                <Form.Check
                  inline
                  label="Shipping"
                  name="type"
                  type="radio"
                  value="shipping"
                  checked={formData.type === "shipping"}
                  onChange={handleChange}
                />
                <Form.Check
                  inline
                  label="Billing"
                  name="type"
                  type="radio"
                  value="billing"
                  checked={formData.type === "billing"}
                  onChange={handleChange}
                />
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contact Person Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone *</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address *</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="address_line_1"
                value={formData.address_line_1}
                onChange={handleChange}
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
                    value={formData.city}
                    onChange={handleChange}
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
                    value={formData.postal_code}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Country *</Form.Label>
              <Form.Control
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Set as default address"
                name="is_default"
                checked={formData.is_default === "yes"}
                onChange={handleChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading
                ? editingAddress
                  ? "Updating..."
                  : "Adding..."
                : "Save Information"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default MyAddress;
