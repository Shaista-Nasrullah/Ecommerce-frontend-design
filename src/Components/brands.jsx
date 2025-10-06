import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import "./brands.css";

const BrandsSection = () => {
  const { homePageBrands, loading, error } = useContext(AppContext);

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

  if (homePageBrands.length === 0) {
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
      {/* Start of changes for scrollable brands */}
      <div
        style={{
          overflowX: "scroll",
          whiteSpace: "nowrap",
          display: "flex", // Make it a flex container to keep items in a row
          /* Hide scrollbar for Chrome, Safari and Opera */
          msOverflowStyle: "none" /* IE and Edge */,
          scrollbarWidth: "none" /* Firefox */,
        }}
        // The existing 'brands-scroll-wrapper' and 'brands-grid-home' classes might
        // conflict or add extra spacing. We'll simplify the structure slightly
        // by applying the flex and scroll directly here.
        // If your CSS relies heavily on 'brands-grid-home' for item styling,
        // you might need to adjust the inline 'width' below more carefully.
      >
        {homePageBrands.map((brand) => (
          <div
            className="brand-item-home"
            key={brand.id}
            style={{
              flex: "0 0 auto", // Prevent flex item from growing or shrinking
              // Adjust width based on how many brand items you want to show per row
              // For example, if you want 6 items, it would be around 16.66% each.
              width: "16.66%", // Example: for 6 brands per row. Adjust as needed.
              minWidth: "100px", // Minimum width for a brand item to prevent squishing
              maxWidth: "16.66%", // Maximum width
              // Add padding to simulate original spacing if 'brands-grid-home' had it
              // Example: if brands-grid-home had 20px gap, each item gets 10px on sides.
              padding: "0 10px", // Adjust as per your original 'brands-grid-home' spacing
              boxSizing: "border-box", // Include padding in width calculation
              // Ensure the content inside 'brand-item-home' is vertically centered if desired
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={brand.image}
              alt={brand.name}
              className="brand-image-home"
            />
            <p className="brand-name-home">{brand.name}</p>
          </div>
        ))}
      </div>
      {/* End of changes for scrollable brands */}
    </div>
  );
};

export default BrandsSection;
