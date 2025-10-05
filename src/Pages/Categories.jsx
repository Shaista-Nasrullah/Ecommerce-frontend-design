

import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Categories.css";
import { AppContext } from "../context/AppContext";

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { categories, loading, error } = useContext(AppContext);

  if (loading) {
    return (
      <div className="cat-page-container">
        <div className="cat-loading-message">Loading categories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cat-page-container">
        <div className="cat-error-message">
          Error loading categories: {error.message}
          <p>Please check your network connection and API endpoint.</p>
          <p>
            If you see a CORS error in the console, your API needs to be
            configured to allow requests from your frontend's origin.
          </p>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return <div>There are no categories to display</div>;
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log("Search submitted for:", searchQuery);
  };

  // Function to handle category card click
  const handleCategoryClick = (categoryId) => {
    navigate(`/categories/${categoryId}`); // Navigate to the subcategory page
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fullPage">
      <div className="cat-page-container">
        <div className="cat-header-section">
          <div className="cat-info">
            <h2 className="cat-title">CATEGORY</h2>
            <p className="cat-subtitle">Find your favorite categories</p>
          </div>
          <form
            className="cat-search-bar-container"
            onSubmit={handleSearchSubmit}
          >
            <input
              type="text"
              placeholder="Search Categories"
              className="cat-search-input"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button type="submit" className="cat-search-button">
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
                className="cat-feather-search"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>
        </div>

        {filteredCategories.length === 0 && (
          <div className="cat-no-categories-found">
            No categories found matching "{searchQuery}".
          </div>
        )}

        <div className="cat-grid">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="cat-card"
              onClick={() => handleCategoryClick(category.id)} // Add onClick handler here
            >
              <div className="cat-icon-wrapper">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="cat-icon"
                    onError={(e) => {
                      e.target.onerror = null; // prevents infinite loop
                      e.target.src = "https://via.placeholder.com/40"; // Fallback image
                      console.error(
                        `Failed to load image for ${category.name}: ${category.image}`
                      );
                    }}
                  />
                ) : (
                  <div className="cat-icon-placeholder"></div> // Placeholder for missing image
                )}
              </div>
              <p className="cat-name">{category.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
