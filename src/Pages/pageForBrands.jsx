import React, { useContext, useState, useEffect } from "react"; // Import useEffect
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import "./pageForBrands.css";

const Brands = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  // Destructure brands (from global state) and the fetch function (memoized)
  const { allBrands, fetchBrandsData, IMAGE_BASE_URL } = useContext(AppContext); // Add IMAGE_BASE_URL

  // useEffect to fetch brands when this component mounts
  useEffect(() => {
    // Call the specific fetch function for brands, passing component's loading/error setters
    fetchBrandsData(setPageLoading, setPageError);
  }, [fetchBrandsData]); // Dependency array: ensure it runs once on mount, as fetchBrandsData is memoized

  // --- Conditional Rendering for Loading and Error States ---
  if (pageLoading) {
    return (
      <div className="fullBrandPage">
        <div className="brand-page-container">
          <p>Loading all brands...</p>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="fullBrandPage">
        <div className="brand-page-container error-message">
          <p>Error loading brands: {pageError.message}</p>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  // Handle cases where no brands are found after loading
  // (Note: The `brands` state might be empty initially before fetch completes,
  // but `pageLoading` handles that. This check is for when the API returns an empty array.)
  if (allBrands.length === 0 && !pageLoading) {
    // Ensure it's not still loading
    return (
      <div className="fullBrandPage">
        <div className="brand-page-container">
          <p>No brands found.</p>
        </div>
      </div>
    );
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log("Search submitted for brands:", searchQuery);
    // Filtering is done below in filteredBrands
  };

  const handleBrandClick = (brandId) => {
    navigate(`/products/brand/${brandId}`);
  };

  const filteredBrands = allBrands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fullBrandPage">
      <div className="brand-page-container">
        <div className="brand-header-section">
          <div className="brand-info">
            <h2 className="brand-title-page">BRANDS</h2>
            <p className="brand-subtitle-page">
              Explore all our trusted brands
            </p>
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

        {/* Display message if no brands match the search query */}
        {filteredBrands.length === 0 && searchQuery !== "" && (
          <div className="brand-no-brands-found">
            No brands found matching "{searchQuery}".
          </div>
        )}
        {/* Display message if no brands are available at all (after loading) */}
        {filteredBrands.length === 0 && searchQuery === "" && (
          <div className="brand-no-brands-found">No brands available.</div>
        )}

        <div className="brand-grid-page">
          {filteredBrands.map((brand) => (
            <div
              key={brand.id}
              className="brand-card-page"
              onClick={() => handleBrandClick(brand.id)}
            >
              <div className="brand-icon-wrapper-page">
                {brand.image ? (
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="brand-icon-page"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `${IMAGE_BASE_URL}assets/placeholder-image.png`; // Use IMAGE_BASE_URL
                      console.error(
                        `Failed to load image for ${brand.name}: ${brand.image}`
                      );
                    }}
                  />
                ) : (
                  // Placeholder for missing image property from API
                  <div className="brand-icon-placeholder-page">
                    <img
                      src={`${IMAGE_BASE_URL}assets/placeholder-image.png`} // Use IMAGE_BASE_URL for placeholder
                      alt="Placeholder"
                      className="brand-icon-page"
                    />
                  </div>
                )}
              </div>
              <p className="brand-name-page">{brand.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Brands;
