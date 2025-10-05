import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import "./brands.css";

const BrandsSection = () => {
  const { brands, loading, error } = useContext(AppContext);

  const displayedBrands = brands.slice(0, 8);

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

  return (
    <div className="brands-section-container">
      <div className="brands-header">
        <h2 className="brands-title">Brands</h2>
        <a href="/brands" className="view-all-brands-link">
          View All <span className="brands-arrow-icon">&gt;</span>
        </a>
      </div>
      <div className="brands-scroll-wrapper">
        <div className="brands-grid-home">
          {displayedBrands.map((brand) => (
            <div className="brand-item-home" key={brand.id}>
              <img
                // Image URL is now already processed in AppContext
                src={brand.image}
                alt={brand.name}
                className="brand-image-home"
              />
              <p className="brand-name-home">{brand.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandsSection;
