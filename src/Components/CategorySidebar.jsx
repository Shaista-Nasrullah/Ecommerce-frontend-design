import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Nav, Spinner, Alert } from "react-bootstrap";
import { AppContext } from "../context/AppContext";
import "./CategorySidebar.css";

const CategorySidebar = () => {
  const {
    allCategories = [],
    fetchAllCategoriesData,
    fetchSubCategoriesData,
  } = useContext(AppContext);

  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  const [localCategoriesLoading, setLocalCategoriesLoading] = useState(true);
  const [localCategoriesError, setLocalCategoriesError] = useState(null);
  const [showSubCategories, setShowSubCategories] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);

  // Timer for handling the menu closing delay
  const closeTimer = useRef(null);

  useEffect(() => {
    if (allCategories.length === 0) {
      fetchAllCategoriesData(
        setLocalCategoriesLoading,
        setLocalCategoriesError
      );
    } else {
      setLocalCategoriesLoading(false);
    }
  }, [fetchAllCategoriesData, allCategories]);

  const getSubCategories = useCallback(
    async (categoryId) => {
      setLoadingSubCategories(true);
      const data = await fetchSubCategoriesData(
        categoryId,
        setLoadingSubCategories,
        () => {}
      );
      setSubCategories(data || []);
      setLoadingSubCategories(false);
    },
    [fetchSubCategoriesData]
  );

  // --- MOUSE EVENTS ---
  const handleMouseEnter = (category) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    if (category?.id) {
      if (activeCategory?.id !== category.id) {
        setActiveCategory(category);
        getSubCategories(category.id);
        setShowSubCategories(true);
      }
    }
  };

  const handleMouseLeave = () => {
    // Grace period: Wait 300ms before closing
    closeTimer.current = setTimeout(() => {
      setShowSubCategories(false);
      setActiveCategory(null);
    }, 300);
  };

  const handlePanelEnter = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  // --- CLICK HANDLER ---
  const handleSubCategoryClick = (e, parentId, subId) => {
    e.preventDefault();
    e.stopPropagation();

    // Navigate
    navigate(`/shop?category_id=${parentId}&sub_category_id=${subId}`);

    // Close Menu
    setShowSubCategories(false);
    setActiveCategory(null);
  };

  if (localCategoriesLoading)
    return (
      <div className="sidebar-container p-3 text-center">
        <Spinner animation="border" size="sm" />
      </div>
    );
  if (localCategoriesError)
    return <Alert variant="danger">Error loading categories.</Alert>;

  return (
    <div
      className={`category-megamenu-container ${isHomePage ? "homepage" : ""}`}
      onMouseLeave={handleMouseLeave}
      // Ensure Z-Index is high enough
      style={{ zIndex: 9999, position: "absolute" }}
    >
      <div className="sidebar-container">
        <Nav className="flex-column">
          {allCategories.map((category) => (
            <Nav.Link
              key={category.id}
              onMouseEnter={() => handleMouseEnter(category)}
              className={`text-secondary category-link-with-icon text-black d-flex justify-content-between align-items-center ${
                activeCategory?.id === category.id ? "active" : ""
              }`}
            >
              <div className="category-name">
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="category-icon mr-2"
                  />
                )}
                {category.name}
              </div>
              <span className="right-icon">
                <i className="fa fa-chevron-right"></i>
              </span>
            </Nav.Link>
          ))}
        </Nav>
      </div>

      {showSubCategories && (
        <div
          className="sub-category-panel"
          onMouseEnter={handlePanelEnter}
          // Inline styles to ensure correct layout and stacking
          style={{
            position: "absolute",
            left: "275px", // Slight overlap with sidebar
            top: 0,
            width: "900px",
            height: "402px",
            zIndex: 10000,
            backgroundColor: "white",
            borderLeft: "1px solid #eee",
            boxShadow: "5px 0 15px rgba(0,0,0,0.1)",
            display: "block",
            overflowY: "auto",
            padding: "20px",
          }}
        >
          {loadingSubCategories ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <Spinner animation="border" />
            </div>
          ) : subCategories.length > 0 ? (
            <div className="sub-category-columns d-flex flex-wrap">
              {/* --- FIX: Treat subCategories as direct items, not groups --- */}
              {subCategories.map((subCat) => (
                <div
                  key={subCat.id}
                  className="sub-category-item-wrapper"
                  style={{ width: "33%", marginBottom: "10px" }} // 3 Columns
                >
                  <div
                    className="custom-sub-link"
                    onMouseDown={(e) =>
                      handleSubCategoryClick(e, activeCategory.id, subCat.id)
                    }
                    style={{
                      cursor: "pointer",
                      color: "#333",
                      fontSize: "14px",
                      fontWeight: "500",
                      padding: "5px",
                      display: "block",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.color = "#007bff")
                    }
                    onMouseOut={(e) => (e.currentTarget.style.color = "#333")}
                  >
                    {subCat.name}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="p-3 text-muted">No subcategories found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategorySidebar;
