// import React from "react";

// const CancellationPolicy = () => {
//   return <div>CancellationPolicy</div>;
// };

// export default CancellationPolicy;

import React, { useState, useEffect } from "react";
import "./Pages.css";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CancellationPolicy = () => {
  const [policyData, setPolicyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/pages/cancellation-policy`
        );

        // Check if the response is successful, otherwise throw an error
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPolicyData(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicyData();
  }, []); // The empty dependency array ensures this effect runs only once on component mount

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error}</div>;
  }

  // Set the background image for the banner dynamically
  const bannerStyle = {
    backgroundImage: `url(${policyData?.image})`,
  };

  return (
    <div className="page-container">
      {policyData ? (
        <>
          <header className="banner" style={bannerStyle}>
            <h1 className="banner-title">{policyData.title}</h1>
          </header>

          <main className="content-container">
            <div
              className="content-html"
              dangerouslySetInnerHTML={{ __html: policyData.content }}
            />
          </main>
        </>
      ) : (
        <div>No policy data found.</div>
      )}
    </div>
  );
};

export default CancellationPolicy;
