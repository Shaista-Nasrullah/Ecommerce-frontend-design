import React from "react";
import HeroSection2 from "../Components/HeroSection2";
import NewComponent from "../Components/NewComponent";
import CategoriesSection from "../Components/Categories";
import FeaturedDeal from "../Components/FeaturedDeal";
import TopRatedAndBestSeller from "../Components/TopRatedAndBestSeller";
import LatestProducts from "../Components/LatestProducts";
import Brands from "../Components/brands";
import SectionBeforeFooter from "../Components/SectionBeforeFooter";

const Home = () => {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <HeroSection2 />
      <FeaturedDeal />
      <NewComponent />
      <CategoriesSection />
      <LatestProducts />
      <TopRatedAndBestSeller />
      <Brands />
      <SectionBeforeFooter />
    </div>
  );
};

export default Home;
