import React from "react";
import EmailFooter from "../Components/Navbar/EmailFooter";

function AboutUs() {
  // Example usage with some props
  const myFooterText = "We appreciate your trust in our services.";
  const myCompanyName = "Example Inc.";
  const myCompanyLogo = "https://via.placeholder.com/100x50?text=My+Brand"; // Replace with your actual logo URL
  const myCopyrightText = "© 2023 Example Inc. All rights reserved.";

  // You can also override the template configuration if needed
  const customTemplateConfig = {
    pages: ["privacy_policy", "contact_us"], // Only show Privacy Policy and Contact Us
    social_media: ["facebook", "instagram"], // Only show Facebook and Instagram
  };

  return (
    <div>
      {/* Your main application content */}
      <h1>My Email Content</h1>
      <p>This is the main body of the email.</p>

      <EmailFooter
        footerText={myFooterText}
        companyName={myCompanyName}
        companyLogo={myCompanyLogo}
        copyrightText={myCopyrightText}
        templateConfig={customTemplateConfig} // Pass custom configuration if desired
      />
    </div>
  );
}

export default AboutUs;

// import React from "react";

// const AboutUs = () => {
//   return (
//     <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
//       <h1>About Us</h1>
//       <p>Learn more about our company and values.</p>
//     </div>
//   );
// };

// export default AboutUs;
