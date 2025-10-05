import React, { useState, useEffect, useContext } from "react";
import "./categoryPages.css";
import category1 from "../Components/Assets/category1.png";
import category2 from "../Components/Assets/category2.png";
import category3 from "../Components/Assets/category3.png";
import category4 from "../Components/Assets/category4.png";
import category5 from "../Components/Assets/category5.png";
import category6 from "../Components/Assets/category6.png";
import category7 from "../Components/Assets/category7.png";
import category8 from "../Components/Assets/category8.png";
import LatestProduct1 from "../Components/Assets/latestProduct1.png";
import LatestProduct2 from "../Components/Assets/latestProduct2.png";
import LatestProduct3 from "../Components/Assets/latestProduct3.png";
import LatestProduct4 from "../Components/Assets/latestProduct4.png";
import LatestProduct5 from "../Components/Assets/latestProduct5.png";
import LatestProduct6 from "../Components/Assets/latestProduct6.png";
import LatestProduct7 from "../Components/Assets/latestProduct7.png";
import LatestProduct8 from "../Components/Assets/latestProduct8.png";
import { AppContext } from "../context/AppContext"; // Import AppContext

// Utility function to truncate text
const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

const CategoryPages = () => {
  const [openCategory, setOpenCategory] = useState(null); // State to manage which category dropdown is open
  const [searchTerm, setSearchTerm] = useState(""); // State for brand search term
  const { brands, loading, error } = useContext(AppContext); // Use AppContext to get brands data

  const subCategoriesData = {
    "Health & Beauty": ["Skincare", "Makeup", "Haircare", "Fragrances"],
    "Pet Supplies": ["Dog Food", "Cat Toys", "Pet Beds"],
    "Home & Kitchen": ["Cookware", "Bakeware", "Appliance", "Kitchen Tools"],
    "Baby & Toddler": ["Diapers", "Baby Food", "Strollers", "Toys"],
    "Sports & Outdoor": ["Fitness Gear", "Camping", "Cycling", "Running"],
    "Phone & Gadgets": ["Smartphones", "Accessories", "Wearables"],
    "Electro & pens": ["Laptops", "TVs", "Headphones", "Cameras"],
    "Groceries & Dailies": ["Fresh Produce", "Dairy", "Snacks", "Beverages"],
  };

  const categoryImages = {
    "Health & Beauty": category1,
    "Pet Supplies": category2,
    "Home & Kitchen": category3,
    "Baby & Toddler": category4,
    "Sports & Outdoor": category5,
    "Phone & Gadgets": category6,
    "Electro & pens": category7,
    "Groceries & Dailies": category8,
  };

  const handleCategoryClick = (categoryName) => {
    setOpenCategory(openCategory === categoryName ? null : categoryName); // Toggle dropdown
  };

  const products = [
    {
      name: "Edelbrock Cylinder Head",
      price: "$900.00",
      image: LatestProduct1,
    },
    {
      name: "Combo Trailer Light Set",
      price: "$35.00",
      image: LatestProduct2,
    },
    {
      name: "Waterproof Seat Protector",
      price: "$25.00",
      image: LatestProduct3,
    },
    {
      name: "HP BOSS CRATE ENGINE",
      price: "$2,600.00",
      image: LatestProduct4,
    },
    {
      name: "Car Interior LED Lights",
      price: "$30.00",
      image: LatestProduct5,
    },
    {
      name: "Lug White Spoke Wheel",
      price: "$80.00",
      image: LatestProduct6,
    },
    {
      name: "Storage Large Tool Box",
      price: "$60.00",
      image: LatestProduct7,
    },
    {
      name: "Daily Maintenance Hardware",
      price: "$50.00",
      image: LatestProduct8,
    },
  ];

  // Filter brands based on search term
  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mainContainer">
      <div className="first-section">
        <div className="productsAndProductsFoundSection">
          <h5>Products</h5>
          <p>5 Products found</p>
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
            {Object.keys(subCategoriesData).map((category) => (
              <div key={category} className="category-item">
                <div className="imageNameIcon">
                  <div
                    className="category-header"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <div className="category-title-wrapper">
                      {categoryImages[category] && (
                        <img
                          src={categoryImages[category]}
                          alt={category}
                          className="category-icon-pages"
                        />
                      )}
                      <span className="category-name-pages">{category}</span>
                    </div>
                  </div>
                  <div className="icons">
                    <i
                      className={` fa ${
                        openCategory === category
                          ? "fa-chevron-up"
                          : "fa-chevron-down"
                      } category-dropdown-icon`}
                    ></i>
                  </div>
                </div>

                {openCategory === category && (
                  <div className="sub-categories-list">
                    {subCategoriesData[category].map((subCat) => (
                      <a href="#" key={subCat} className="sub-category-link">
                        {subCat}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
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
            {loading ? (
              <p>Loading brands...</p>
            ) : error ? (
              <p>Error loading brands: {error.message}</p>
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
                            {truncateText(brand.name, 20)}{" "}
                            {/* Applied truncateText */}
                          </span>
                        </div>
                      </div>
                      {/* If you want to show a count for each brand, you'll need to calculate it */}
                      {/* For now, just a placeholder or remove it if not needed */}
                      {/* <div className="brand-qty">
                        <p>7</p> 
                      </div> */}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="productsSectionCategory">
          <div className="LatestProducts-grid">
            {products.map((product, index) => (
              <div className="LatestProducts-card" key={index}>
                <div className="LatestProducts-image-container">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="LatestProducts-image"
                  />
                </div>
                <h3 className="LatestProducts-productName">{product.name}</h3>
                <p className="LatestProducts-productPrice">{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPages;
