// src/pages/MainHome.jsx
import HeroSection from "../components/HeroSection";
import SearchFilter from "../components/SearchFilter";
import MapSection from "../components/MapSection";
import PopularHeritageSection from "../components/PopularHeritageSection";

export default function MainHome() {
  return (
    <>
      <HeroSection />
      <SearchFilter />
      <MapSection />
      <PopularHeritageSection />
    </>
  );
}