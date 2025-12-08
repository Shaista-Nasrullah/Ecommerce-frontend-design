import React, { useState, useEffect, useContext, useRef } from "react";
import "./categoryPages.css";
import { AppContext } from "../context/AppContext";
import { Spinner, Alert } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const truncateText = (text, maxLength) => {
  if (text && text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

const CategoryPages = () => {
  const [searchParams] = useSearchParams();
  const initialSection = searchParams.get("section");
  const paramCategoryId = searchParams.get("category_id");
  const paramSubCategoryId = searchParams.get("sub_category_id");
  const paramBrandId = searchParams.get("brand_id");
  const navigate = useNavigate();
  const MAX_PRICE_LIMIT = 1000;
  const [priceInput, setPriceInput] = useState({
    min: 0,
    max: MAX_PRICE_LIMIT,
  });

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

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
    allProducts,
    allProductsPagination,
    fetchAllProductsData,
  } = useContext(AppContext);

  const API_DEFAULT_LIMIT = 25;

  // --- FIX 1: Correctly initialize brand_ids from URL param ---
  const [filters, setFilters] = useState({
    search: "",
    min_price: "",
    max_price: "",
    fromPageCategory_ids: paramCategoryId ? [paramCategoryId] : [],
    sub_category_id: paramSubCategoryId || "",
    category_ids: [],
    brand_ids: paramBrandId ? [paramBrandId] : [],
    sort_by: "",
    isBestSelling: false,
    isTopRated: false,
    isFlushDeal: false,
    isFeatured: false,
    isLatest: false,
    page: 1,
    limit: API_DEFAULT_LIMIT,
  });

  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const [localCategoriesLoading, setLocalCategoriesLoading] = useState(true);
  const [localCategoriesError, setLocalCategoriesError] = useState(null);
  const [localBrandsLoading, setLocalBrandsLoading] = useState(true);
  const [localBrandsError, setLocalBrandsError] = useState(null);
  const [searchTermLocal, setSearchTermLocal] = useState("");
  const [currentHomepageSectionProducts, setCurrentHomepageSectionProducts] =
    useState([]);

  const isInitialMount = useRef(true);

  useEffect(() => {
    fetchAllCategoriesData(setLocalCategoriesLoading, setLocalCategoriesError);
    fetchBrandsData(setLocalBrandsLoading, setLocalBrandsError);
  }, [fetchAllCategoriesData, fetchBrandsData]);

  useEffect(() => {
    const paramCategoryId = searchParams.get("category_id");
    const paramSubCategoryId = searchParams.get("sub_category_id");
    const paramBrandId = searchParams.get("brand_id");

    // If URL has params, update state immediately
    if (paramCategoryId || paramSubCategoryId || paramBrandId) {
      setFilters((prev) => ({
        ...prev,
        fromPageCategory_ids: paramCategoryId ? [paramCategoryId] : [],
        category_ids: [],
        sub_category_id: paramSubCategoryId || "",
        brand_ids: paramBrandId ? [paramBrandId] : [],
        page: 1,
        search: "",
        isBestSelling: false,
        isTopRated: false,
        isFlushDeal: false,
        isFeatured: false,
        isLatest: false,
        min_price: "",
        max_price: "",
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    setPriceInput({
      min: filters.min_price !== "" ? Number(filters.min_price) : 0,
      max:
        filters.max_price !== "" ? Number(filters.max_price) : MAX_PRICE_LIMIT,
    });
  }, [filters.min_price, filters.max_price]);

  // Main effect to fetch products based on filters
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (!initialSection && !filters.search) {
        console.log(
          "CategoryPages useEffect: Initial mount with no section or search. Skipping fetch."
        );
      }
    }

    const fetchAndSetProducts = async () => {
      console.log(
        "CategoryPages useEffect triggered. Current filters:",
        filters
      );

      const hasDynamicFilters =
        filters.search ||
        filters.min_price ||
        filters.max_price ||
        filters.category_ids.length > 0 ||
        filters.fromPageCategory_ids.length > 0 ||
        filters.sub_category_id ||
        filters.brand_ids.length > 0 ||
        filters.sort_by !== "" ||
        filters.isBestSelling ||
        filters.isTopRated ||
        filters.isFlushDeal ||
        filters.isFeatured ||
        filters.isLatest;

      const isPureHomepageSection =
        initialSection &&
        [
          "flash-deals",
          "featured-products",
          "latest-products",
          "top-rated",
        ].includes(initialSection) &&
        !hasDynamicFilters;

      if (isPureHomepageSection) {
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
        setProductsLoading(false);
        setProductsError(null);
        setCurrentHomepageSectionProducts(sourceProducts);
      } else {
        setCurrentHomepageSectionProducts([]);
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
            fromPageCategory_ids: filters.fromPageCategory_ids,
            sub_category_id: filters.sub_category_id,
            brand_ids: filters.brand_ids,
            sort_by: filters.sort_by,
            isBestSelling: filters.isBestSelling,
            isTopRated: filters.isTopRated,
            isFlushDeal: filters.isFlushDeal,
            isFeatured: filters.isFeatured,
            isLatest: filters.isLatest,
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
    setProductsLoading,
    setProductsError,
    setCurrentHomepageSectionProducts,
  ]);

  const handleSearchInputChange = (e) => {
    setLocalSearchTerm(e.target.value);
  };

  const handleSearchSubmit = () => {
    console.log(
      "Search button clicked. Submitting search term:",
      localSearchTerm
    );
    setFilters((prev) => ({
      ...prev,
      search: localSearchTerm,
      page: 1,
    }));
  };

  const handleSortChange = (e) => {
    setFilters((prev) => ({ ...prev, sort_by: e.target.value, page: 1 }));
    setLocalSearchTerm("");
  };

  const handleSpecialFilterChange = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      isBestSelling: value === "best-selling",
      isTopRated: value === "top-rated",
      isFlushDeal: value === "flush-deals",
      isFeatured: value === "featured-products",
      isLatest: value === "latest-products",
      page: 1,
      ...(value !== "best-selling" && { isBestSelling: false }),
      ...(value !== "top-rated" && { isTopRated: false }),
      ...(value !== "flush-deals" && { isFlushDeal: false }),
      ...(value !== "featured-products" && { isFeatured: false }),
      ...(value !== "latest-products" && { isLatest: false }),
      search: "",
      min_price: "",
      max_price: "",
      category_ids: [],
      brand_ids: [],
    }));
    setLocalSearchTerm("");
  };

  const handleCategoryClick = (categoryId) => {
    setFilters((prev) => {
      const isAlreadySelected = prev.category_ids.includes(categoryId);
      return {
        ...prev,
        category_ids: isAlreadySelected ? [] : [categoryId],
        page: 1,
        isBestSelling: false,
        isTopRated: false,
        isFlushDeal: false,
        isFeatured: false,
        isLatest: false,
        search: "",
        min_price: "",
        max_price: "",
        brand_ids: [],
        fromPageCategory_ids: [],
        sub_category_id: "",
      };
    });
    setLocalSearchTerm("");
  };

  const handleBrandClick = (brandId) => {
    setFilters((prev) => {
      const isAlreadySelected = prev.brand_ids.includes(brandId);
      return {
        ...prev,
        brand_ids: isAlreadySelected ? [] : [brandId],
        page: 1,
        isBestSelling: false,
        isTopRated: false,
        isFlushDeal: false,
        isFeatured: false,
        isLatest: false,
        search: "",
        min_price: "",
        max_price: "",
        category_ids: [],
      };
    });
    setLocalSearchTerm("");
  };

  // Handle typing in inputs
  const handleLocalPriceInputChange = (e, type) => {
    let val = Number(e.target.value);
    if (val < 0) val = 0;
    if (val > MAX_PRICE_LIMIT) val = MAX_PRICE_LIMIT;

    setPriceInput((prev) => ({ ...prev, [type]: val }));
  };

  // Handle Slider Changes
  const handleSliderChange = (e) => {
    const val = Number(e.target.value);
    const name = e.target.name; // "min" or "max"

    setPriceInput((prev) => {
      // Prevent crossing logic (min > max)
      if (name === "min" && val > prev.max) return { ...prev, min: prev.max };
      if (name === "max" && val < prev.min) return { ...prev, max: prev.min };
      return { ...prev, [name]: val };
    });
  };

  // Apply Button Click
  const applyPriceFilter = () => {
    setFilters((prev) => ({
      ...prev,
      min_price: priceInput.min,
      max_price: priceInput.max,
      page: 1,
    }));
  };

  // Calculate percentage for slider track background
  const getPercent = (value) => Math.round((value / MAX_PRICE_LIMIT) * 100);
  const minPercent = getPercent(priceInput.min);
  const maxPercent = getPercent(priceInput.max);

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

  const hasActiveFiltersExcludingHomepageSection =
    filters.search ||
    filters.min_price ||
    filters.max_price ||
    filters.category_ids.length > 0 ||
    filters.brand_ids.length > 0 ||
    filters.sort_by !== "" ||
    filters.isBestSelling ||
    filters.isTopRated ||
    filters.isFlushDeal ||
    filters.isFeatured ||
    filters.isLatest;

  const productsToDisplay =
    initialSection &&
    [
      "flash-deals",
      "featured-products",
      "latest-products",
      "top-rated",
    ].includes(initialSection) &&
    !hasActiveFiltersExcludingHomepageSection
      ? currentHomepageSectionProducts
      : allProducts;

  const isShowingDynamicallyFetchedProducts =
    !initialSection || hasActiveFiltersExcludingHomepageSection;

  const currentPagination = isShowingDynamicallyFetchedProducts
    ? {
        total: allProductsPagination.total || 0,
        currentPage: allProductsPagination.current_page || 1,
        limit: allProductsPagination.per_page || API_DEFAULT_LIMIT,
        lastPage: allProductsPagination.last_page || 1,
      }
    : {
        total: productsToDisplay.length,
        currentPage: 1,
        limit: productsToDisplay.length,
        lastPage: 1,
      };

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
            value={localSearchTerm}
            onChange={handleSearchInputChange}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearchSubmit();
              }
            }}
          />
          <button
            type="button"
            className="search-button"
            onClick={handleSearchSubmit}
          >
            <i className="fas fa-search"></i>
          </button>
        </div>

        <div className="sort-by-containerr">
          <select
            className="sorting-item"
            onChange={handleSortChange}
            value={filters.sort_by}
          >
            <option value="">Sort by Default</option>

            {/* Verify if your API actually supports 'price_low_high' */}
            <option value="price_low_high">Price: Low to High</option>

            <option value="price_high_low">Price: High to Low</option>
            <option value="name_a_z">Name: A to Z</option>
            <option value="name_z_a">Name: Z to A</option>
            <option value="rating_low_high">Rating: Low to High</option>
            <option value="rating_high_low">Rating: High to Low</option>
          </select>
        </div>
        <div className="sort-by-containerr">
          <select
            className="sorting-item"
            onChange={handleSpecialFilterChange}
            value={
              filters.isBestSelling
                ? "best-selling"
                : filters.isTopRated
                ? "top-rated"
                : filters.isFlushDeal
                ? "flush-deals"
                : filters.isFeatured
                ? "featured-products"
                : filters.isLatest
                ? "latest-products"
                : "Default"
            }
          >
            <option value="Default">Filter by Default</option>
            <option value="best-selling">Best Selling</option>
            <option value="top-rated">Top Rated</option>
            <option value="flush-deals">Flush Deals</option>
            <option value="featured-products">Featured Products</option>
            <option value="latest-products">Latest Products</option>
          </select>
        </div>
        <div className="menu-display">
          <i className="fa fa-bars"></i>
        </div>
      </div>
      <div className="containerForSideFilterProducts">
        <div className="sideFilter">
          <h5 className="filterBy">Filter by</h5>
          {/* <h6 className="productBy">Product Type</h6> */}
          <div className="sort-by-containerr">All Products</div>
          <div className="filter-group">
            <h4 className="productBy">Price</h4>

            {/* PRICE INPUTS & BUTTON */}
            <div className="price-inputs-container">
              <div className="price-input-wrapper">
                <span className="price-label">Min</span>
                <input
                  type="number"
                  className="custom-price-input"
                  value={priceInput.min}
                  onChange={(e) => handleLocalPriceInputChange(e, "min")}
                />
              </div>
              <span className="price-separator">-</span>
              <div className="price-input-wrapper">
                <span className="price-label">Max</span>
                <input
                  type="number"
                  className="custom-price-input"
                  value={priceInput.max}
                  onChange={(e) => handleLocalPriceInputChange(e, "max")}
                />
              </div>
              <button className="price-apply-btn" onClick={applyPriceFilter}>
                <i className="fa fa-chevron-right"></i>
              </button>
            </div>

            {/* DOUBLE SLIDER */}
            <div className="range-slider-container">
              {/* The Range Inputs (Invisible but clickable) */}
              <input
                type="range"
                name="min"
                min={0}
                max={MAX_PRICE_LIMIT}
                value={priceInput.min}
                onChange={handleSliderChange}
                className="thumb thumb--left"
                style={{
                  zIndex: priceInput.min > MAX_PRICE_LIMIT - 100 && "5",
                }}
              />
              <input
                type="range"
                name="max"
                min={0}
                max={MAX_PRICE_LIMIT}
                value={priceInput.max}
                onChange={handleSliderChange}
                className="thumb thumb--right"
              />

              {/* The Visual Track */}
              <div className="slider">
                <div className="slider__track" />
                <div
                  className="slider__range"
                  style={{
                    left: `${minPercent}%`,
                    width: `${maxPercent - minPercent}%`,
                  }}
                />
              </div>
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
                    // Check string vs number types for highlighting
                    className={`brands-items ${
                      filters.brand_ids.includes(String(brand.id)) ||
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
                <div
                  className="LatestProducts-card"
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="LatestProducts-image-container">
                    <img
                      src={product.feature_image || product.image}
                      alt={product.name}
                      className="LatestProducts-image"
                    />
                  </div>
                  <h3 className="LatestProducts-productName">{product.name}</h3>
                  <p className="LatestProducts-productPrice">
                    Rs.{product.unit_price}
                  </p>
                </div>
              ))
            ) : (
              <p>No products available matching your criteria.</p>
            )}
          </div>
          {isShowingDynamicallyFetchedProducts &&
            currentPagination.lastPage > 1 && (
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
