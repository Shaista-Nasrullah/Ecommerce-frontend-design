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
  Table,
  Badge,
} from "react-bootstrap";
import ProfileSidebar from "../Components/ProfileSidebar.jsx";
import axios from "axios";
import "./ProfileStyles.css"; 
import { useSelector } from "react-redux";
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  ClockHistory,
} from "react-bootstrap-icons";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const MyWallet = () => {
  const token = useSelector((state) => state.auth.token);

  // State for data
  const [walletInfo, setWalletInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // State for Modals
  const [showTopUp, setShowTopUp] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Data
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  // --- Data Fetching ---

  // Fetches wallet balance and transactions
  const fetchWalletData = async () => {
    setIsFetching(true);
    setFetchError(null);
    try {
      // We use the endpoint that provides transactions as it also returns the balance
      // per Image 4 specification (/api/user/wallet).
      const response = await axios.get(`${API_BASE_URL}/api/user/wallet`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Response structure based on Image 4:
      // { "balance": "15870.00", "transactions": [...] }
      setWalletInfo({ balance: response.data.balance });
      setTransactions(response.data.transactions || []);
    } catch (err) {
      setFetchError("Failed to load wallet information.");
      console.error("Fetch wallet error:", err);
      // Optional: Fallback to just /info endpoint if /wallet fails,
      // but usually we display the error.
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchWalletData();
    }
  }, [token]);

  // --- Modal Handlers ---

  const handleCloseTopUp = () => {
    setShowTopUp(false);
    setAmount("");
  };
  const handleShowTopUp = () => setShowTopUp(true);

  const handleCloseWithdraw = () => {
    setShowWithdraw(false);
    setAmount("");
    setNote("");
  };
  const handleShowWithdraw = () => setShowWithdraw(true);

  // --- Form Submissions ---

  const handleTopUpSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Endpoint based on Image 1
      const response = await axios.post(
        `${API_BASE_URL}/api/user/wallet/topup`,
        { amount: amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message || "Wallet topped up successfully!");
      // Update balance from response or re-fetch
      if (response.data.balance) {
        setWalletInfo((prev) => ({ ...prev, balance: response.data.balance }));
      }
      fetchWalletData(); // Refresh transactions
      handleCloseTopUp();
    } catch (err) {
      toast.error(err.response?.data?.message || "Top-up failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Endpoint based on Image 3
      const payload = { amount: amount };
      if (note) payload.note = note; // Optional parameter

      const response = await axios.post(
        `${API_BASE_URL}/api/user/wallet/withdraw`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message || "Withdrawal successful!");
      if (response.data.balance) {
        setWalletInfo((prev) => ({ ...prev, balance: response.data.balance }));
      }
      fetchWalletData(); // Refresh transactions
      handleCloseWithdraw();
    } catch (err) {
      toast.error(err.response?.data?.message || "Withdrawal failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Helpers ---

  const getBadgeVariant = (type) => {
    switch (type) {
      case "topup": // Assuming 'topup' is the type key, though image shows "purchase"
      case "deposit":
        return "success";
      case "withdraw":
      case "purchase":
        return "danger";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return (
      new Date(dateString).toLocaleDateString() +
      " " +
      new Date(dateString).toLocaleTimeString()
    );
  };

  const renderContent = () => {
    if (isFetching)
      return (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      );
    if (fetchError) return <Alert variant="danger">{fetchError}</Alert>;

    return (
      <>
        {/* Balance Card */}
        <Card className="mb-4 shadow-sm bg-light border-0">
          <Card.Body className="text-center py-4">
            <h6 className="text-muted">Current Balance</h6>
            <h2 className="display-6 fw-bold text-primary">
              Rs.{walletInfo?.balance || "0.00"}
            </h2>
            <div className="mt-3 d-flex justify-content-center gap-3">
              <Button variant="success" onClick={handleShowTopUp}>
                <ArrowUpCircle className="me-2" /> Top Up
              </Button>
              <Button variant="outline-danger" onClick={handleShowWithdraw}>
                <ArrowDownCircle className="me-2" /> Withdraw
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Transactions List */}
        <h5 className="mb-3 mt-4">
          <ClockHistory className="me-2" /> Transaction History
        </h5>

        {transactions.length === 0 ? (
          <Alert variant="info">No transactions found.</Alert>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle shadow-sm border-white">
              <thead className="bg-light">
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Note/Reference</th>
                  <th className="text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id || Math.random()}>
                    <td className="text-muted small">
                      {formatDate(txn.created_at)}
                    </td>
                    <td>
                      <Badge
                        bg={getBadgeVariant(txn.type)}
                        className="text-capitalize"
                      >
                        {txn.type}
                      </Badge>
                    </td>
                    <td>
                      {txn.note || txn.reference || (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td
                      className={`text-end fw-bold Rs.{
                        ["purchase", "withdraw"].includes(txn.type)
                          ? "text-danger"
                          : "text-success"
                      }`}
                    >
                      {["purchase", "withdraw"].includes(txn.type) ? "-" : "+"}{" "}
                      Rs.{txn.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <Container className="custom-container-width mt-4">
        <Row>
          <Col md={3}>
            <ProfileSidebar />
          </Col>
          <Col md={9}>
            <div className="mb-4 profile-container">
              <Card.Header className="d-flex justify-content-between align-items-center bg-white border-bottom-0 pt-3 pb-3">
                <h5 className="mb-0">
                  <Wallet className="me-2 mb-1" /> My Wallet
                </h5>
                {/* Refresh Button (Optional) */}
                <Button
                  variant="light"
                  size="sm"
                  onClick={fetchWalletData}
                  disabled={isFetching}
                >
                  <i className="bi bi-arrow-clockwise"></i> Refresh
                </Button>
              </Card.Header>
              <Card.Body>{renderContent()}</Card.Body>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Top Up Modal */}
      <Modal show={showTopUp} onHide={handleCloseTopUp} centered>
        <Modal.Header closeButton>
          <Modal.Title>Top Up Wallet</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleTopUpSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount to add"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                required
              />
              <Form.Text className="text-muted">
                This amount will be added to your wallet balance.
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseTopUp}>
              Cancel
            </Button>
            <Button variant="success" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                "Proceed to Top Up"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Withdraw Modal */}
      <Modal show={showWithdraw} onHide={handleCloseWithdraw} centered>
        <Modal.Header closeButton>
          <Modal.Title>Withdraw Funds</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleWithdrawSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount to withdraw"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Note (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Reason or bank details..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseWithdraw}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                "Withdraw Now"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default MyWallet;
