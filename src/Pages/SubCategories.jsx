import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import "./Categories.css";

const SubCategories = () => {
  const { id } = useParams();
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Consume the fetchSubCategoriesData from context
  const { fetchSubCategoriesData } = useContext(AppContext);

  useEffect(() => {
    const getSubCategories = async () => {
      if (!id) {
        setLoading(false);
        setError(new Error("No category ID provided in the URL."));
        return;
      }

      console.log(
        `SubCategories Component: Attempting to fetch subcategories for category ID: ${id}...`
      );
      // Call the function from context, passing its own loading/error setters
      const data = await fetchSubCategoriesData(id, setLoading, setError);
      if (data) {
        setSubCategories(data);
        console.log("Subcategories set successfully in component:", data);
      }
    };

    getSubCategories();
  }, [id, fetchSubCategoriesData]); // Re-run effect when 'id' or the context function changes

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log("Search submitted for subcategories:", searchQuery);
  };

  const handleSubCategoryClick = (subCategoryId) => {
    console.log(`Clicked subcategory ID: ${subCategoryId}`);
    navigate(`/products?subCategoryId=${subCategoryId}`);
  };

  const filteredSubCategories = subCategories.filter((subCategory) =>
    subCategory.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="cat-page-container">
        <div className="cat-loading-message">Loading subcategories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cat-page-container">
        <div className="cat-error-message">
          Error loading subcategories: {error.message}
          <p>Please check your network connection and API endpoint.</p>
          <p>
            If you see a CORS error in the console, your API needs to be
            configured to allow requests from your frontend's origin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fullPage">
      <div className="cat-page-container">
        <div className="cat-header-section">
          <div className="cat-info">
            <h2 className="cat-title">SUBCATEGORIES for Category ID: {id}</h2>
            <p className="cat-subtitle">Explore subcategories</p>
          </div>
          <form
            className="cat-search-bar-container"
            onSubmit={handleSearchSubmit}
          >
            <input
              type="text"
              placeholder="Search Subcategories"
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

        {filteredSubCategories.length === 0 && (
          <div className="cat-no-categories-found">
            No subcategories found matching "{searchQuery}" for category ID {id}
            .
          </div>
        )}

        <div className="cat-grid">
          {filteredSubCategories.map((subCategory) => (
            <div
              key={subCategory.id}
              className="cat-card"
              onClick={() => handleSubCategoryClick(subCategory.id)}
            >
              <div className="cat-icon-wrapper">
                {subCategory.image ? (
                  <img
                    src={subCategory.image}
                    alt={subCategory.name}
                    className="cat-icon"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/40";
                      console.error(
                        `Failed to load image for ${subCategory.name}: ${subCategory.image}`
                      );
                    }}
                  />
                ) : (
                  <div className="cat-icon-placeholder"></div>
                )}
              </div>
              <p className="cat-name">{subCategory.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubCategories;
