import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import "./pageForBrands.css";

const Brands = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { brands, loading, error } = useContext(AppContext);

  if (loading) {
    return <div className="brands-section-container">Loading brands...</div>;
  }

  if (error) {
    return (
      <div className="brands-section-container">
        Error loading brands: {error.message}
        <p>Please check your network connection and API endpoint.</p>
      </div>
    );
  }

  if (brands.length === 0) {
    return <div className="brands-section-container">No brands found.</div>;
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log("Search submitted for brands:", searchQuery);
    // You might want to filter the displayed brands here based on searchQuery
  };

  const handleBrandClick = (brandId) => {
    // You can navigate to a brand-specific page if needed
    // For now, let's just log it or navigate to a generic products-by-brand page
    navigate(`/products/brand/${brandId}`);
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fullBrandPage">
      <div className="brand-page-container">
        <div className="brand-header-section">
          <div className="brand-info">
            <h2 className="brand-title-page">BRANDS</h2>{" "}
            {/* Specific class name */}
            <p className="brand-subtitle-page">
              Explore all our trusted brands
            </p>{" "}
            {/* Specific class name */}
          </div>
          <form
            className="brand-search-bar-container"
            onSubmit={handleSearchSubmit}
          >
            <input
              type="text"
              placeholder="Search Brands"
              className="brand-search-input"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button type="submit" className="brand-search-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="brand-feather-search"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>
        </div>

        {filteredBrands.length === 0 && (
          <div className="brand-no-brands-found">
            No brands found matching "{searchQuery}".
          </div>
        )}

        <div className="brand-grid-page">
          {" "}
          {/* Specific class name for page grid */}
          {filteredBrands.map((brand) => (
            <div
              key={brand.id}
              className="brand-card-page" // Specific class name for page card
              onClick={() => handleBrandClick(brand.id)}
            >
              <div className="brand-icon-wrapper-page">
                {" "}
                {/* Specific class name */}
                {brand.image ? (
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="brand-icon-page" // Specific class name
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/40"; // Fallback image
                      console.error(
                        `Failed to load image for ${brand.name}: ${brand.image}`
                      );
                    }}
                  />
                ) : (
                  <div className="brand-icon-placeholder-page"></div> // Specific class name
                )}
              </div>
              <p className="brand-name-page">{brand.name}</p>{" "}
              {/* Specific class name */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Brands;
