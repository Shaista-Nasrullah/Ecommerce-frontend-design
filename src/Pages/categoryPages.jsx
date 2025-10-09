import React, { useState, useEffect, useContext, useCallback } from "react";
import "./categoryPages.css";
import { AppContext } from "../context/AppContext";
import { Spinner, Alert } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";

const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

// --- MOCK PRODUCT DATA (REMAINS FOR THE /api/products SIMULATION) ---
const MOCK_PRODUCTS_API = [
  {
    id: 101,
    name: "Honor X14 Plus Laptop",
    description: "Powerful laptop with a sleek design and fast performance.",
    unit_price: 1680.0,
    discount_price: 2200.0,
    feature_image:
      "https://via.placeholder.com/150/FF5733/FFFFFF?text=Honor+Laptop",
    image: "https://via.placeholder.com/150/FF5733/FFFFFF?text=Honor+Laptop",
    category_id: 7, // Example category ID
    brand_id: 1, // Example brand ID
    rating: 4.5,
  },
  {
    id: 102,
    name: "Apple MacBook Air M2",
    description: "Lightweight and powerful for everyday tasks.",
    unit_price: 1199.0,
    discount_price: 1300.0,
    feature_image:
      "https://via.placeholder.com/150/007AFF/FFFFFF?text=MacBook+Air",
    image: "https://via.placeholder.com/150/007AFF/FFFFFF?text=MacBook+Air",
    category_id: 7,
    brand_id: 2,
    rating: 4.8,
  },
  {
    id: 103,
    name: "Samsung Galaxy Tab S8",
    description: "Premium Android tablet for productivity and entertainment.",
    unit_price: 699.0,
    discount_price: 750.0,
    feature_image:
      "https://via.placeholder.com/150/1C3144/FFFFFF?text=Galaxy+Tab",
    image: "https://via.placeholder.com/150/1C3144/FFFFFF?text=Galaxy+Tab",
    category_id: 8, // Example category ID
    brand_id: 3,
    rating: 4.3,
  },
  {
    id: 104,
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise canceling headphones.",
    unit_price: 349.0,
    discount_price: 399.0,
    feature_image:
      "https://via.placeholder.com/150/000000/FFFFFF?text=Sony+Headphones",
    image: "https://via.placeholder.com/150/000000/FFFFFF?text=Sony+Headphones",
    category_id: 9, // Example category ID
    brand_id: 4,
    rating: 4.7,
  },
  {
    id: 105,
    name: "Dell XPS 15",
    description: "High-performance laptop for creative professionals.",
    unit_price: 2199.0,
    discount_price: 2400.0,
    feature_image:
      "https://via.placeholder.com/150/007ACC/FFFFFF?text=Dell+XPS",
    image: "https://via.placeholder.com/150/007ACC/FFFFFF?text=Dell+XPS",
    category_id: 7,
    brand_id: 5,
    rating: 4.6,
  },
  {
    id: 106,
    name: "Google Pixel 7 Pro",
    description: "Advanced camera system and Google AI.",
    unit_price: 899.0,
    discount_price: 950.0,
    feature_image:
      "https://via.placeholder.com/150/4285F4/FFFFFF?text=Pixel+7+Pro",
    image: "https://via.placeholder.com/150/4285F4/FFFFFF?text=Pixel+7+Pro",
    category_id: 10, // Example category ID
    brand_id: 6,
    rating: 4.4,
  },
  {
    id: 107,
    name: "Logitech MX Master 3S",
    description: "Advanced wireless mouse for ultimate productivity.",
    unit_price: 99.0,
    discount_price: 120.0,
    feature_image:
      "https://via.placeholder.com/150/666666/FFFFFF?text=Logitech+Mouse",
    image: "https://via.placeholder.com/150/666666/FFFFFF?text=Logitech+Mouse",
    category_id: 11, // Example category ID
    brand_id: 7,
    rating: 4.9,
  },
  {
    id: 108,
    name: "Amazon Echo Dot (5th Gen)",
    description: "Smart speaker with Alexa.",
    unit_price: 49.0,
    discount_price: 59.0,
    feature_image:
      "https://via.placeholder.com/150/232F3E/FFFFFF?text=Echo+Dot",
    image: "https://via.placeholder.com/150/232F3E/FFFFFF?text=Echo+Dot",
    category_id: 12, // Example category ID
    brand_id: 8,
    rating: 4.2,
  },
  {
    id: 109,
    name: "Razer Blade 15",
    description: "High-performance gaming laptop.",
    unit_price: 1800.0,
    discount_price: 2000.0,
    feature_image:
      "https://via.placeholder.com/150/00FF00/FFFFFF?text=Razer+Laptop",
    image: "https://via.placeholder.com/150/00FF00/FFFFFF?text=Razer+Laptop",
    category_id: 7,
    brand_id: 9,
    rating: 4.6,
  },
  {
    id: 110,
    name: "Bose QuietComfort Earbuds II",
    description: "World-class noise cancellation.",
    unit_price: 279.0,
    discount_price: 299.0,
    feature_image:
      "https://via.placeholder.com/150/808080/FFFFFF?text=Bose+Earbuds",
    image: "https://via.placeholder.com/150/808080/FFFFFF?text=Bose+Earbuds",
    category_id: 9,
    brand_id: 10,
    rating: 4.5,
  },
  {
    id: 111,
    name: "Kindle Paperwhite",
    description: "Thin, lightweight, and waterproof.",
    unit_price: 139.0,
    discount_price: 150.0,
    feature_image: "https://via.placeholder.com/150/C0C0C0/FFFFFF?text=Kindle",
    image: "https://via.placeholder.com/150/C0C0C0/FFFFFF?text=Kindle",
    category_id: 13, // New mock category ID
    brand_id: 8, // Amazon brand
    rating: 4.7,
  },
  {
    id: 112,
    name: "Fitbit Charge 5",
    description: "Advanced fitness and health tracker.",
    unit_price: 149.0,
    discount_price: 169.0,
    feature_image: "https://via.placeholder.com/150/008080/FFFFFF?text=Fitbit",
    image: "https://via.placeholder.com/150/008080/FFFFFF?text=Fitbit",
    category_id: 14, // New mock category ID
    brand_id: 11, // Fitbit brand
    rating: 4.3,
  },
];

// --- END MOCK PRODUCT DATA ---

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
  } = useContext(AppContext);

  const [filters, setFilters] = useState({
    search: "",
    min_price: "",
    max_price: "",
    category_ids: [], // Array to hold selected category IDs
    brand_ids: [], // Array to hold selected brand IDs
    sort_by: "Default",
    sort_order: "asc",
    filter_by: "Default",
    page: 1,
    limit: 8,
  });

  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const [paginationInfo, setPaginationInfo] = useState({
    total: 0,
    currentPage: 1,
    limit: filters.limit,
  });

  const [localCategoriesLoading, setLocalCategoriesLoading] = useState(true);
  const [localCategoriesError, setLocalCategoriesError] = useState(null);
  const [localBrandsLoading, setLocalBrandsLoading] = useState(true);
  const [localBrandsError, setLocalBrandsError] = useState(null);
  const [searchTermLocal, setSearchTermLocal] = useState("");

  useEffect(() => {
    fetchAllCategoriesData(setLocalCategoriesLoading, setLocalCategoriesError);
    fetchBrandsData(setLocalBrandsLoading, setLocalBrandsError);
  }, [fetchAllCategoriesData, fetchBrandsData]);

  const fetchProductsMockApi = useCallback(
    async (currentFilters, currentPage, currentLimit) => {
      setProductsLoading(true);
      setProductsError(null);

      await new Promise((resolve) => setTimeout(resolve, 500));

      try {
        let filteredData = [...MOCK_PRODUCTS_API];

        if (currentFilters.search) {
          const searchTermLower = currentFilters.search.toLowerCase();
          filteredData = filteredData.filter(
            (p) =>
              p.name.toLowerCase().includes(searchTermLower) ||
              p.description.toLowerCase().includes(searchTermLower)
          );
        }
        if (currentFilters.min_price) {
          filteredData = filteredData.filter(
            (p) => p.unit_price >= parseFloat(currentFilters.min_price)
          );
        }
        if (currentFilters.max_price) {
          filteredData = filteredData.filter(
            (p) => p.unit_price <= parseFloat(currentFilters.max_price)
          );
        }
        if (
          currentFilters.category_ids &&
          currentFilters.category_ids.length > 0
        ) {
          filteredData = filteredData.filter((p) =>
            currentFilters.category_ids.includes(p.category_id)
          );
        }
        if (currentFilters.brand_ids && currentFilters.brand_ids.length > 0) {
          filteredData = filteredData.filter((p) =>
            currentFilters.brand_ids.includes(p.brand_id)
          );
        }

        if (currentFilters.filter_by === "best-selling") {
          filteredData.sort((a, b) => b.id - a.id);
        } else if (currentFilters.filter_by === "top-rated") {
          filteredData.sort((a, b) => b.rating - a.rating);
        }

        if (currentFilters.sort_by && currentFilters.sort_by !== "Default") {
          filteredData.sort((a, b) => {
            let valA = a[currentFilters.sort_by];
            let valB = b[currentFilters.sort_by];
            if (typeof valA === "string" && typeof valB === "string") {
              return currentFilters.sort_order === "asc"
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA);
            }
            return currentFilters.sort_order === "asc"
              ? valA - valB
              : valB - valA;
          });
        }

        const totalProducts = filteredData.length;
        const startIndex = (currentPage - 1) * currentLimit;
        const endIndex = startIndex + currentLimit;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        setDisplayedProducts(paginatedData);
        setPaginationInfo({
          total: totalProducts,
          currentPage: currentPage,
          limit: currentLimit,
        });
      } catch (err) {
        console.error("Failed to fetch products (mock API):", err);
        setProductsError(err);
      } finally {
        setProductsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const hasNewAPIFilters =
      filters.search ||
      filters.min_price ||
      filters.max_price ||
      filters.category_ids.length > 0 || // Now includes category/brand clicks
      filters.brand_ids.length > 0 ||
      filters.sort_by !== "Default" ||
      filters.filter_by !== "Default";

    const existingApiSections = [
      "flash-deals",
      "featured-products",
      "latest-products",
      "best-selling",
      "top-rated",
    ];

    if (
      initialSection &&
      existingApiSections.includes(initialSection) &&
      !hasNewAPIFilters
    ) {
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
        case "best-selling":
        case "top-rated":
          sourceProducts = topRated || [];
          break;
        default:
          sourceProducts = [];
          break;
      }
      setDisplayedProducts(sourceProducts);
      setPaginationInfo({
        total: sourceProducts.length,
        currentPage: 1,
        limit:
          sourceProducts.length > 0 ? sourceProducts.length : filters.limit,
      });
      setProductsLoading(false);
      setProductsError(null);
    } else {
      const apiFilters = {
        ...filters,
        section:
          initialSection && !existingApiSections.includes(initialSection)
            ? initialSection
            : undefined,
      };
      fetchProductsMockApi(apiFilters, filters.page, filters.limit);
    }
  }, [
    initialSection,
    filters,
    fetchProductsMockApi,
    flushDeals,
    featured,
    latests,
    topRated,
  ]);

  const handleSortChange = (e) => {
    const value = e.target.value;
    let sortBy = "Default";
    let sortOrder = "asc";

    switch (value) {
      case "Price: Low to High":
        sortBy = "unit_price";
        sortOrder = "asc";
        break;
      case "Price: High to Low":
        sortBy = "unit_price";
        sortOrder = "desc";
        break;
      case "Name: A to Z":
        sortBy = "name";
        sortOrder = "asc";
        break;
      case "Name: Z to A":
        sortBy = "name";
        sortOrder = "desc";
        break;
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
      page: 1,
    }));
  };

  const handleFilterByChange = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      filter_by: value,
      page: 1,
    }));
  };

  // New handler for clicking a category row
  const handleCategoryClick = (categoryId) => {
    setFilters((prev) => {
      const currentCategoryIds = prev.category_ids;
      if (currentCategoryIds.includes(categoryId)) {
        return {
          ...prev,
          category_ids: currentCategoryIds.filter((id) => id !== categoryId), // Remove if already selected
          page: 1,
        };
      } else {
        return {
          ...prev,
          category_ids: [...currentCategoryIds, categoryId], // Add if not selected
          page: 1,
        };
      }
    });
  };

  // New handler for clicking a brand row
  const handleBrandClick = (brandId) => {
    setFilters((prev) => {
      const currentBrandIds = prev.brand_ids;
      if (currentBrandIds.includes(brandId)) {
        return {
          ...prev,
          brand_ids: currentBrandIds.filter((id) => id !== brandId), // Remove if already selected
          page: 1,
        };
      } else {
        return {
          ...prev,
          brand_ids: [...currentBrandIds, brandId], // Add if not selected
          page: 1,
        };
      }
    });
  };

  const handleSearchInputChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
      page: 1,
    }));
  };

  const handlePriceChange = (e, type) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      [`${type}_price`]: value,
      page: 1,
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

  return (
    <div className="mainContainer">
      <div className="first-section">
        <div className="productsAndProductsFoundSection">
          <h5>Products</h5>
          <p>{paginationInfo.total || 0} Products found</p>
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
            <option value="top-rated">Flush Deals</option>
            <option value="top-rated">Featured Products</option>
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
            All Products
            {/* <select className="sorting-item">
              <option value="Default">All</option>
              <option value="physical">Physical</option>
              <option value="digital">Digital</option>
            </select> */}
          </div>
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
                    }`} // Add active class
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
                    }`} // Add active class
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
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product) => (
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
                </div>
              ))
            ) : (
              <p>No products available matching your criteria.</p>
            )}
          </div>
          {paginationInfo.total > filters.limit && (
            <div className="pagination-controls mt-4 d-flex justify-content-center align-items-center">
              <button
                className="btn btn-outline-secondary me-2"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={filters.page === 1}
              >
                Previous
              </button>
              <span className="text-muted">
                {" "}
                Page {filters.page} of{" "}
                {Math.ceil(paginationInfo.total / filters.limit)}{" "}
              </span>
              <button
                className="btn btn-outline-secondary ms-2"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={filters.page * filters.limit >= paginationInfo.total}
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
