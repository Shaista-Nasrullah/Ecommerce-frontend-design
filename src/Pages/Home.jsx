import React from "react";
import HeroSection from "../Components/HeroSection";
import NewComponent from "../Components/NewComponent";
import CategoriesSection from "../Components/Categories";
import FeaturedDeal from "../Components/FeaturedDeal";
import TopRatedAndBestSeller from "../Components/TopRatedAndBestSeller";
import LatestProducts from "../Components/LatestProducts";
import Brands from "../Components/brands";
import SectionBeforeFooter from "../Components/SectionBeforeFooter";
import CategorySidebar from "../Components/CategorySidebar";
import { Container, Row, Col } from "react-bootstrap";

const Home = () => {
  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* <HeroSection /> */}
      <Container fluid className="mt-3">
        <Row>
          <Col lg={3} className="d-none d-lg-block">
            <CategorySidebar />
          </Col>
          <Col lg={9} xs={12}>
            <Row>
              <HeroSection />
            </Row>
          </Col>
        </Row>
      </Container>
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
