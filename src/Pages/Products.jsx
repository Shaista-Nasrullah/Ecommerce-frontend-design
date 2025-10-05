import React, { useState, useEffect } from "react";
import productsData from "../Components/Assets/all_product.js";
import "./Products.css"; // Import the CSS file for styling

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(4000);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState("Default"); // New state for sorting

  // Static filter data for demonstration
  const categories = [
    "All",
    "Groceries & Dailies",
    "Musical Instruments",
    "Gifts & Crafts",
    "Books & Stationery",
    "Electronics",
    "Clothing",
    "Jewelry",
  ];
  const brands = [
    "Keihoton",
    "Electrical Charge",
    "Electronic Store",
    "Global Tech",
    "UrbanEdge",
    "Cool Sneakers",
    "Tech Connect",
    "OTO Speedios",
    "Power Energy",
    "Fashionista",
  ];

  useEffect(() => {
    if (productsData && Array.isArray(productsData)) {
      setProducts(productsData);
    } else {
      console.error("productsData is not an array or is empty:", productsData);
    }
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(Number(e.target.value));
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(Number(e.target.value));
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
  };

  const filteredAndSortedProducts = products
    .filter((product) => {
      const matchesSearchTerm = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const productPrice = product.new_price || product.price || 0;
      const matchesPrice = productPrice >= minPrice && productPrice <= maxPrice;
      const matchesCategory =
        selectedCategory === "All" ||
        (product.category &&
          product.category.toLowerCase() === selectedCategory.toLowerCase());
      const matchesBrand =
        selectedBrands.length === 0 ||
        (product.brand &&
          selectedBrands
            .map((b) => b.toLowerCase())
            .includes(product.brand.toLowerCase()));

      return (
        matchesSearchTerm && matchesPrice && matchesCategory && matchesBrand
      );
    })
    .sort((a, b) => {
      const priceA = a.new_price || a.price || 0;
      const priceB = b.new_price || b.price || 0;
      switch (sortBy) {
        case "Price: Low to High":
          return priceA - priceB;
        case "Price: High to Low":
          return priceB - priceA;
        case "Name: A to Z":
          return a.name.localeCompare(b.name);
        case "Name: Z to A":
          return b.name.localeCompare(a.name);
        default:
          return 0; // Default or no sorting
      }
    });

  if (products.length === 0) {
    return (
      <div className="products-container">
        <h1>Our Products</h1>
        <p>No products found or still loading...</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="top-filter-bar">
        <div className="ProductsAndSearch">
          <div>
            <h6 className="page-title">Women's Fashion Products</h6>
            <p>20 Products found</p>
          </div>

          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search for items..."
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="search-button">
              <i className="fas fa-search"></i> {/* Font Awesome search icon */}
            </button>
          </div>
        </div>

        <div className="sort-by-container">
          <select
            value={sortBy}
            onChange={handleSortByChange}
            className="sort-select"
          >
            <option value="Default">Sort by Default</option>
            <option value="Price: Low to High">Price: Low to High</option>
            <option value="Price: High to Low">Price: High to Low</option>
            <option value="Name: A to Z">Name: A to Z</option>
            <option value="Name: Z to A">Name: Z to A</option>
          </select>
        </div>
        <div className="sort-by-container">
          <select
            value={sortBy}
            onChange={handleSortByChange}
            className="sort-select"
          >
            <option value="Default">Filter by Default</option>
            <option value="best-selling">Best Selling</option>
            <option value="top-rated">Top Rated</option>
            <option value="most-favourite">Most Favourite</option>
          </select>
        </div>
        {/* You can add a "Filter By" dropdown here if needed for smaller screens */}
      </div>

      <div className="main-content-area">
        <aside className="left-filter-sidebar">
          <h3>Filter By</h3>

          {/* Product Type Filter */}
          <div className="filter-group">
            <h4>Product Type</h4>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="product-type-select"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="filter-group">
            <h4>Price</h4>
            <div className="price-inputs">
              <input
                type="number"
                value={minPrice}
                onChange={handleMinPriceChange}
                className="price-input"
              />
              <span>-</span>
              <input
                type="number"
                value={maxPrice}
                onChange={handleMaxPriceChange}
                className="price-input"
              />
            </div>
            {/* You could add a range slider here if desired */}
            <div className="range-slider-mock">
              <input
                type="range"
                min="0"
                max="5000"
                value={minPrice}
                onChange={handleMinPriceChange}
                className="slider-min"
              />
              <input
                type="range"
                min="0"
                max="5000"
                value={maxPrice}
                onChange={handleMaxPriceChange}
                className="slider-max"
              />
              <div
                className="slider-track"
                style={{
                  left: `${(minPrice / 5000) * 100}%`,
                  right: `${100 - (maxPrice / 5000) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Categories Filter (if different from Product Type) */}
          <div className="filter-group">
            <h4>Categories</h4>
            {categories
              .filter((cat) => cat !== "All")
              .map(
                (
                  category // Exclude 'All' from this specific list if needed
                ) => (
                  <div key={category} className="category-item">
                    <input
                      type="radio"
                      id={`cat-${category}`}
                      name="left-category-filter"
                      value={category}
                      checked={selectedCategory === category}
                      onChange={() => handleCategoryChange(category)}
                    />
                    <label htmlFor={`cat-${category}`}>{category}</label>
                  </div>
                )
              )}
            <div className="category-item">
              <input
                type="radio"
                id={`cat-All`}
                name="left-category-filter"
                value="All"
                checked={selectedCategory === "All"}
                onChange={() => handleCategoryChange("All")}
              />
              <label htmlFor={`cat-All`}>All</label>
            </div>
          </div>

          {/* Brands Filter */}
          <div className="filter-group">
            <h4>Brands</h4>
            <input
              type="text"
              placeholder="Search by brands"
              className="search-brands-input"
            />
            <div className="brand-list">
              {brands.map((brand) => (
                <div key={brand} className="brand-item">
                  <input
                    type="checkbox"
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                  />
                  <label htmlFor={`brand-${brand}`}>{brand}</label>
                  <span className="brand-count">
                    {Math.floor(Math.random() * 50) + 1}
                  </span>{" "}
                  {/* Static count for demo */}
                </div>
              ))}
            </div>
          </div>

          {/* Publishing House, Authors, etc. can go here following similar patterns */}
        </aside>

        <div className="product-grid-container">
          <p className="item-count">
            {filteredAndSortedProducts.length} Items found
          </p>
          <div className="product-grid">
            {filteredAndSortedProducts.map((product) => (
              <div key={product.id} className="product-card">
                {product.old_price && (
                  <div className="discount-tag">
                    -
                    {(
                      ((product.old_price - product.new_price) /
                        product.old_price) *
                      100
                    ).toFixed(0)}
                    %
                  </div>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-info">
                  <h2 className="product-name">{product.name}</h2>
                  <div className="product-prices">
                    {product.old_price && (
                      <p className="old-price">
                        ${product.old_price.toFixed(2)}
                      </p>
                    )}
                    <p className="current-price">
                      ${(product.new_price || product.price || 0).toFixed(2)}
                    </p>
                  </div>
                  {/* Static star ratings for demo */}
                  <div className="product-rating">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="far fa-star"></i> {/* Half or empty star */}
                    <span className="rating-count">
                      ({Math.floor(Math.random() * 100) + 1})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredAndSortedProducts.length === 0 && (
            <p className="no-products-message">
              No products match your filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
