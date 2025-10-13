import React, { useState, useEffect, useContext, useCallback } from "react";
import "./categoryPages.css";
import { AppContext } from "../context/AppContext";
import { Spinner, Alert } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";

const truncateText = (text, maxLength) => {
  if (text && text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

const CategoryPages = () => {
  const [searchParams] = useSearchParams();
  const initialSection = searchParams.get("section");

  const {
    allCategories,
    flushDeals,
    topRated,
    featured,
    latests,
    allBrands,
    loading: appGlobalLoading,
    error: appGlobalError,
    fetchAllCategoriesData,
    fetchBrandsData,
    allProducts, // From AppContext
    allProductsPagination, // From AppContext
    fetchAllProductsData, // From AppContext
  } = useContext(AppContext);

  const [filters, setFilters] = useState({
    search: "",
    min_price: "",
    max_price: "",
    category_ids: [], // Array to hold selected category IDs
    brand_ids: [], // Array to hold selected brand IDs
    sort_by: "Default", // Corresponds to API parameter (e.g., 'name', 'unit_price')
    sort_order: "asc", // Corresponds to API parameter ('asc', 'desc')
    filter_by: "Default", // For special API filters like 'best-selling', 'top-rated' if your API supports it
    page: 1,
    limit: 25, // Matches the API's default per_page or your desired limit
  });

  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);

  const [localCategoriesLoading, setLocalCategoriesLoading] = useState(true);
  const [localCategoriesError, setLocalCategoriesError] = useState(null);
  const [localBrandsLoading, setLocalBrandsLoading] = useState(true);
  const [localBrandsError, setLocalBrandsError] = useState(null);
  const [searchTermLocal, setSearchTermLocal] = useState(""); // For brand search filter in sidebar

  // Fetch categories and brands for the sidebar filters
  useEffect(() => {
    fetchAllCategoriesData(setLocalCategoriesLoading, setLocalCategoriesError);
    fetchBrandsData(setLocalBrandsLoading, setLocalBrandsError);
  }, [fetchAllCategoriesData, fetchBrandsData]);

  // Main effect to fetch products based on filters
  useEffect(() => {
    const fetchAndSetProducts = async () => {
      // Determine if the current view is one of the pre-fetched homepage sections
      const isHomepageSection =
        initialSection &&
        [
          "flash-deals",
          "featured-products",
          "latest-products",
          "top-rated",
        ].includes(initialSection) &&
        !filters.search &&
        !filters.min_price &&
        !filters.max_price &&
        filters.category_ids.length === 0 &&
        filters.brand_ids.length === 0 &&
        filters.sort_by === "Default" &&
        filters.filter_by === "Default";

      if (isHomepageSection) {
        let sourceProducts = [];
        switch (initialSection) {
          case "flash-deals":
            sourceProducts = flushDeals || [];
            break;
          case "featured-products":
            sourceProducts = featured || [];
            break;
          case "latest-products":
            sourceProducts = latests || [];
            break;
          case "top-rated":
            sourceProducts = topRated || [];
            break;
          default:
            sourceProducts = [];
            break;
        }
        // These are already processed with IMAGE_BASE_URL in AppContext
        setProductsLoading(false);
        setProductsError(null);
        // Note: When displaying pre-fetched products, pagination might not apply directly
        // You might need to implement local pagination if these lists are very long
        // For simplicity, we'll display all of them for now.
      } else {
        // If it's not a pre-fetched homepage section OR if any filter is applied,
        // use the main products API call with filters.
        await fetchAllProductsData(
          setProductsLoading,
          setProductsError,
          filters.page,
          filters.limit,
          {
            search: filters.search,
            min_price: filters.min_price,
            max_price: filters.max_price,
            category_ids: filters.category_ids,
            brand_ids: filters.brand_ids,
            sort_by: filters.sort_by,
            sort_order: filters.sort_order,
            filter_by: filters.filter_by,
          }
        );
      }
    };

    fetchAndSetProducts();
  }, [
    initialSection,
    filters,
    fetchAllProductsData,
    flushDeals,
    featured,
    latests,
    topRated,
    // dependencies for pre-fetched sections if `isHomepageSection` is true
  ]);

  const handleSortChange = (e) => {
    const value = e.target.value;
    let sortBy = "Default";
    let sortOrder = "asc";

    switch (value) {
      case "Price: Low to High":
        sortBy = "unit_price"; // Assuming your API understands 'unit_price' for sorting
        sortOrder = "asc";
        break;
      case "Price: High to Low":
        sortBy = "unit_price";
        sortOrder = "desc";
        break;
      case "Name: A to Z":
        sortBy = "name"; // Assuming your API understands 'name' for sorting
        sortOrder = "asc";
        break;
      case "Name: Z to A":
        sortBy = "name";
        sortOrder = "desc";
        break;
      // If your API supports rating sort, add cases for it, e.g.:
      case "Rating: Low to High":
        sortBy = "rating";
        sortOrder = "asc";
        break;
      case "Rating: High to Low":
        sortBy = "rating";
        sortOrder = "desc";
        break;
      default:
        sortBy = "Default";
        sortOrder = "asc";
        break;
    }
    setFilters((prev) => ({
      ...prev,
      sort_by: sortBy,
      sort_order: sortOrder,
      page: 1, // Reset to first page on sort change
    }));
  };

  const handleFilterByChange = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      filter_by: value,
      page: 1, // Reset to first page on filter change
    }));
  };

  const handleCategoryClick = (categoryId) => {
    setFilters((prev) => {
      const currentCategoryIds = prev.category_ids;
      if (currentCategoryIds.includes(categoryId)) {
        return {
          ...prev,
          category_ids: currentCategoryIds.filter((id) => id !== categoryId), // Remove if already selected
          page: 1, // Reset to first page on filter change
        };
      } else {
        return {
          ...prev,
          category_ids: [...currentCategoryIds, categoryId], // Add if not selected
          page: 1, // Reset to first page on filter change
        };
      }
    });
  };

  const handleBrandClick = (brandId) => {
    setFilters((prev) => {
      const currentBrandIds = prev.brand_ids;
      if (currentBrandIds.includes(brandId)) {
        return {
          ...prev,
          brand_ids: currentBrandIds.filter((id) => id !== brandId), // Remove if already selected
          page: 1, // Reset to first page on filter change
        };
      } else {
        return {
          ...prev,
          brand_ids: [...currentBrandIds, brandId], // Add if not selected
          page: 1, // Reset to first page on filter change
        };
      }
    });
  };

  const handleSearchInputChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
      page: 1, // Reset to first page on search change
    }));
  };

  const handlePriceChange = (e, type) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      [`${type}_price`]: value,
      page: 1, // Reset to first page on price change
    }));
  };

  const filteredBrandsForUI = allBrands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTermLocal.toLowerCase())
  );

  const anyLoading =
    appGlobalLoading ||
    localCategoriesLoading ||
    localBrandsLoading ||
    productsLoading;
  const anyError =
    appGlobalError || localCategoriesError || localBrandsError || productsError;

  if (anyLoading) {
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

  if (anyError) {
    return (
      <div
        className="mainContainer d-flex justify-content-center align-items-center"
        style={{ minHeight: "500px" }}
      >
        <Alert variant="danger">Error loading data: {anyError?.message}</Alert>
      </div>
    );
  }

  // Determine which product list to display based on initialSection or dynamic filters
  const productsToDisplay =
    initialSection &&
    [
      "flash-deals",
      "featured-products",
      "latest-products",
      "top-rated",
    ].includes(initialSection) &&
    !filters.search &&
    !filters.min_price &&
    !filters.max_price &&
    filters.category_ids.length === 0 &&
    filters.brand_ids.length === 0 &&
    filters.sort_by === "Default" &&
    filters.filter_by === "Default"
      ? (() => {
          switch (initialSection) {
            case "flash-deals":
              return flushDeals;
            case "featured-products":
              return featured;
            case "latest-products":
              return latests;
            case "top-rated":
              return topRated;
            default:
              return [];
          }
        })()
      : allProducts; // Otherwise, use the dynamically fetched products

  const currentPagination =
    initialSection &&
    [
      "flash-deals",
      "featured-products",
      "latest-products",
      "top-rated",
    ].includes(initialSection) &&
    !filters.search &&
    !filters.min_price &&
    !filters.max_price &&
    filters.category_ids.length === 0 &&
    filters.brand_ids.length === 0 &&
    filters.sort_by === "Default" &&
    filters.filter_by === "Default"
      ? {
          total: productsToDisplay.length,
          currentPage: 1,
          limit: productsToDisplay.length,
          lastPage: 1,
        }
      : allProductsPagination;

  return (
    <div className="mainContainer">
      <div className="first-section">
        <div className="productsAndProductsFoundSection">
          <h5>Products</h5>
          <p>{currentPagination.total || 0} Products found</p>
        </div>

        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search for items..."
            className="search-input"
            value={filters.search}
            onChange={handleSearchInputChange}
          />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>

        <div className="sort-by-containerr">
          <select
            className="sorting-item"
            onChange={handleSortChange}
            value={
              filters.sort_by === "unit_price" && filters.sort_order === "asc"
                ? "Price: Low to High"
                : filters.sort_by === "unit_price" &&
                  filters.sort_order === "desc"
                ? "Price: High to Low"
                : filters.sort_by === "name" && filters.sort_order === "asc"
                ? "Name: A to Z"
                : filters.sort_by === "name" && filters.sort_order === "desc"
                ? "Name: Z to A"
                : filters.sort_by === "rating" && filters.sort_order === "asc"
                ? "Rating: Low to High"
                : filters.sort_by === "rating" && filters.sort_order === "desc"
                ? "Rating: High to Low"
                : "Default"
            }
          >
            <option value="Default">Sort by Default</option>
            <option value="Price: Low to High">Price: Low to High</option>
            <option value="Price: High to Low">Price: High to Low</option>
            <option value="Name: A to Z">Name: A to Z</option>
            <option value="Name: Z to A">Name: Z to A</option>
            <option value="Rating: Low to High">Rating: Low to High</option>
            <option value="Rating: High to Low">Rating: High to Low</option>
          </select>
        </div>
        <div className="sort-by-containerr">
          <select
            className="sorting-item"
            onChange={handleFilterByChange}
            value={filters.filter_by}
          >
            <option value="Default">Filter by Default</option>
            <option value="best-selling">Best Selling</option>
            <option value="top-rated">Top Rated</option>
            <option value="flush-deals">Flush Deals</option>{" "}
            {/* Adjusted value */}
            <option value="featured-products">Featured Products</option>{" "}
            {/* Adjusted value */}
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
          <div className="sort-by-containerr">All Products</div>
          <div className="filter-group">
            <h4 className="productBy">Price</h4>
            <div className="price-inputs">
              <input
                type="number"
                className="price-input"
                placeholder="Min"
                value={filters.min_price}
                onChange={(e) => handlePriceChange(e, "min")}
              />
              <span>-</span>
              <input
                type="number"
                className="price-input"
                placeholder="Max"
                value={filters.max_price}
                onChange={(e) => handlePriceChange(e, "max")}
              />
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
            <h5 className="productBy">Categories</h5>
            {allCategories.length > 0 ? (
              <div
                className="categories-list-scrollable"
                style={{ maxHeight: "300px", overflowY: "auto" }}
              >
                {allCategories.map((category) => (
                  <div
                    key={category.id}
                    className={`category-item ${
                      filters.category_ids.includes(category.id)
                        ? "active-filter"
                        : ""
                    }`}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <div className="imageNameIcon">
                      <div className="category-header">
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
            <h5 className="productBy">Brands</h5>
            <div className="lower-search-bar-container">
              <input
                type="text"
                placeholder="Search for brands..."
                className="lower-search-input"
                value={searchTermLocal}
                onChange={(e) => setSearchTermLocal(e.target.value)}
              />
              <button className="lower-search-button">
                <i className="fas fa-search"></i>
              </button>
            </div>
            {localBrandsLoading ? (
              <p>Loading brands...</p>
            ) : localBrandsError ? (
              <p>Error loading brands: {localBrandsError.message}</p>
            ) : filteredBrandsForUI.length === 0 ? (
              <p>No brands found.</p>
            ) : (
              <div
                className="brands-list-scrollable"
                style={{ maxHeight: "300px", overflowY: "auto" }}
              >
                {filteredBrandsForUI.map((brand) => (
                  <div
                    key={brand.id}
                    className={`brands-items ${
                      filters.brand_ids.includes(brand.id)
                        ? "active-filter"
                        : ""
                    }`}
                    onClick={() => handleBrandClick(brand.id)}
                  >
                    <div className="imageNameIcon">
                      <div className="brand-header">
                        <div className="brand-title-wrapper">
                          {brand.image && (
                            <img
                              src={brand.image}
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
                            {truncateText(brand.name, 20)}
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
            {productsToDisplay.length > 0 ? (
              productsToDisplay.map((product) => (
                <div className="LatestProducts-card" key={product.id}>
                  <div className="LatestProducts-image-container">
                    <img
                      src={product.feature_image || product.image}
                      alt={product.name}
                      className="LatestProducts-image"
                    />
                  </div>
                  <h3 className="LatestProducts-productName">{product.name}</h3>
                  <p className="LatestProducts-productPrice">
                    ${product.unit_price}
                  </p>
                  {/* You can add a rating display here if product.rating is available */}
                  {product.rating && <p>Rating: {product.rating}/5</p>}
                </div>
              ))
            ) : (
              <p>No products available matching your criteria.</p>
            )}
          </div>
          {currentPagination.total > currentPagination.limit && ( // Only show pagination if there are more items than current limit
            <div className="pagination-controls mt-4 d-flex justify-content-center align-items-center">
              <button
                className="btn btn-outline-secondary me-2"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={currentPagination.currentPage === 1}
              >
                Previous
              </button>
              <span className="text-muted">
                {" "}
                Page {currentPagination.currentPage} of{" "}
                {currentPagination.lastPage}{" "}
              </span>
              <button
                className="btn btn-outline-secondary ms-2"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={
                  currentPagination.currentPage >= currentPagination.lastPage
                }
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPages;
