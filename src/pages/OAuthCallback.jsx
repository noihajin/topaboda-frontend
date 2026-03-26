// OAuthCallback.jsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import InfoModal from "../components/InfoModal";

const OAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const [onMove, setOnMove] = useState(() => navigate("/", { replace: true }));

        const [openPopup, setOpenPopup] = useState(false);

        // 1. URL 파라미터에서 token과 status 읽기
        const token = searchParams.get("token");
        const id = searchParams.get("id");
        const status = searchParams.get("status");

        if (token) {
            // 2. 로컬 스토리지에 토큰 저장 (로그인 완료)
            localStorage.setItem("token", token);
            localStorage.setItem("id", id);

            // 3. 상태에 따른 알림 처리
            if (status === "signup_success") {
                setPopupContent({
                    icon: "🎉",
                    title: "Welcome to TOPABODA!",
                    content: (
                        <>
                            ${id}様、会員登録ありがとうございます。
                            <br />
                            探訪の旅を今すぐ始めましょう！
                        </>
                    ),
                    onMove: onMove,
                });
            } else if (status === "login_success") {
                setPopupContent({
                    icon: "🎉",
                    title: "Welcome back to TOPABODA!",
                    content: (
                        <>
                            ${id}様、お帰りなさい。
                            <br />
                            今日も新しい探訪の旅を続けましょう！
                        </>
                    ),
                    onMove: onMove,
                });
            }
            openPopup(true);
        } else {
            // 에러 처리 로직
            if (status === "already_exists") {
                setOnMove(() => navigate("/login", { replace: true }));
                setPopupContent({
                    icon: "🔍",
                    title: "이미 가입된 계정입니다",
                    content: (
                        <>
                            입력하신 정보로 등록된 계정이 이미 존재합니다.
                            <br />
                            로그인 페이지에서 접속을 시도해주세요!
                        </>
                    ),
                    onMove: onMove,
                });
            } else if (status === "user_not_found") {
                setPopupContent({
                    icon: "✍️",
                    title: "등록된 정보 없음",
                    content: (
                        <>
                            찾으시는 회원 정보가 존재하지 않습니다.
                            <br />
                            TOPABODA의 새로운 가족이 되어보시겠어요?
                        </>
                    ),
                    onMove: onMove,
                });
            } else {
                setPopupContent({
                    icon: "⚠️",
                    title: "오류 발생",
                    content: (
                        <>
                            로그인 처리 중 예기치 못한 문제가 발생했습니다.
                            <br />
                            잠시 후 다시 시도해 주세요.
                        </>
                    ),
                    onMove: onMove,
                });
            }
            openPopup(true);
        }
    }, [searchParams, navigate]);

    return (
        <>
            <InfoModal open={openPopup} icon={popupContent.icon} title={popupContent.title} content={popupContent.content} onMove={"/"} />
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <p>인증 처리 중입니다. 잠시만 기다려주세요...</p>
            </div>
        </>
    );
};

export default OAuthCallback;
