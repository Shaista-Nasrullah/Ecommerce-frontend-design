import React, { useContext } from "react";
import "./Categories.css";
import { AppContext } from "../context/AppContext";

const CategoriesSection = () => {
  // Use homePageCategories for this component
  const { homePageCategories, loading, error } = useContext(AppContext);

  if (loading) {
    return (
      <div className="categories-section-container">Loading categories...</div>
    );
  }

  if (error) {
    return (
      <div className="categories-section-container">
        Error loading categories: {error.message}
        <p>Please check your network connection and API endpoint.</p>
        <p>
          If you see a CORS error in the console, your API needs to be
          configured to allow requests from your frontend's origin.
        </p>
      </div>
    );
  }

  // Check homePageCategories length
  if (homePageCategories.length === 0) {
    return (
      <div className="categories-section-container">No categories found.</div>
    );
  }

  return (
    <div className="categories-section-container">
      <div className="categories-header">
        <h2 className="categories-title">Categories</h2>
        <a href="/categories" className="view-all-link">
          View All <span className="arrow-icon">&gt;</span>
        </a>
      </div>
      {/* Start of changes for scrollable categories */}
      <div
        style={{
          overflowX: "scroll",
          whiteSpace: "nowrap",
          display: "flex", // Make it a flex container to keep items in a row
          /* Hide scrollbar for Chrome, Safari and Opera */
          msOverflowStyle: "none" /* IE and Edge */,
          scrollbarWidth: "none" /* Firefox */,
          // Potentially add some padding to the container if your 'categories-grid'
          // previously had padding that acted as a gutter.
          // padding: "0 15px", // Example if you need container padding
        }}
        // The original 'categories-scroll-wrapper' and 'categories-grid' might
        // have existing CSS that could interfere. We are essentially merging
        // their responsibilities here.
      >
        {/* Map homePageCategories */}
        {homePageCategories.map((category) => (
          <div
            className="category-item"
            key={category.id} // Assuming category.id is unique
            style={{
              flex: "0 0 auto", // Prevent flex item from growing or shrinking
              // Adjust width based on how many category items you want to show per row
              // For example, if you want 5 items, use 20%. For 6 items, use 16.66%.
              width: "15%", // Example: for 5 categories per row. Adjust as needed.
              minWidth: "55px", // Minimum width for a category item
              maxWidth: "20%", // Maximum width
              // Add padding to simulate original spacing if 'categories-grid' had it
              // Example: if categories-grid had 20px gap, each item gets 10px on sides.
              padding: "0px", // Adjust as per your original 'categories-grid' spacing
              boxSizing: "border-box", // Include padding in width calculation
              // Ensure the content inside 'category-item' is vertically centered if desired
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={category.image}
              alt={category.name}
              className="category-image"
            />
            <p className="category-name">{category.name}</p>
          </div>
        ))}
      </div>
      {/* End of changes for scrollable categories */}
    </div>
  );
};

export default CategoriesSection;
