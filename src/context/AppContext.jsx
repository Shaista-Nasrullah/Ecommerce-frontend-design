import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const IMAGE_BASE_URL = "https://tdsonlinepk.alitechnosolutions.com/";
  const HOME_API_URL = "/api/home/data"; // Direct API URL
  const CATEGORIES_API_ALL = "/api/categories/all"; // Dedicated categories API
  const BRANDS_API_ALL = "/api/brands/all"; // Dedicated brands API

  const [loading, setLoading] = useState(true); // General loading state for homepage initial fetch
  const [error, setError] = useState(null); // General error state for homepage initial fetch

  // State for different sections of the homepage data
  // These will be populated by fetchHomePageData AND can be updated by individual fetches
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [flushDeals, setFlushDeals] = useState([]);
  const [latests, setLatests] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [firstBanner, setFirstBanner] = useState([]);
  const [secondBanner, setSecondBanner] = useState([]);

  // --- Helper function to process image URLs ---
  const processItemsWithImage = (items) => {
    if (!Array.isArray(items)) return [];
    return items.map((item) => ({
      ...item,
      image: item.image ? `${IMAGE_BASE_URL}${item.image}` : null,
      feature_image: item.feature_image
        ? `${IMAGE_BASE_URL}${item.feature_image}`
        : null, // For products/banners
    }));
  };

  // --- 1. Homepage Data Fetch (Combines all data for initial load) ---
  const fetchHomePageData = async () => {
    setLoading(true);
    setError(null);
    console.log("Attempting to fetch all homepage data from:", HOME_API_URL);
    try {
      const response = await axios.get(HOME_API_URL);
      console.log("Homepage API Response Status:", response.status);
      console.log("Homepage API Response Data:", response.data);

      if (response.data) {
        const data = response.data;

        // Set state for all homepage sections
        setCategories(processItemsWithImage(data.categories));
        setBrands(processItemsWithImage(data.brands));
        setFlushDeals(processItemsWithImage(data.flushdeals));
        setLatests(processItemsWithImage(data.latests));
        setTopRated(processItemsWithImage(data.toprated));
        setFeatured(processItemsWithImage(data.featured));
        setFirstBanner(processItemsWithImage(data.first_banner));
        setSecondBanner(processItemsWithImage(data.second_banner));

        console.log("Homepage data fetched and processed successfully.");
      } else {
        const errorMessage =
          "API response for homepage data is empty or malformed.";
        console.error("Error:", errorMessage, "Received data:", response.data);
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error("Failed to fetch homepage data. Full error object:", err);
      // Detailed error handling...
      if (err.response) {
        console.error("Homepage Error Data:", err.response.data);
        setError(
          new Error(
            `Server Error: ${err.response.status} - ${
              err.response.data?.message || "Unknown"
            }`
          )
        );
        toast.error(
          `Server Error loading homepage data: ${err.response.status}`
        );
      } else if (err.request) {
        setError(new Error("Network Error: No response received from server."));
        toast.error(
          "Network Error: No response from server for homepage data."
        );
      } else {
        setError(new Error(`Request Error: ${err.message}`));
        toast.error(`Request Error loading homepage data: ${err.message}`);
      }
      toast.error("Failed to load homepage data.");
    } finally {
      setLoading(false);
      console.log("Finished fetching homepage data.");
    }
  };

  // --- 2. Individual Categories Fetch (for Categories Page) ---
  const fetchCategoriesData = async (
    setComponentLoading = () => {}, // Allows a component to manage its own loading state
    setComponentError = () => {} // Allows a component to manage its own error state
  ) => {
    setComponentLoading(true);
    setComponentError(null);
    console.log("Attempting to fetch ALL categories from:", CATEGORIES_API_ALL);
    try {
      const response = await axios.get(CATEGORIES_API_ALL);
      console.log("Categories Page API Response Status:", response.status);
      console.log("Categories Page API Response Data:", response.data);

      if (response.data && Array.isArray(response.data)) {
        setCategories(processItemsWithImage(response.data)); // Update global categories state
        console.log("ALL Categories fetched for Categories Page successfully.");
      } else {
        const errorMessage =
          "API response for ALL categories is not an array or is empty.";
        console.error("Error:", errorMessage, "Received data:", response.data);
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error("Failed to fetch ALL categories. Full error object:", err);
      if (err.response) {
        setComponentError(
          new Error(
            `Server Error: ${err.response.status} - ${
              err.response.data?.message || "Unknown"
            }`
          )
        );
        toast.error(
          `Server Error loading ALL categories: ${err.response.status}`
        );
      } else if (err.request) {
        setComponentError(
          new Error("Network Error: No response received from server.")
        );
        toast.error(
          "Network Error: No response from server for ALL categories."
        );
      } else {
        setComponentError(new Error(`Request Error: ${err.message}`));
        toast.error(`Request Error loading ALL categories: ${err.message}`);
      }
    } finally {
      setComponentLoading(false);
      console.log("Finished fetching ALL categories.");
    }
  };

  // --- 3. Individual Brands Fetch (for Brands Page) ---
  const fetchBrandsData = async (
    setComponentLoading = () => {}, // Allows a component to manage its own loading state
    setComponentError = () => {} // Allows a component to manage its own error state
  ) => {
    setComponentLoading(true);
    setComponentError(null);
    console.log("Attempting to fetch ALL brands from:", BRANDS_API_ALL);
    try {
      const response = await axios.get(BRANDS_API_ALL);
      console.log("Brands Page API Response Status:", response.status);
      console.log("Brands Page API Response Data:", response.data);

      if (response.data && Array.isArray(response.data)) {
        setBrands(processItemsWithImage(response.data)); // Update global brands state
        console.log("ALL Brands fetched for Brands Page successfully.");
      } else {
        const errorMessage =
          "API response for ALL brands is not an array or is empty.";
        console.error("Error:", errorMessage, "Received data:", response.data);
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error("Failed to fetch ALL brands. Full error object:", err);
      if (err.response) {
        setComponentError(
          new Error(
            `Server Error: ${err.response.status} - ${
              err.response.data?.message || "Unknown"
            }`
          )
        );
        toast.error(`Server Error loading ALL brands: ${err.response.status}`);
      } else if (err.request) {
        setComponentError(
          new Error("Network Error: No response received from server.")
        );
        toast.error("Network Error: No response from server for ALL brands.");
      } else {
        setComponentError(new Error(`Request Error: ${err.message}`));
        toast.error(`Request Error loading ALL brands: ${err.message}`);
      }
    } finally {
      setComponentLoading(false);
      console.log("Finished fetching ALL brands.");
    }
  };

  useEffect(() => {
    console.log(
      "AppContextProvider mounted. Initiating homepage data fetch..."
    );
    fetchHomePageData(); // Only fetch homepage data on initial mount
  }, []);

  const value = {
    loading, // For initial homepage load status
    error, // For initial homepage load error

    IMAGE_BASE_URL,

    // All specific data sections (populated by homepage fetch or individual fetches)
    categories,
    brands,
    flushDeals,
    latests,
    topRated,
    featured,
    firstBanner,
    secondBanner,

    // Expose individual fetch functions for specific pages
    fetchCategoriesData,
    fetchBrandsData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;

// import { createContext, useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// export const AppContext = createContext();

// const AppContextProvider = (props) => {
//   const IMAGE_BASE_URL = "https://tdsonlinepk.alitechnosolutions.com/";

//   const [categories, setCategories] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // --- Fetching Functions ---

//   const fetchCategories = async () => {
//     setLoading(true);
//     setError(null);
//     const apiUrl = `/api/categories/all`;
//     console.log("Attempting to fetch categories from:", apiUrl); // Log the API URL
//     try {
//       const response = await axios.get(apiUrl);
//       console.log("Categories API Response Status:", response.status); // Log status
//       console.log("Categories API Response Data:", response.data); // Log full data

//       if (response.data && Array.isArray(response.data)) {
//         const categoriesWithFullImageUrls = response.data.map((category) => ({
//           ...category,
//           image: category.image ? `${IMAGE_BASE_URL}${category.image}` : null,
//         }));
//         setCategories(categoriesWithFullImageUrls);
//         console.log("Categories fetched and processed successfully.");
//       } else {
//         const errorMessage =
//           "API response for categories is not an array or is empty.";
//         console.error("Error:", errorMessage, "Received data:", response.data);
//         throw new Error(errorMessage);
//       }
//     } catch (err) {
//       console.error("Failed to fetch categories. Full error object:", err);
//       if (err.response) {
//         // The request was made and the server responded with a status code
//         // that falls out of the range of 2xx
//         console.error("Categories Error Data:", err.response.data);
//         console.error("Categories Error Status:", err.response.status);
//         console.error("Categories Error Headers:", err.response.headers);
//         setError(
//           new Error(
//             `Server Error: ${err.response.status} - ${
//               err.response.data?.message || "Unknown"
//             }`
//           )
//         );
//         toast.error(`Server Error loading categories: ${err.response.status}`);
//       } else if (err.request) {
//         // The request was made but no response was received
//         // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
//         // http.ClientRequest in node.js
//         console.error("Categories No Response Error:", err.request);
//         setError(new Error("Network Error: No response received from server."));
//         toast.error("Network Error: No response from server for categories.");
//       } else {
//         // Something else happened in setting up the request that triggered an Error
//         console.error("Categories Request Setup Error:", err.message);
//         setError(new Error(`Request Error: ${err.message}`));
//         toast.error(`Request Error loading categories: ${err.message}`);
//       }
//       toast.error("Failed to load categories."); // General fallback toast
//     } finally {
//       setLoading(false);
//       console.log("Finished fetching categories.");
//     }
//   };

//   const fetchBrands = async () => {
//     setLoading(true);
//     setError(null);
//     const apiUrl = `/api/brands/all`;
//     console.log(
//       "SSSSSSSSSSSSSSSSSSSSSS Attempting to fetch brands from:",
//       apiUrl
//     ); // Log the API URL
//     try {
//       const response = await axios.get(apiUrl);
//       console.log(
//         "SSSSSSSSSSSSSSSSSSSSSS Brands API Response Status:",
//         response.status
//       ); // Log status
//       console.log(
//         "SSSSSSSSSSSSSSSSSSSS Brands API Response Data:",
//         response.data
//       ); // Log full data

//       if (response.data && Array.isArray(response.data)) {
//         const brandsWithFullImageUrls = response.data.map((brand) => ({
//           ...brand,
//           image: brand.image ? `${IMAGE_BASE_URL}${brand.image}` : null,
//         }));
//         setBrands(brandsWithFullImageUrls);
//         console.log(
//           "SSSSSSSSSSSSSSSSSSSS Brands fetched and processed successfully."
//         );
//       } else {
//         const errorMessage =
//           "API response for brands is not an array or is empty.";
//         console.error("Error:", errorMessage, "Received data:", response.data);
//         throw new Error(errorMessage);
//       }
//     } catch (err) {
//       console.error("Failed to fetch brands. Full error object:", err);
//       if (err.response) {
//         console.error("SSSSSSSSSSSSSS Brands Error Data:", err.response.data);
//         console.error(
//           "SSSSSSSSSSSSSSSSS Brands Error Status:",
//           err.response.status
//         );
//         console.error(
//           "SSSSSSSSSSSSSSS Brands Error Headers:",
//           err.response.headers
//         );
//         setError(
//           new Error(
//             `Server Error: ${err.response.status} - ${
//               err.response.data?.message || "Unknown"
//             }`
//           )
//         );
//         toast.error(`Server Error loading brands: ${err.response.status}`);
//       } else if (err.request) {
//         console.error("SSSSSSSSSSSS Brands No Response Error:", err.request);
//         setError(new Error("Network Error: No response received from server."));
//         toast.error("Network Error: No response from server for brands.");
//       } else {
//         console.error("SSSSSSSSSSSS Brands Request Setup Error:", err.message);
//         setError(new Error(`Request Error: ${err.message}`));
//         toast.error(`Request Error loading brands: ${err.message}`);
//       }
//       toast.error("Failed to load brands."); // General fallback toast
//     } finally {
//       setLoading(false);
//       console.log("SSSSSSSSSSSSSSSSSSS Finished fetching brands.");
//     }
//   };

//   useEffect(() => {
//     console.log("AppContextProvider mounted. Initiating data fetches...");
//     fetchCategories();
//     fetchBrands();
//   }, []);

//   const value = {
//     categories,
//     brands,
//     loading,
//     error,
//     fetchCategories,
//     fetchBrands,
//     IMAGE_BASE_URL,
//   };

//   return (
//     <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
//   );
// };

// export default AppContextProvider;
