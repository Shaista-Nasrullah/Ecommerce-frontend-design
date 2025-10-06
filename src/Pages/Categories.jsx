import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Categories.css";
import { AppContext } from "../context/AppContext";

const AllCategoriesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  // Destructure allCategories (from global state) and the fetch function (memoized)
  // Changed `categories` to `allCategories` and `fetchCategoriesData` to `fetchAllCategoriesData`
  const { allCategories, fetchAllCategoriesData, IMAGE_BASE_URL } =
    useContext(AppContext);

  useEffect(() => {
    // When this component mounts, fetch all categories specifically for this page
    // This will now only run once because fetchAllCategoriesData is memoized
    fetchAllCategoriesData(setPageLoading, setPageError);
  }, [fetchAllCategoriesData]); // Dependency array: now stable, runs once on mount

  if (pageLoading) {
    return (
      <div className="all-categories-page-container">
        <p>Loading all categories...</p>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="all-categories-page-container error-message">
        <p>Error loading all categories: {pageError.message}</p>
        <p>Please try again later.</p>
      </div>
    );
  }

  // Check allCategories length
  if (allCategories.length === 0) {
    return (
      <div className="all-categories-page-container">
        <p>No categories found.</p>
      </div>
    );
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log("Search submitted for:", searchQuery);
    // You might want to filter categories or trigger a new search API call here
  };

  // Function to handle category card click
  const handleCategoryClick = (categoryId) => {
    navigate(`/categories/${categoryId}`); // Navigate to the subcategory page
  };

  // Filter based on allCategories
  const filteredCategories = allCategories.filter((category) =>
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

        {filteredCategories.length === 0 && searchQuery !== "" && (
          <div className="cat-no-categories-found">
            No categories found matching "{searchQuery}".
          </div>
        )}
        {filteredCategories.length === 0 && searchQuery === "" && (
          <div className="cat-no-categories-found">
            No categories available.
          </div>
        )}

        <div className="cat-grid">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="cat-card"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="cat-icon-wrapper">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="cat-icon"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `${IMAGE_BASE_URL}assets/placeholder-image.png`;
                      console.error(
                        `Failed to load image for ${category.name}: ${category.image}`
                      );
                    }}
                  />
                ) : (
                  <div className="cat-icon-placeholder">
                    <img
                      src={`${IMAGE_BASE_URL}assets/placeholder-image.png`}
                      alt="Placeholder"
                      className="cat-icon"
                    />
                  </div>
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

export default AllCategoriesPage;
