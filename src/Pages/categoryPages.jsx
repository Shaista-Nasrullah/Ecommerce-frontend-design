import React, { useState, useEffect, useContext } from "react";
import "./categoryPages.css";
import { AppContext } from "../context/AppContext";
import { Spinner, Alert } from "react-bootstrap";

const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

const CategoryPages = () => {
  const [openCategory, setOpenCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    allCategories,
    latests,
    allBrands,
    loading: appGlobalLoading,
    error: appGlobalError,
    fetchAllCategoriesData,
    fetchBrandsData,
  } = useContext(AppContext);

  const [localCategoriesLoading, setLocalCategoriesLoading] = useState(true);
  const [localCategoriesError, setLocalCategoriesError] = useState(null);
  const [localBrandsLoading, setLocalBrandsLoading] = useState(true);
  const [localBrandsError, setLocalBrandsError] = useState(null);

  useEffect(() => {
    fetchAllCategoriesData(setLocalCategoriesLoading, setLocalCategoriesError);
    fetchBrandsData(setLocalBrandsLoading, setLocalBrandsError);
  }, [fetchAllCategoriesData, fetchBrandsData]);

  const handleCategoryClick = (categoryName) => {
    setOpenCategory(openCategory === categoryName ? null : categoryName);
  };

  // Filter brands based on search term (using allBrands from context)
  const filteredBrands = allBrands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Combine loading states
  if (appGlobalLoading || localCategoriesLoading || localBrandsLoading) {
    return (
      <div
        className="mainContainer d-flex justify-content-center align-items-center"
        style={{ minHeight: "500px" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading data...</span>
        </Spinner>
      </div>
    );
  }

  // Combine error states
  if (appGlobalError || localCategoriesError || localBrandsError) {
    return (
      <div
        className="mainContainer d-flex justify-content-center align-items-center"
        style={{ minHeight: "500px" }}
      >
        <Alert variant="danger">
          Error loading data:{" "}
          {
            (appGlobalError || localCategoriesError || localBrandsError)
              ?.message
          }
        </Alert>
      </div>
    );
  }

  return (
    <div className="mainContainer">
      <div className="first-section">
        <div className="productsAndProductsFoundSection">
          <h5>Products</h5>
          <p>{latests.length} Products found</p>
        </div>

        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search for items..."
            className="search-input"
          />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>

        <div className="sort-by-containerr">
          <select className="sorting-item">
            <option value="Default">Sort by Default</option>
            <option value="Price: Low to High">Price: Low to High</option>
            <option value="Price: High to Low">Price: High to Low</option>
            <option value="Name: A to Z">Name: A to Z</option>
            <option value="Name: Z to A">Name: Z to A</option>
          </select>
        </div>
        <div className="sort-by-containerr">
          <select className="sorting-item">
            <option value="Default">Filter by Default</option>
            <option value="best-selling">Best Selling</option>
            <option value="top-rated">Top Rated</option>
            <option value="most-favourite">Most Favourite</option>
          </select>
        </div>
        <div className="menu-display">
          <i className="fa fa-bars"></i>
        </div>
      </div>
      <div className="containerForSideFilterProducts">
        <div className="sideFilter">
          <h5 className="filterBy">Filter by</h5>
          <h6 className="productBy">Product Type</h6>
          <div className="sort-by-containerr">
            <select className="sorting-item">
              <option value="Default">All</option>
              <option value="physical">Physical</option>
              <option value="digital">Digital</option>
            </select>
          </div>
          {/* Price Range Filter */}
          <div className="filter-group">
            <h4 className="productBy">Price</h4>
            <div className="price-inputs">
              <input type="number" className="price-input" />
              <span>-</span>
              <input type="number" className="price-input" />
              <div className="icon-display">
                <i className="fa fa-chevron-right"></i>
              </div>
            </div>
            <div className="range-slider-mock">
              <input type="range" min="0" max="5000" className="slider-min" />
              <div className="slider-track"></div>
            </div>
          </div>
          <div className="category-section">
            {" "}
            {/* New section for categories */}
            <h5 className="productBy">Categories</h5>
            {/* Added scrollable container for categories */}
            {allCategories.length > 0 ? (
              <div
                className="categories-list-scrollable"
                style={{ maxHeight: "300px", overflowY: "auto" }}
              >
                {allCategories.map((category) => (
                  <div key={category.id} className="category-item">
                    <div className="imageNameIcon">
                      <div
                        className="category-header"
                        // onClick={() => handleCategoryClick(category.name)} // You might want to pass category ID instead
                      >
                        <div className="category-title-wrapper">
                          {category.image && (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="category-icon-pages"
                              style={{
                                width: "24px",
                                height: "24px",
                                marginRight: "8px",
                              }}
                            />
                          )}
                          <span className="category-name-pages">
                            {category.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No categories available.</p>
            )}
          </div>

          <div className="brand-section">
            {" "}
            {/* New section for categories */}
            <h5 className="productBy">Brands</h5>
            <div className="lower-search-bar-container">
              <input
                type="text"
                placeholder="Search for brands..."
                className="lower-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="lower-search-button">
                <i className="fas fa-search"></i>
              </button>
            </div>
            {localBrandsLoading ? (
              <p>Loading brands...</p>
            ) : localBrandsError ? (
              <p>Error loading brands: {localBrandsError.message}</p>
            ) : filteredBrands.length === 0 ? (
              <p>No brands found.</p>
            ) : (
              <div
                className="brands-list-scrollable"
                style={{ maxHeight: "300px", overflowY: "auto" }}
              >
                {" "}
                {/* Added scrollable container */}
                {filteredBrands.map((brand) => (
                  <div key={brand.id} className="brands-items">
                    <div className="imageNameIcon">
                      <div className="brand-header">
                        <div className="brand-title-wrapper">
                          {brand.image && (
                            <img
                              src={brand.image} // Brand image from API
                              alt={brand.name}
                              className="brand-icon-pages"
                              style={{
                                width: "24px",
                                height: "24px",
                                marginRight: "8px",
                              }}
                            />
                          )}
                          <span className="brand-name-pages">
                            {truncateText(brand.name, 20)}{" "}
                            {/* Applied truncateText */}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="productsSectionCategory">
          <div className="LatestProducts-grid">
            {latests.length > 0 ? (
              latests.map((product) => (
                <div className="LatestProducts-card" key={product.id}>
                  <div className="LatestProducts-image-container">
                    <img
                      src={product.feature_image || product.image} // Use feature_image or image
                      alt={product.name}
                      className="LatestProducts-image"
                    />
                  </div>
                  <h3 className="LatestProducts-productName">{product.name}</h3>
                  <p className="LatestProducts-productPrice">
                    ${product.unit_price}
                  </p>{" "}
                  {/* Use unit_price */}
                </div>
              ))
            ) : (
              <p>No latest products available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPages;
