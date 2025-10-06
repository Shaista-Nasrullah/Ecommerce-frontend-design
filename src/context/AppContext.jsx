import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const IMAGE_BASE_URL = "https://tdsonlinepk.alitechnosolutions.com/";

  const HOME_API_URL = "/api/home/data";
  const CATEGORIES_API_ALL = "/api/categories/all";
  const BRANDS_API_ALL = "/api/brands/all";
  const SUBCATEGORIES_API_BASE = "/api/categories/sub"; // Base URL for subcategories

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
    fetchAllCategoriesData,
    fetchBrandsData,
    fetchSubCategoriesData, // Provide the new subcategories fetch function
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
