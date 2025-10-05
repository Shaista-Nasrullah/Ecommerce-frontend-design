import React, { useContext } from "react";
import "./Categories.css";
import { AppContext } from "../context/AppContext";

const CategoriesSection = () => {
  const { categories, loading, error } = useContext(AppContext);

  const displayedCategories = categories.slice(0, 8); // Display only the first 8 categories

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

  if (categories.length === 0) {
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
      <div className="categories-scroll-wrapper">
        {" "}
        {/* New wrapper for horizontal scroll */}
        <div className="categories-grid">
          {displayedCategories.map((category) => (
            <div className="category-item" key={category.id}>
              {" "}
              {/* Assuming category.id is unique */}
              <img
                src={category.image}
                alt={category.name}
                className="category-image"
              />
              <p className="category-name">{category.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesSection;
