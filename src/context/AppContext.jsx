import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const IMAGE_BASE_URL = "https://tdsonlinepk.alitechnosolutions.com";

  const HOME_API_URL = "/api/home/data";
  const CATEGORIES_API_ALL = "/api/categories/all";
  const BRANDS_API_ALL = "/api/brands/all";
  const SUBCATEGORIES_API_BASE = "/api/categories/sub";
  const SINGLE_PRODUCT_API_BASE = "/api/products";
  const ALL_PRODUCTS_API = "/api/products/all";

  const [loading, setLoading] = useState(true); // General loading for initial homepage data
  const [error, setError] = useState(null); // General error for initial homepage data

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

  // New state for all products and their pagination info
  const [allProducts, setAllProducts] = useState([]);
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

  // --- 1. Homepage Data Fetch ---
  const fetchHomePageData = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log("Attempting to fetch all homepage data from:", HOME_API_URL);
    try {
      const response = await axios.get(HOME_API_URL);
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
  }, [
    HOME_API_URL,
    processItemsWithImage,
    setHomePageCategories,
    setHomePageBrands,
    setFlushDeals,
    setLatests,
    setTopRated,
    setFeatured,
    setFirstBanner,
    setSecondBanner,
  ]);

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
        const response = await axios.get(CATEGORIES_API_ALL);
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
        const response = await axios.get(BRANDS_API_ALL);
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
  // This function will be called by the SubCategories component
  const fetchSubCategoriesData = useCallback(
    async (categoryId, setComponentLoading, setComponentError) => {
      setComponentLoading(true);
      setComponentError(null);
      console.log(
        `Attempting to fetch subcategories for category ID: ${categoryId}`
      );
      try {
        const response = await axios.get(
          `${SUBCATEGORIES_API_BASE}/${categoryId}`
        );
        console.log("Subcategories API Response Status:", response.status);
        console.log("Subcategories API Response Data:", response.data);

        // Your Postman response shows an array directly, so we'll handle that first.
        // If your API wraps it in a 'data' property for subcategories too, adjust here.
        if (response.data && Array.isArray(response.data)) {
          const subCategoriesWithFullImageUrls = processItemsWithImage(
            response.data
          );
          // Instead of setting state here, we'll return the data
          // The component calling this function will manage its own state.
          console.log(
            "Subcategories fetched successfully (from top-level array)."
          );
          return subCategoriesWithFullImageUrls;
        } else if (response.data && Array.isArray(response.data.data)) {
          // Fallback if API returns {data: [...]}
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

  // --- 5. Fetch Single Product by ID ---
  const fetchProductById = useCallback(
    async (productId, setComponentLoading, setComponentError) => {
      setComponentLoading(true);
      setComponentError(null);
      console.log(`Attempting to fetch product with ID: ${productId}`);
      try {
        const response = await axios.get(
          `${SINGLE_PRODUCT_API_BASE}/${productId}`
        );
        console.log("Single Product API Response Status:", response.status);
        console.log("Single Product API Response Data:", response.data);

        if (response.data) {
          const productWithFullImageUrls = processProductImage(response.data);
          console.log("Product fetched successfully.");
          return productWithFullImageUrls;
        } else {
          throw new Error("API response for single product is empty.");
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
        return null; // Return null on error
      } finally {
        setComponentLoading(false);
        console.log(`Finished fetching product with ID: ${productId}.`);
      }
    },
    [SINGLE_PRODUCT_API_BASE, processProductImage]
  );

  // --- 6. Fetch ALL Products with Pagination ---
  const fetchAllProductsData = useCallback(
    async (
      setComponentLoading,
      setComponentError,
      page = 1,
      limit = 25,
      filters = {} // Add filters object for search, category, brand, sort, etc.
    ) => {
      setComponentLoading(true);
      setComponentError(null);
      console.log(`Attempting to fetch all products from: ${ALL_PRODUCTS_API}`);

      // Build query parameters based on filters
      const queryParams = new URLSearchParams();
      queryParams.append("page", page);
      queryParams.append("per_page", limit); // Use 'per_page' if that's what your API expects for limit

      if (filters.search) {
        queryParams.append("search", filters.search);
      }
      if (filters.min_price) {
        queryParams.append("min_price", filters.min_price);
      }
      if (filters.max_price) {
        queryParams.append("max_price", filters.max_price);
      }
      if (filters.category_ids && filters.category_ids.length > 0) {
        filters.category_ids.forEach((id) =>
          queryParams.append("category_id[]", id)
        );
      }
      if (filters.brand_ids && filters.brand_ids.length > 0) {
        filters.brand_ids.forEach((id) => queryParams.append("brand_id[]", id));
      }
      if (filters.sort_by && filters.sort_by !== "Default") {
        queryParams.append("sort_by", filters.sort_by);
        queryParams.append("sort_order", filters.sort_order);
      }
      if (filters.filter_by && filters.filter_by !== "Default") {
        queryParams.append("filter_by", filters.filter_by); // Assuming your API supports this filter
      }
      // Add more filters as needed, e.g., for 'best-selling', 'top-rated' if your API handles them as query params

      const requestUrl = `${ALL_PRODUCTS_API}?${queryParams.toString()}`;
      console.log("Fetching products with URL:", requestUrl);

      try {
        const response = await axios.get(requestUrl);
        console.log("All Products API Response Status:", response.status);
        console.log("All Products API Response Data:", response.data);

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
              // Add a mock rating for sorting if the API doesn't provide it
              rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
            })
          );
          setAllProducts(productsWithFullImageUrls);
          setAllProductsPagination({
            total: response.data.total,
            currentPage: response.data.current_page,
            lastPage: response.data.last_page,
            perPage: response.data.per_page,
          });
          console.log("All products fetched and processed successfully.");
        } else {
          throw new Error(
            "API response for all products is empty or malformed."
          );
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

  useEffect(() => {
    console.log(
      "AppContextProvider mounted. Initiating homepage data fetch..."
    );
    fetchHomePageData();
  }, [fetchHomePageData]);

  const value = {
    loading, // Global loading for initial app load (homepage)
    error, // Global error for initial app load (homepage)
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
    allProducts, // New: all products data
    allProductsPagination, // New: pagination info for all products
    fetchAllCategoriesData,
    fetchBrandsData,
    fetchSubCategoriesData,
    fetchProductById,
    fetchAllProductsData, // New: function to fetch all products
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
