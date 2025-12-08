// AppContext.js - MODIFIED

import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const IMAGE_BASE_URL = "https://tdsonlinepk.alitechnosolutions.com";

  const HOME_API_URL = "/api/home/data";
  const CATEGORIES_API_ALL = "/api/categories/all";
  const BRANDS_API_ALL = "/api/brands/all";
  const SUBCATEGORIES_API_BASE = "/api/categories/sub";
  const SINGLE_PRODUCT_API_BASE = "/api/products";
  const ALL_PRODUCTS_API = "/api/products/all";
  const WISHLIST_API_URL = "/api/user/wishlist";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [homePageCategories, setHomePageCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [homePageBrands, setHomePageBrands] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [flushDeals, setFlushDeals] = useState([]);
  const [latests, setLatests] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [firstBanner, setFirstBanner] = useState([]);
  const [secondBanner, setSecondBanner] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [allProducts, setAllProducts] = useState([]);
  const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(false);
  const [allProductsPagination, setAllProductsPagination] = useState({
    total: 0,
    currentPage: 1,
    lastPage: 1,
    perPage: 25,
  });

  // --- Helper function to process image URLs ---
  const processItemsWithImage = useCallback(
    (items) => {
      if (!Array.isArray(items)) return [];
      return items.map((item) => ({
        ...item,
        image: item.image ? `${IMAGE_BASE_URL}${item.image}` : null,
        feature_image: item.feature_image
          ? `${IMAGE_BASE_URL}${item.feature_image}`
          : null,
      }));
    },
    [IMAGE_BASE_URL]
  );

  // Helper function for single product image processing
  // This now expects a product object (like response.data.product)
  const processProductImage = useCallback(
    (product) => {
      if (!product) return null;
      return {
        ...product,
        feature_image: product.feature_image
          ? `${IMAGE_BASE_URL}${product.feature_image}`
          : null,
        // If there's an 'images' array for multiple product images, process them too
        images: product.images
          ? product.images.map((img) => `${IMAGE_BASE_URL}${img}`)
          : [],
      };
    },
    [IMAGE_BASE_URL]
  );

  const toggleCategorySidebar = () => {
    setIsCategorySidebarOpen((prev) => !prev);
  };

  // --- 1. Homepage Data Fetch ---
  const fetchHomePageData = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log("Attempting to fetch all homepage data from:", HOME_API_URL);
    try {
      const response = await axios.get(API_BASE_URL + HOME_API_URL);
      console.log("Homepage API Response Status:", response.status);
      console.log("Homepage API Response Data:", response.data);

      if (response.data) {
        const data = response.data;
        setHomePageCategories(processItemsWithImage(data.categories));
        setHomePageBrands(processItemsWithImage(data.brands));
        setFlushDeals(processItemsWithImage(data.flushdeals));
        setLatests(processItemsWithImage(data.latests));
        setTopRated(processItemsWithImage(data.toprated));
        setFeatured(processItemsWithImage(data.featured));
        setFirstBanner(processItemsWithImage(data.first_banner));
        setSecondBanner(processItemsWithImage(data.second_banner));
        console.log("Homepage data fetched and processed successfully.");
      } else {
        throw new Error(
          "API response for homepage data is empty or malformed."
        );
      }
    } catch (err) {
      console.error("Failed to fetch homepage data. Full error object:", err);
      setError(new Error(`Failed to load homepage data: ${err.message}`));
      toast.error("Failed to load homepage data.");
    } finally {
      setLoading(false);
      console.log("Finished fetching homepage data.");
    }
  }, [HOME_API_URL, processItemsWithImage]);

  // --- 2. Individual Categories Fetch (for Categories Page) ---
  const fetchAllCategoriesData = useCallback(
    async (setComponentLoading, setComponentError) => {
      setComponentLoading(true);
      setComponentError(null);
      console.log(
        "Attempting to fetch ALL categories from:",
        CATEGORIES_API_ALL
      );
      try {
        const response = await axios.get(API_BASE_URL + CATEGORIES_API_ALL);
        if (response.data && Array.isArray(response.data)) {
          setAllCategories(processItemsWithImage(response.data));
          console.log(
            "ALL Categories fetched for Categories Page successfully.",
            response.data
          );
        } else {
          throw new Error(
            "API response for ALL categories is not an array or is empty."
          );
        }
      } catch (err) {
        console.error(
          "Failed to fetch ALL categories. Full error object:",
          err
        );
        setComponentError(
          new Error(`Failed to load ALL categories: ${err.message}`)
        );
        toast.error(`Failed to load ALL categories: ${err.message}`);
      } finally {
        setComponentLoading(false);
        console.log("Finished fetching ALL categories.");
      }
    },
    [CATEGORIES_API_ALL, processItemsWithImage, setAllCategories]
  );

  // --- 3. Individual Brands Fetch (for Brands Page) ---
  const fetchBrandsData = useCallback(
    async (setComponentLoading, setComponentError) => {
      setComponentLoading(true);
      setComponentError(null);
      console.log("Attempting to fetch ALL brands from:", BRANDS_API_ALL);
      try {
        const response = await axios.get(API_BASE_URL + BRANDS_API_ALL);
        if (response.data && Array.isArray(response.data)) {
          setAllBrands(processItemsWithImage(response.data));
          console.log("ALL Brands fetched for Brands Page successfully.");
        } else {
          throw new Error(
            "API response for ALL brands is not an array or is empty."
          );
        }
      } catch (err) {
        console.error("Failed to fetch ALL brands. Full error object:", err);
        setComponentError(
          new Error(`Failed to load ALL brands: ${err.message}`)
        );
        toast.error(`Failed to load ALL brands: ${err.message}`);
      } finally {
        setComponentLoading(false);
        console.log("Finished fetching ALL brands.");
      }
    },
    [BRANDS_API_ALL, processItemsWithImage, setAllBrands]
  );

  // --- 4. Fetch Subcategories for a given Category ID ---
  const fetchSubCategoriesData = useCallback(
    async (categoryId, setComponentLoading, setComponentError) => {
      setComponentLoading(true);
      setComponentError(null);
      console.log(
        `Attempting to fetch subcategories for category ID: ${categoryId}`
      );
      try {
        const response = await axios.get(
          `${API_BASE_URL}${SUBCATEGORIES_API_BASE}/${categoryId}`
        );
        console.log("Subcategories API Response Status:", response.status);
        console.log("Subcategories API Response Data:", response.data);

        if (response.data && Array.isArray(response.data)) {
          const subCategoriesWithFullImageUrls = processItemsWithImage(
            response.data
          );
          console.log(
            "Subcategories fetched successfully (from top-level array)."
          );
          return subCategoriesWithFullImageUrls;
        } else if (response.data && Array.isArray(response.data.data)) {
          const subCategoriesWithFullImageUrls = processItemsWithImage(
            response.data.data
          );
          console.log(
            "Subcategories fetched successfully (from data.data property)."
          );
          return subCategoriesWithFullImageUrls;
        } else {
          throw new Error(
            "API response for subcategories is not an array, and no 'data' array found."
          );
        }
      } catch (err) {
        console.error(
          `Failed to fetch subcategories for ID ${categoryId}. Full error object:`,
          err
        );
        setComponentError(
          new Error(
            `Failed to load subcategories for category ID ${categoryId}: ${err.message}`
          )
        );
        toast.error(
          `Failed to load subcategories for category ID ${categoryId}.`
        );
        return []; // Return an empty array on error
      } finally {
        setComponentLoading(false);
        console.log(
          `Finished fetching subcategories for category ID: ${categoryId}.`
        );
      }
    },
    [SUBCATEGORIES_API_BASE, processItemsWithImage]
  );

  // --- 5. Fetch Single Product by ID (MODIFIED) ---
  const fetchProductById = useCallback(
    async (productId, setComponentLoading, setComponentError) => {
      setComponentLoading(true);
      setComponentError(null);
      console.log(`Attempting to fetch product with ID: ${productId}`);
      try {
        const response = await axios.get(
          `${API_BASE_URL}${SINGLE_PRODUCT_API_BASE}/${productId}`
        );
        console.log("Single Product API Response Status:", response.status);
        console.log("Single Product API Response Data:", response.data);

        if (response.data && response.data.product) {
          const mainProduct = processProductImage(response.data.product);
          const similarProducts = processItemsWithImage(
            response.data.similiar_products || []
          ); // Ensure it's an array

          console.log(
            "Main product and similar products fetched successfully."
          );
          return { mainProduct, similarProducts }; // Return an object with both
        } else {
          throw new Error(
            "API response for single product is empty or missing 'product' key."
          );
        }
      } catch (err) {
        console.error(
          `Failed to fetch product with ID ${productId}. Full error object:`,
          err
        );
        setComponentError(
          new Error(
            `Failed to load product with ID ${productId}: ${err.message}`
          )
        );
        toast.error(`Failed to load product with ID ${productId}.`);
        return { mainProduct: null, similarProducts: [] }; // Return null for product and empty array for similar on error
      } finally {
        setComponentLoading(false);
        console.log(`Finished fetching product with ID: ${productId}.`);
      }
    },
    [SINGLE_PRODUCT_API_BASE, processProductImage, processItemsWithImage]
  );

  // --- 6. Fetch ALL Products with Pagination and Filters ---
  const fetchAllProductsData = useCallback(
    async (
      setComponentLoading,
      setComponentError,
      page = 1,
      limit = 25,
      filters = {}
    ) => {
      setComponentLoading(true);
      setComponentError(null);
      console.log(`fetchAllProductsData called with:`, {
        page,
        limit,
        filters,
      });

      // Build query parameters based on filters
      const queryParams = new URLSearchParams();
      queryParams.append("page", page);
      queryParams.append("per_page", limit);

      if (filters.search) {
        queryParams.append("term", filters.search);
      }
      if (filters.min_price) {
        queryParams.append("min_price", filters.min_price);
      }
      if (filters.max_price) {
        queryParams.append("max_price", filters.max_price);
      }

      // --- Category and Brand IDs (Single Selection based on API Docs) ---
      if (filters.category_ids && filters.category_ids.length > 0) {
        queryParams.append("category_id", filters.category_ids[0]);
      }

      // --- NEW CODE: Handle Sub Category ID ---
      if (filters.sub_category_id) {
        queryParams.append("sub_category_id", filters.sub_category_id);
      }

      if (filters.brand_ids && filters.brand_ids.length > 0) {
        queryParams.append("brand_id", filters.brand_ids[0]);
      }

      // --- Sort By (API-specific codes) ---
      if (filters.sort_by && filters.sort_by !== "") {
        // "" means 'Default' or no sort
        queryParams.append("sort_by", filters.sort_by);
      }
      // Removed: sort_order, as API docs imply order is within sort_by code.

      // --- Special Filters (Boolean flags) ---
      if (filters.isFlushDeal) {
        queryParams.append("flushdeal", "true");
      }
      if (filters.isFeatured) {
        queryParams.append("featured", "true");
      }
      if (filters.isTopRated) {
        queryParams.append("toprated", "true");
      }
      if (filters.isBestSelling) {
        queryParams.append("bestselling", "true");
      }
      if (filters.isLatest) {
        // Added 'latest' based on API docs
        queryParams.append("latest", "true");
      }

      const requestUrl = `${ALL_PRODUCTS_API}?${queryParams.toString()}`;
      console.log("Fetching products with URL:", requestUrl); // CRITICAL: Check this URL in network tab

      try {
        const response = await axios.get(API_BASE_URL + requestUrl);
        console.log("All Products API Response Status:", response.status);
        console.log("Raw All Products API Response Data:", response.data);

        if (response.data && Array.isArray(response.data.data)) {
          const productsWithFullImageUrls = response.data.data.map(
            (product) => ({
              ...product,
              feature_image: product.feature_image
                ? `${IMAGE_BASE_URL}${product.feature_image}`
                : null,
              // Assuming variations contains the default_sell_price
              unit_price:
                product.variations && product.variations.length > 0
                  ? parseFloat(product.variations[0].default_sell_price)
                  : 0, // Default to 0 if no price found
              // You might want to calculate a discount price if there's a specific field for it in the API
              discount_price: product.discount_price
                ? parseFloat(product.discount_price)
                : null,
              // Add a mock rating if API doesn't provide.
              // If API has a 'rating' field, use product.rating directly.
              rating: product.rating || Math.floor(Math.random() * 5) + 1,
            })
          );
          setAllProducts(productsWithFullImageUrls);
          setAllProductsPagination({
            total: response.data.total,
            currentPage: response.data.current_page,
            lastPage: response.data.last_page,
            perPage: response.data.per_page,
          });
          console.log(
            "All products fetched and processed successfully. Displaying:",
            productsWithFullImageUrls.length,
            "products."
          );
        } else {
          // If data.data is not an array, log the issue and clear products
          console.warn(
            "API response for all products 'data' property is not an array or is missing. Response:",
            response.data
          );
          setAllProducts([]);
          setAllProductsPagination({
            total: 0,
            currentPage: 1,
            lastPage: 1,
            perPage: limit,
          });
          // Not throwing error, just logging, as empty results are valid for filters
        }
      } catch (err) {
        console.error("Failed to fetch all products. Full error object:", err);
        setComponentError(
          new Error(`Failed to load all products: ${err.message}`)
        );
        toast.error(`Failed to load all products: ${err.message}`);
        setAllProducts([]); // Clear products on error
        setAllProductsPagination({
          total: 0,
          currentPage: 1,
          lastPage: 1,
          perPage: limit,
        });
      } finally {
        setComponentLoading(false);
        console.log("Finished fetching all products.");
      }
    },
    [ALL_PRODUCTS_API, IMAGE_BASE_URL]
  );

  // --- MODIFIED fetchWishlist FUNCTION ---
  const fetchWishlist = useCallback(
    async (token) => {
      if (!token) {
        setWishlist([]);
        setWishlistCount(0);
        return;
      }

      try {
        // Add cache buster to prevent caching issues
        const cacheBuster = `_=${new Date().getTime()}`;
        const urlWithCacheBuster = `${WISHLIST_API_URL}?${cacheBuster}`;

        const response = await axios.get(API_BASE_URL + urlWithCacheBuster, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        });

        // Get the raw items array
        const items = response.data.data || [];

        if (Array.isArray(items)) {
          // --- FIX: Map specifically for the nested structure ---
          const processedItems = items.map((item) => {
            // We create a copy of the item
            const updatedItem = { ...item };

            // Check if the 'product' object exists inside the item
            if (updatedItem.product) {
              updatedItem.product = {
                ...updatedItem.product,
                // Prepend the base URL to the feature_image inside the product object
                feature_image: updatedItem.product.feature_image
                  ? `${IMAGE_BASE_URL}${updatedItem.product.feature_image}`
                  : null,
              };
            }
            return updatedItem;
          });
          // -----------------------------------------------------

          setWishlist(processedItems);
          setWishlistCount(items.length);
        } else {
          setWishlist([]);
          setWishlistCount(0);
        }
      } catch (err) {
        console.error("Failed to fetch wishlist in context:", err);
      }
    },
    [IMAGE_BASE_URL]
  );

  // Function to ADD an item
  const addToWishlist = async (token, product_id, variation_id) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/user/wishlist`,
        { product_id, variation_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchWishlist(token);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      toast.error(err.message || "Failed to add to wishlist.");
      console.error("Add to wishlist error:", err);
    }
  };

  // Function to REMOVE an item - CORRECTED
  const removeFromWishlist = async (token, wishlistItemId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}${WISHLIST_API_URL}/${wishlistItemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchWishlist(token);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      toast.error(err.message || "Failed to remove from wishlist.");
      console.error("Remove from wishlist error:", err);
    }
  };

  const clearWishlist = async (token) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/user/wishlist/clear`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWishlist([]);
      setWishlistCount(0);
      toast.success("Wishlist cleared successfully!");
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      toast.error("Failed to clear wishlist.");
    }
  };

  useEffect(() => {
    console.log(
      "AppContextProvider mounted. Initiating homepage data fetch..."
    );
    fetchHomePageData();
  }, [fetchHomePageData]);

  const value = {
    loading,
    error,
    IMAGE_BASE_URL,
    homePageCategories,
    allCategories,
    homePageBrands,
    allBrands,
    flushDeals,
    latests,
    topRated,
    featured,
    firstBanner,
    secondBanner,
    allProducts,
    allProductsPagination,
    fetchAllCategoriesData,
    fetchBrandsData,
    fetchSubCategoriesData,
    fetchProductById,
    fetchAllProductsData,
    wishlist,
    wishlistCount,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isCategorySidebarOpen,
    toggleCategorySidebar,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
