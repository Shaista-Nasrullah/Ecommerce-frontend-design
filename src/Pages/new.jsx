import React, { useState, useEffect, useContext } from "react";
import "./categoryPages.css";
import { AppContext } from "./context/AppContext";
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
  const navigate = useNavigate();
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
  const API_DEFAULT_LIMIT = 10;

  const [filters, setFilters] = useState({
    search: "",
    min_price: "",
    max_price: "",
    category_ids: [],
    brand_ids: [],
    sort_by: "",
    isBestSelling: false,
    isTopRated: false,
    isFlushDeal: false,
    isFeatured: false,
    isLatest: false,
    page: 1,
    limit: API_DEFAULT_LIMIT,
  });
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const [localCategoriesLoading, setLocalCategoriesLoading] = useState(false);
  const [localCategoriesError, setLocalCategoriesError] = useState(null);
  const [localBrandsLoading, setLocalBrandsLoading] = useState(false);
  const [localBrandsError, setLocalBrandsError] = useState(null);
  const [searchTermLocal, setSearchTermLocal] = useState("");
  const [currentHomepageSectionProducts, setCurrentHomepageSectionProducts] =
    useState([]);

  useEffect(() => {
    fetchAllCategoriesData(setLocalCategoriesLoading, setLocalCategoriesError);
    fetchBrandsData(setLocalBrandsLoading, setLocalBrandsError);
  }, [fetchAllCategoriesData, fetchBrandsData]);

  useEffect(() => {
    const fetchAndSetProducts = async () => {
      console.log(
        "CategoryPages useEffect triggered. Current filters:",
        filters
      );

      const isHomepageSection =
        initialSection &&
        ["flush_deals", "top_rated", "featured", "latest"].includes(
          initialSection
        ) &&
        !filters.search &&
        !filters.min_price &&
        !filters.max_price &&
        filters.category_ids.length === 0 &&
        filters.brand_ids.length === 0 &&
        filters.sort_by === "" &&
        !filters.isBestSelling &&
        !filters.isTopRated &&
        !filters.isFlushDeal &&
        !filters.isFeatured &&
        !filters.isLatest;

      if (isHomepageSection) {
        let sourceProducts = [];
        switch (initialSection) {
          case "flush_deals":
            sourceProducts = flushDeals || [];
            break;
          case "top_rated":
            sourceProducts = topRated || [];
            break;
          case "featured":
            sourceProducts = featured || [];
            break;
          case "latest":
            sourceProducts = latests || [];
            break;
          default:
            sourceProducts = [];
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
    topRated,
    featured,
    latests,
  ]);

  const handleSortChange = (e) => {
    const value = e.target.value;
    let sortByCode = "";

    switch (value) {
      case "Price: Low to High":
        sortByCode = "plb";
        break;
      case "Price: High to Low":
        sortByCode = "phl";
        break;
      case "Name: A to Z":
        sortByCode = "naz";
        break;
      case "Name: Z to A":
        sortByCode = "nza";
        break;
      case "Rating: Low to High":
        sortByCode = "rhr";
        break;
      case "Rating: High to Low":
        sortByCode = "rhl";
        break;
      default:
        sortByCode = "";
        break;
    }
    setFilters((prev) => ({ ...prev, sort_by: sortByCode, page: 1 }));
  };
};
