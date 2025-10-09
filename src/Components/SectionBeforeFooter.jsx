import React from "react";
import "./SectionBeforeFooter.css";
import authentic_product from "../Components/Assets/authentic_product.png";
import delivery_info from "../Components/Assets/delivery_info.png";
import return_policy from "../Components/Assets/return_policy.png";
import safe_payment from "../Components/Assets/safe_payment.png";

const SectionBeforeFooter = () => {
  return (
    <div className="scrollable-wrapper">
      {" "}
      {/* Add a wrapper div for scrolling */}
      <div className="section-before-footer-container">
        <div className="each-box">
          <img src={delivery_info} alt="Delivery Info" />{" "}
          {/* Changed alt text for clarity */}
          <p>Fast Delivery all across the country</p>
        </div>
        <div className="each-box">
          <img src={safe_payment} alt="Safe Payment" />{" "}
          {/* Changed alt text for clarity */}
          <p>Safe Payment</p>
        </div>
        <div className="each-box">
          <img src={return_policy} alt="Return Policy" />{" "}
          {/* Changed alt text for clarity */}
          <p>7 Days Return Policy</p>
        </div>
        <div className="each-box">
          <img src={authentic_product} alt="100% Authentic Products" />{" "}
          {/* Changed alt text for clarity */}
          <p>100% Authentic Products</p>
        </div>
      </div>
    </div>
  );
};

export default SectionBeforeFooter;

// import React from "react";
// import "./SectionBeforeFooter.css";
// import authentic_product from "../Components/Assets/authentic_product.png";
// import delivery_info from "../Components/Assets/delivery_info.png";
// import return_policy from "../Components/Assets/return_policy.png";
// import safe_payment from "../Components/Assets/safe_payment.png";

// const SectionBeforeFooter = () => {
//   return (
//     <div className="section-before-footer-container">
//       <div className="each-box">
//         <img src={delivery_info} alt="Authentic product" />
//         <p>Fast Delivery all across the country</p>
//       </div>
//       <div className="each-box">
//         <img src={safe_payment} alt="Authentic product" />
//         <p>Safe Payment</p>
//       </div>
//       <div className="each-box">
//         <img src={return_policy} alt="Authentic product" />
//         <p>7 Days Return Policy</p>
//       </div>
//       <div className="each-box">
//         <img src={authentic_product} alt="Authentic product" />
//         <p>100% Authentic Products</p>
//       </div>
//     </div>
//   );
// };

// export default SectionBeforeFooter;
