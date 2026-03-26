// OAuthCallback.jsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import InfoModal from "../components/InfoModal";

const OAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState({
        icon: "",
        title: "",
        content: null,
        btnMsg: "",
        onMove: () => {},
    });

    useEffect(() => {
        const token = searchParams.get("token");
        const id = searchParams.get("id");
        const status = searchParams.get("status");

        // 기본 이동 경로 설정
        let targetPath = "/";
        let contentConfig = {};

        if (token) {
            localStorage.setItem("token", token);
            localStorage.setItem("id", id);

            if (status === "signup_success") {
                contentConfig = {
                    icon: "🎉",
                    title: "Welcome to TOPABODA!",
                    btnMsg: "メインページへ",
                    content: (
                        <>
                            {id}様、会員登録ありがとうございます。
                            <br />
                            探訪の旅을 今すぐ始めましょう！
                        </>
                    ),
                };
            } else if (status === "login_success") {
                contentConfig = {
                    icon: "🎉",
                    title: "Welcome back to TOPABODA!",
                    btnMsg: "メインページへ",
                    content: (
                        <>
                            {id}様、お帰りなさい。
                            <br />
                            今日も新しい探訪の旅を続けましょう！
                        </>
                    ),
                };
            }
        } else {
            if (status === "already_exists") {
                targetPath = "/login";
                contentConfig = {
                    icon: "🔍",
                    title: "このアカウントは既に登録済みです",
                    btnMsg: "ログインページへ",
                    content: (
                        <>
                            ご入力いただいた情報のアカウントは、既に登録されています。
                            <br />
                            ログイン画面に戻ってログインしてください。
                        </>
                    ),
                };
            } else if (status === "user_not_found") {
                contentConfig = {
                    icon: "✍️",
                    title: "一致する情報が見고つかりませんでした。",
                    btnMsg: "ログインページへ",
                    content: (
                        <>
                            ご入力いただいた情報で登録されているアカウントはありません。
                            <br />
                            TOPABODAのメンバーになってみませんか？
                        </>
                    ),
                };
            } else {
                contentConfig = {
                    icon: "⚠️",
                    title: "エラーが発生しました",
                    btnMsg: "ログインページへ",
                    content: (
                        <>
                            ログイン処理中に予期せぬエラーが発生しました。
                            <br />
                            時間を置いてから、再度お試しください。
                        </>
                    ),
                };
            }
        }

        setPopupContent({
            ...contentConfig,
            onMove: () => navigate(targetPath, { replace: true }),
        });
        setOpenPopup(true);
    }, [searchParams, navigate]);

    return (
        <>
            <InfoModal open={openPopup} icon={popupContent.icon} title={popupContent.title} content={popupContent.content} btnMsg={popupContent.btnMsg} onMove={popupContent.onMove} />
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <p>認証処理中です。少々お待ちください...</p>
            </div>
        </>
    );
};

export default OAuthCallback;
