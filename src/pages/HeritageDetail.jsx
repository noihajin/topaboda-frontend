import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { C, font, MOCK_HERITAGE, MOCK_REVIEWS } from "../components/heritagedetail/constants";
import HeritageHero from "../components/heritagedetail/HeritageHero";
import HeritageContent from "../components/heritagedetail/HeritageContent";
import HeritageSidebar from "../components/heritagedetail/HeritageSidebar";
import { API_URL } from "../config/config";

export default function HeritageDetail() {
    const { heritageId } = useParams();
    const galleryRef = useRef(null);

    const [data, setData] = useState(null);

    const [reviewData, setReviewData] = useState({
        content: [],
        totalPages: 0,
        totalElements: 0,
        number: 0,
    });
    const [reviewPage, setReviewPage] = useState(0);

    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isLiking, setIsLiking] = useState(false);
    const [isBookmarking, setIsBookmarking] = useState(false);

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`${API_URL}/topaboda/api/heritages/${heritageId}/reviews`, { params: { page: reviewPage, size: 5 } });
            setReviewData(response.data);
        } catch (e) {
            console.error("리뷰 불러오기 실패:", e);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseHeritage = await axios.get(`${API_URL}/topaboda/api/heritages/${heritageId}`);
                setData(responseHeritage.data);
                setLikeCount(responseHeritage.data.likeCount ?? 0);

                await fetchReviews();

                const id = localStorage.getItem("id");
                const token = localStorage.getItem("token");
                if (!id || !token) return;

                const responseLike = await axios.get(`${API_URL}/topaboda/api/heritages/${heritageId}/likes`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setIsLiked(responseLike.data);

                const responseBookmark = await axios.get(`${API_URL}/topaboda/api/heritages/${heritageId}/bookmarks`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setIsBookmarked(responseBookmark.data);
            } catch (e) {
                console.error("데이터 불러오기 실패:", e);
            }
        };
        fetchData();
    }, [heritageId]);

    useEffect(() => {
        fetchReviews(reviewPage);
    }, [heritageId, reviewPage]);

    const handleLike = async (e) => {
        e.stopPropagation();
        if (isLiking) return;

        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        if (!id || !token) {
            alert("ログインが必要です。");
            return;
        }

        setIsLiking(true);

        const originalLiked = isLiked;
        const originalCount = likeCount;

        setIsLiked(!originalLiked);
        setLikeCount((prev) => (originalLiked ? prev - 1 : prev + 1));

        try {
            if (originalLiked) {
                await axios.delete(`${API_URL}/topaboda/api/heritages/${data.id}/likes`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post(
                    `${API_URL}/topaboda/api/heritages/${data.id}/likes`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
            }
        } catch (e) {
            console.error("에러 발생:", e);
            setIsLiked(originalLiked);
            setLikeCount(originalCount);
        } finally {
            setIsLiking(false);
        }
    };

    const handleBookmark = async (e) => {
        e.stopPropagation();
        if (isBookmarking) return;

        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        if (!id || !token) {
            alert("ログインが必要です。");
            return;
        }

        setIsBookmarking(true);

        const originalBookmarked = isBookmarked;
        setIsBookmarked(!originalBookmarked);
        try {
            if (originalBookmarked) {
                await axios.delete(`${API_URL}/topaboda/api/heritages/${data.id}/bookmarks`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post(
                    `${API_URL}/topaboda/api/heritages/${data.id}/bookmarks`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
            }
        } catch (e) {
            console.error("에러 발생:", e);
            setIsBookmarked(originalBookmarked);
        } finally {
            setIsBookmarking(false);
        }
    };

    const scrollGallery = (dir) => {
        if (galleryRef.current) {
            galleryRef.current.scrollBy({ left: dir * 340, behavior: "smooth" });
        }
    };

    if (!data) return <div>Loading...</div>;
    return (
        <div style={{ fontFamily: font, background: C.bg, minHeight: "100vh" }}>
            {/* 히어로 섹션 */}
            <HeritageHero data={data} isLiked={isLiked} isBookmarked={isBookmarked} likeCount={likeCount} isLiking={isLiking} isBookmarking={isBookmarking} onLike={handleLike} onBookmark={handleBookmark} />

            {/* 메인 콘텐츠 */}
            <div
                style={{
                    background: C.bg,
                    padding: "60px 72px",
                    display: "flex",
                    gap: 48,
                    alignItems: "stretch",
                    maxWidth: 1920,
                    margin: "0 auto",
                }}
            >
                <HeritageContent data={data} reviews={reviewData.content} reviewPage={reviewPage} totalPages={reviewData.totalPages} setReviewPage={setReviewPage} fetchReviews={fetchReviews} galleryRef={galleryRef} scrollGallery={scrollGallery} />
                <HeritageSidebar data={data} heritageId={heritageId} />
            </div>
        </div>
    );
}
