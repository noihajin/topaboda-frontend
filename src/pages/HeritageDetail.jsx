import { useState, useRef } from "react";
import { useParams } from "react-router-dom";

import { C, font, MOCK_HERITAGE, MOCK_REVIEWS } from "../components/heritagedetail/constants";
import HeritageHero    from "../components/heritagedetail/HeritageHero";
import HeritageContent from "../components/heritagedetail/HeritageContent";
import HeritageSidebar from "../components/heritagedetail/HeritageSidebar";

export default function HeritageDetail() {
  const { heritageId } = useParams();
  const galleryRef = useRef(null);

  const [isLiked,       setIsLiked]       = useState(false);
  const [isBookmarked,  setIsBookmarked]  = useState(false);
  const [likeCount,     setLikeCount]     = useState(MOCK_HERITAGE.likeCount);

  // GET /api/heritages/{heritageId}  ← API 연동 시 교체
  const data = MOCK_HERITAGE;

  const handleLike = () => {
    // POST/DELETE /api/heritages/{heritageId}/likes
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleBookmark = () => {
    // POST/DELETE /api/bookmarks/{heritageId}
    setIsBookmarked((prev) => !prev);
  };

  const scrollGallery = (dir) => {
    if (galleryRef.current) {
      galleryRef.current.scrollBy({ left: dir * 340, behavior: "smooth" });
    }
  };

  return (
    <div style={{ fontFamily: font, background: C.bg, minHeight: "100vh" }}>

      {/* 히어로 섹션 */}
      <HeritageHero
        data={data}
        isLiked={isLiked}
        isBookmarked={isBookmarked}
        likeCount={likeCount}
        onLike={handleLike}
        onBookmark={handleBookmark}
      />

      {/* 메인 콘텐츠 */}
      <div style={{
        background: "#eeeeee", padding: "60px 72px",
        display: "flex", gap: 48, alignItems: "stretch",
        maxWidth: 1920, margin: "0 auto",
      }}>
        <HeritageContent
          data={data}
          reviews={MOCK_REVIEWS}
          galleryRef={galleryRef}
          scrollGallery={scrollGallery}
        />
        <HeritageSidebar data={data} />
      </div>

    </div>
  );
}
