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
            setOpenPopup(true);
        } else {
            // 에러 처리 로직
            if (status === "already_exists") {
                setOnMove(() => navigate("/login", { replace: true }));
                setPopupContent({
                    icon: "🔍",
                    title: "このアカウントは既に登録済みです",
                    content: (
                        <>
                            ご入力いただいた情報のアカウントは、既に登録されています。
                            <br />
                            ログイン画面に戻ってログインしてください。
                        </>
                    ),
                    onMove: onMove,
                });
            } else if (status === "user_not_found") {
                setPopupContent({
                    icon: "✍️",
                    title: "一致する情報が見つかりませんでした。",
                    content: (
                        <>
                            ご入力いただいた情報で登録されているアカウントはありません。
                            <br />
                            TOPABODAのメンバーになってみませんか？
                        </>
                    ),
                    onMove: onMove,
                });
            } else {
                setPopupContent({
                    icon: "⚠️",
                    title: "エラーが発生しました",
                    content: (
                        <>
                            ログイン処理中に予期せぬエラーが発生しました。
                            <br />
                            時間を置いてから、再度お試しください。
                        </>
                    ),
                    onMove: onMove,
                });
            }
            setOpenPopup(true);
        }
    }, [searchParams, navigate]);

    return (
        <>
            <InfoModal open={openPopup} icon={popupContent.icon} title={popupContent.title} content={popupContent.content} onMove={"/"} />
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <p>認証処理中です。少々お待ちください...</p>
            </div>
        </>
    );
};

export default OAuthCallback;
