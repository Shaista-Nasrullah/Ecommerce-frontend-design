import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams
import "./Categories.css"; // Assuming you want to reuse the same CSS

const SubCategories = () => {
  const { id } = useParams(); // Get the category ID from the URL
  const [subCategories, setSubCategories] = useState([]); // Renamed for clarity
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const IMAGE_BASE_URL = "https://tdsonlinepk.alitechnosolutions.com/";

  useEffect(() => {
    const fetchSubCategories = async () => {
      console.log(
        `Attempting to fetch subcategories for category ID: ${id}...`
      );
      try {
        const response = await fetch(`/api/categories/sub/${id}`); // Use the dynamic 'id'
        console.log("Fetch response received:", response);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }

        const data = await response.json();
        console.log("API Data received for subcategories:", data);

        // Your Postman response shows an array directly, so we'll handle that first.
        // If your API wraps it in a 'data' property for subcategories too, adjust here.
        if (Array.isArray(data)) {
          const subCategoriesWithFullImageUrls = data.map((subCategory) => ({
            ...subCategory,
            image: subCategory.image
              ? `${IMAGE_BASE_URL}${subCategory.image}`
              : null,
          }));
          setSubCategories(subCategoriesWithFullImageUrls);
          console.log(
            "Subcategories set successfully:",
            subCategoriesWithFullImageUrls
          );
        } else if (data && Array.isArray(data.data)) {
          // Fallback if API returns {data: [...]}
          const subCategoriesWithFullImageUrls = data.data.map(
            (subCategory) => ({
              ...subCategory,
              image: subCategory.image
                ? `${IMAGE_BASE_URL}${subCategory.image}`
                : null,
            })
          );
          setSubCategories(subCategoriesWithFullImageUrls);
          console.log(
            "Subcategories set successfully (from data.data):",
            subCategoriesWithFullImageUrls
          );
        } else {
          throw new Error(
            "API response for subcategories is not an array, and no 'data' array found."
          );
        }
      } catch (error) {
        console.error("Failed to fetch subcategories:", error);
        setError(error);
      } finally {
        setLoading(false);
        console.log("Loading state set to false.");
      }
    };

    if (id) {
      // Only fetch if 'id' is available
      fetchSubCategories();
    } else {
      setLoading(false);
      setError(new Error("No category ID provided in the URL."));
    }
  }, [id]); // Re-run effect when 'id' changes

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log("Search submitted for subcategories:", searchQuery);
  };

  // Decide where clicking a subcategory card should go
  const handleSubCategoryClick = (subCategoryId) => {
    // For now, let's assume clicking a subcategory might lead to products or another detail page.
    // If you have further nested subcategories, you'd navigate like: `/categories/${subCategoryId}`
    // For products, it might be: `/products/${subCategoryId}` or `/category/${id}/products/${subCategoryId}`
    console.log(`Clicked subcategory ID: ${subCategoryId}`);
    // Example: Navigate to a product listing page for this subcategory
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
