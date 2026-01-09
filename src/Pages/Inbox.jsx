import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  ListGroup,
  InputGroup,
  Form,
} from "react-bootstrap";
import {
  Send,
  PersonCircle,
  ChatLeftDots,
} from "react-bootstrap-icons";
import axios from "axios";
import { toast } from "react-toastify";
import ProfileSidebar from "../Components/ProfileSidebar.jsx";
import echo from "../utils/echo";
import "./ProfileStyles.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Conversations = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [isNewChatMode, setIsNewChatMode] = useState(false); 
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const scrollRef = useRef(null);
  const token = localStorage.getItem("token");
  const currentUserId = 27; 

  // --- API 3: RETRIEVE ALL CONVERSATIONS ---
  const fetchAllConversations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/user/conversation`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // We take the data exactly as the backend sends it
      const rawData = response.data.data || [];

      // Sort them so the newest (highest ID) is at the top
      const sortedData = [...rawData].sort((a, b) => b.id - a.id);

      setConversations(sortedData);
    } catch (err) {
      toast.error("Failed to load inbox.");
    } finally {
      setLoading(false);
    }
  };

  // --- API 4: GET HISTORY OF EXISTING ---
  const openConversation = async (convId) => {
    setIsNewChatMode(false); // Exit "New Chat" mode if we click an existing one
    setMessagesLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/user/conversation/${convId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setActiveConv(response.data.data);
    } catch (err) {
      toast.error("Could not load messages.");
    } finally {
      setMessagesLoading(false);
    }
  };

  // --- API 1 & 2: CONSOLIDATED SEND LOGIC ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    const payload = new URLSearchParams();
    payload.append("message", newMessage);

    try {
      let response;

      if (isNewChatMode) {
        // --- API 1: START NEW CONVERSATION ---
        payload.append("customer_id", currentUserId);
        response = await axios.post(
          `${API_BASE_URL}/api/user/conversation`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
      } else {
        // --- API 2: CONTINUE EXISTING ---
        payload.append("image", ""); // As per your requirement
        response = await axios.post(
          `${API_BASE_URL}/api/user/message/${activeConv.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
      }

      if (response.data.success) {
        setNewMessage("");
        if (isNewChatMode) {
          // If it was a new chat, refresh list and open the new ID
          await fetchAllConversations();
          openConversation(response.data.data.id);
        } else {
          // If existing, just refresh messages
          openConversation(activeConv.id);
        }
      }
    } catch (err) {
      toast.error("Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };

  // --- UI TOGGLE FOR NEW CHAT ---
  const handlePrepareNewChat = () => {
    setActiveConv(null); // Clear active window
    setIsNewChatMode(true); // Switch to New Chat Mode
  };

  useEffect(() => {
    fetchAllConversations();
  }, []);

  useEffect(() => {
    if (activeConv?.id) {
      const channel = echo
        .private(`conversation.${activeConv.id}`)
        .listen(".MessageSent", (e) => {
          setActiveConv((prev) => ({
            ...prev,
            messages: [...prev.messages, e.message],
          }));
        });
      return () => echo.leave(`conversation.${activeConv.id}`);
    }
  }, [activeConv?.id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages]);

  return (
    <Container className="custom-container-width mt-4">
      <Row>
        <Col md={3}>
          <ProfileSidebar />
        </Col>
        <Col md={9}>
          <div
            className="profile-container d-flex"
            style={{ height: "75vh", background: "#fff" }}
          >
            {/* SIDEBAR */}
            <div
              className="border-end"
              style={{ width: "300px", overflowY: "auto" }}
            >
              <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
                <span className="fw-bold">Inbox</span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handlePrepareNewChat}
                >
                  + New
                </Button>
              </div>

              <ListGroup variant="flush">
                {loading ? (
                  <div className="text-center p-3">
                    <Spinner size="sm" />
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <ListGroup.Item
                      key={conv.id}
                      action
                      // Highlight the active one based on unique ID
                      active={!isNewChatMode && activeConv?.id === conv.id}
                      onClick={() => openConversation(conv.id)}
                      className="border-bottom py-3"
                    >
                      <div className="d-flex align-items-center">
                        <PersonCircle
                          size={35}
                          className="me-3 text-secondary"
                        />
                        <div className="text-truncate">
                          <div className="fw-bold mb-0">
                            {conv.admin ? conv.admin.name : "Support"}
                          </div>
                          <small className="text-muted">ID: {conv.id}</small>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))
                )}

                {/* If there are no conversations at all */}
                {!loading && conversations.length === 0 && (
                  <div className="text-center p-4 text-muted small">
                    No conversations found.
                  </div>
                )}
              </ListGroup>
            </div>

            {/* CHAT AREA */}
            <div className="d-flex flex-column flex-grow-1">
              {activeConv || isNewChatMode ? (
                <>
                  <div className="p-3 border-bottom bg-light">
                    <h6 className="mb-0">
                      {isNewChatMode
                        ? "Starting New Conversation with Support"
                        : activeConv.admin?.name || "Customer Support"}
                    </h6>
                  </div>

                  <div
                    className="flex-grow-1 p-3"
                    style={{ overflowY: "auto", background: "#f8f9fa" }}
                  >
                    {isNewChatMode ? (
                      <div className="text-center mt-5 text-muted">
                        <p>
                          Write your first message below to start a new chat
                          with Admin.
                        </p>
                      </div>
                    ) : (
                      <>
                        {messagesLoading ? (
                          <Spinner animation="border" />
                        ) : (
                          activeConv.messages?.map((msg) => (
                            <div
                              key={msg.id}
                              className={`d-flex mb-3 ${
                                msg.sender_type === "customer"
                                  ? "justify-content-end"
                                  : "justify-content-start"
                              }`}
                            >
                              <div
                                className={`p-2 rounded-3 px-3 shadow-sm ${
                                  msg.sender_type === "customer"
                                    ? "bg-primary text-white"
                                    : "bg-white text-dark"
                                }`}
                                style={{ maxWidth: "75%" }}
                              >
                                {msg.message}
                              </div>
                            </div>
                          ))
                        )}
                        <div ref={scrollRef} />
                      </>
                    )}
                  </div>

                  <div className="p-3 border-top">
                    <Form onSubmit={handleSendMessage}>
                      <InputGroup>
                        <Form.Control
                          placeholder="Write your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          disabled={isSending}
                        />
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={isSending}
                        >
                          {isSending ? <Spinner size="sm" /> : <Send />}
                        </Button>
                      </InputGroup>
                    </Form>
                  </div>
                </>
              ) : (
                <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted opacity-50">
                  <ChatLeftDots size={40} className="mb-2" />
                  <p>Select a chat or click New to begin</p>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Conversations;
