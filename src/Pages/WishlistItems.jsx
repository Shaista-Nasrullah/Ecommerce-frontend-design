import React, { useContext, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import ProfileSidebar from "../Components/ProfileSidebar.jsx";
import { AppContext } from "../context/AppContext.jsx";
import "./wishlist.css";

const WishlistItems = () => {
  const {
    wishlist,
    wishlistCount,
    removeFromWishlist,
    fetchWishlist,
    clearWishlist,
  } = useContext(AppContext);
  const token = useSelector((state) => state.auth.token);
  const handleClearWishlist = async () => {
    await clearWishlist(token);
  };
  useEffect(() => {
    if (token) {
      fetchWishlist(token);
    }
  }, [token, fetchWishlist]);

  const handleRemoveFromWishlist = async (wishlistItemId) => {
    await removeFromWishlist(token, wishlistItemId);
    fetchWishlist(token);
  };

  const renderContent = () => {
    if (wishlistCount === 0) {
      return <p className="text-center p-5">Your wishlist is empty.</p>;
    }
    return wishlist.map((item) => (
      <div key={item.id} className="wishlist-item">
        <div className="wishlist-item-content">
          <img
            src={item.product.feature_image}
            alt={item.product.name}
            className="wishlist-item-image"
          />
          <div className="wishlist-item-details">
            <h6 className="item-name">{item.product.name}</h6>
            <p className="item-brand">
              Brand: <span>{item.product.brand?.name || "N/A"}</span>
            </p>
            <p className="item-price">
              Rs.{parseFloat(item.variation.default_sell_price).toFixed(2)}
            </p>
          </div>
        </div>
        <div className="wishlist-item-action">
          <i
            className="fa fa-heart text-primary"
            onClick={() => handleRemoveFromWishlist(item.id)}
            style={{ cursor: "pointer" }}
            title="Remove from wishlist"
          ></i>
        </div>
      </div>
    ));
  };

  return (
    <>
      <Container className="custom-container-width mt-4">
        <Row>
          <Col md={3}>
            <ProfileSidebar />
          </Col>
          <Col md={9}>
            <div className="wishlist-container p-3 ">
              <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Wishlist</h5>
                {wishlistCount > 0 && (
                  <Button
                    className="mb-2"
                    variant="danger"
                    size="sm"
                    onClick={handleClearWishlist}
                  >
                    Clear All
                  </Button>
                )}
              </Card.Header>
              <Card.Body>{renderContent()}</Card.Body>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default WishlistItems;
