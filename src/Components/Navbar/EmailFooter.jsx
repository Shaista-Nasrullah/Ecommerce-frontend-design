import React from "react";
import "./EmailFooter.css"; // Import the CSS file

const EmailFooter = ({
  footerText,
  companyName,
  companyLogo,
  templateConfig,
  copyrightText,
}) => {
  // Static data for demonstration
  const staticTemplateConfig = templateConfig || {
    pages: [
      "privacy_policy",
      "refund_policy",
      "cancellation_policy",
      "contact_us",
    ],
    social_media: ["facebook", "twitter", "linkedin", "instagram"],
  };

  const staticSocialMedia = [
    {
      name: "facebook",
      link: "https://www.facebook.com",
      icon: "https://via.placeholder.com/16/3b5998/ffffff?text=f",
    },
    {
      name: "twitter",
      link: "https://www.twitter.com",
      icon: "https://via.placeholder.com/16/1da1f2/ffffff?text=t",
    },
    {
      name: "linkedin",
      link: "https://www.linkedin.com",
      icon: "https://via.placeholder.com/16/0077b5/ffffff?text=l",
    },
    {
      name: "instagram",
      link: "https://www.instagram.com",
      icon: "https://via.placeholder.com/16/e1306c/ffffff?text=i",
    },
  ];

  const getPolicyLink = (policy) => {
    // In a real app, you'd have dynamic routes here
    switch (policy) {
      case "privacy_policy":
        return "/privacy-policy";
      case "refund_policy":
        return "/refund-policy";
      case "cancellation_policy":
        return "/cancellation-policy";
      case "contact_us":
        return "/contact-us";
      default:
        return "#";
    }
  };

  const companyLogoUrl =
    companyLogo || "https://via.placeholder.com/76x76?text=Company+Logo"; // Static placeholder for logo

  return (
    <div>
      <p className="view-footer-text">
        {footerText || "Thank you for your business!"}
      </p>
      <p className="thanks-regards">
        Thanks & Regards, <br /> {companyName || "Your Company Name"}
      </p>
      <div className="d-flex justify-content-center mb-3">
        <img
          width="76"
          className="mx-auto view-mail-logo"
          src={companyLogoUrl}
          alt="Company Logo"
        />
      </div>
      <div className="d-flex justify-content-center gap-2">
        <ul className="email-list-inline gap-3 mx-auto" id="selected-pages">
          {(staticTemplateConfig.pages || []).map((page, index) => (
            <li key={index} className={page.replace("_", "-")}>
              <a href={getPolicyLink(page)} className="text-dark">
                {page
                  .replace("_", " ")
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </a>
            </li>
          ))}
          {/* Fallback for empty template pages, mimicking original logic */}
          {(!staticTemplateConfig.pages ||
            staticTemplateConfig.pages.length === 0) && (
            <>
              <li className="privacy-policy">
                <a href="/privacy-policy" className="text-dark">
                  Privacy Policy
                </a>
              </li>
              <li className="refund-policy">
                <a href="/refund-policy" className="text-dark">
                  Refund Policy
                </a>
              </li>
              <li className="cancellation-policy">
                <a href="/cancellation-policy" className="text-dark">
                  Cancellation Policy
                </a>
              </li>
              <li className="contact-us">
                <a href="/contact-us" className="text-dark">
                  Contact Us
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
      <div
        className="d-flex gap-4 justify-content-center align-items-center mb-3 fz-16 social-media-icon"
        id="selected-social-media"
      >
        <div className="mx-auto">
          {staticSocialMedia.map((media, index) => (
            <React.Fragment key={index}>
              {staticTemplateConfig.social_media &&
              staticTemplateConfig.social_media.includes(media.name) ? (
                <a
                  className={media.name}
                  href={media.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={media.icon} width="16" alt={media.name} />
                </a>
              ) : null}
              {(!staticTemplateConfig.social_media ||
                staticTemplateConfig.social_media.length === 0) && (
                <a
                  className={media.name}
                  href={media.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={media.icon} width="16" alt={media.name} />
                </a>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <p className="text-center view-copyright-text">
        {copyrightText ||
          `© ${new Date().getFullYear()} Your Company. All rights reserved.`}
      </p>
    </div>
  );
};

export default EmailFooter;
