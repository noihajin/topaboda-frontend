import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopaModal from "../components/TopaModal";
import useModal from "../hooks/useModal";
import { DELETE_ACCOUNT } from "../constants/modalConfigs";
import axios from "axios";

// ── 디자인 토큰 ─────────────────────────────────────────────────────
const C = {
    navy: "#000d57",
    red: "#6e0000",
    yellow: "#caca00",
    gray: "#6b7280",
    border: "#e5e7eb",
    bg: "#eeeeee",
    white: "#ffffff",
};
const font = "'Noto Sans JP', 'Noto Sans KR', sans-serif";

// ── 아이콘 ────────────────────────────────────────────────────────────
const IconCamera = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
    </svg>
);
const IconChevronRight = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);
const IconChevronRightRed = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────
export default function EditProfile() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [newNickname, setNewNickname] = useState("");
    const [nickCheck, setNickCheck] = useState(null); // null | "ok" | "dup"
    const [previewImg, setPreviewImg] = useState(null);
    const [hoverSave, setHoverSave] = useState(false);
    const [hoverCancel, setHoverCancel] = useState(false);
    const [hoverPw, setHoverPw] = useState(false);
    const [hoverDel, setHoverDel] = useState(false);
    const [hoverCheck, setHoverCheck] = useState(false);
    const deleteModal = useModal();

    useEffect(() => {
        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        if (!id || !token) {
            console.error("인증 정보가 없습니다.");
            return;
        }

        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:9990/topaboda/api/users/profile/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPreviewImg(response.data.icon);
            } catch (error) {
                console.error("프로필 로드 실패:", error);
            }
        };

        fetchUserProfile();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => setPreviewImg(ev.target.result);
        reader.readAsDataURL(file);
    };

    const handleNicknameCheck = async () => {
        if (!newNickname.trim()) return;

        try {
            const response = await axios.post(`http://localhost:9990/topaboda/api/auth/signUp/nickname`, {
                nickname: newNickname,
            });

            // 서버가 중복이 아닐 때 200 OK를 보낸다고 가정
            if (response.status === 200) {
                setNickCheck("ok");
            }
        } catch (e) {
            // Axios 에러 객체에서 응답 코드를 확인
            if (e.response && (e.response.status === 409 || e.response.status === 400)) {
                setNickCheck("dup");
            } else {
                console.error("닉네임 변경 중 서버 오류 발생", e);
                alert("서버 통신 중 오류가 발생했습니다.");
            }
        }
    };

    const handleSave = async () => {
        if (newNickname && nickCheck !== "ok") {
            alert("ニックネームの重複確認をしてください。");
            return;
        }

        const token = localStorage.getItem("token");
        const formData = new FormData();

        const file = fileInputRef.current?.files?.[0];
        if (file) {
            formData.append("icon", file);
        }

        const profileData = {
            nickname: newNickname || null,
            icon: file ? file.name : previewImg === null ? "0" : null,
        };

        formData.append("data", new Blob([JSON.stringify(profileData)], { type: "application/json" }));

        try {
            const response = await axios.patch(`http://localhost:9990/topaboda/api/users/profile`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                alert("変更を保存しました！");
                navigate("/mypage");
            }
        } catch (e) {
            console.error("프로필 수정 실패:", e);
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f8f9fc", fontFamily: font, paddingBottom: 80 }}>
            {/* ── 헤더 ── */}
            <div style={{ paddingTop: "11.9rem", textAlign: "center", marginBottom: 32 }}>
                <h1 style={{ fontSize: 34, fontWeight: 700, color: C.navy, margin: "0 0 10px" }}>プロフィール編集</h1>
                <p style={{ fontSize: 15, color: C.gray, margin: 0 }}>あなたの情報を更新してください</p>
            </div>

            <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px", display: "flex", flexDirection: "column", gap: 24 }}>
                {/* ── 프로필 편집 카드 ── */}
                <div
                    style={{
                        background: C.white,
                        borderRadius: 15,
                        padding: "32px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 28,
                    }}
                >
                    {/* 프로필 이미지 */}
                    <div
                        style={{
                            borderBottom: `1px solid ${C.border}`,
                            paddingBottom: 28,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <div style={{ position: "relative", width: 120, height: 120 }}>
                            {/* 이미지 원형 */}
                            <div
                                style={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: "50%",
                                    border: `3.5px solid ${C.yellow}`,
                                    overflow: "hidden",
                                    boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
                                }}
                            >
                                {previewImg ? (
                                    <img src={previewImg} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            background: "linear-gradient(135deg, #e9eaf0, #d1d5db)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 40,
                                            color: C.gray,
                                        }}
                                    >
                                        👤
                                    </div>
                                )}
                            </div>
                            {/* 카메라 버튼 */}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    position: "absolute",
                                    bottom: 2,
                                    right: 2,
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    background: C.red,
                                    border: "none",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                                    transition: "opacity 0.2s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                            >
                                <IconCamera />
                            </button>
                            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" style={{ display: "none" }} onChange={handleImageChange} />
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <p style={{ fontSize: 12, color: C.gray, margin: "0 0 2px" }}>クリックして画像を変更してください</p>
                            <p style={{ fontSize: 12, color: C.gray, margin: 0 }}>(JPG, PNG, 最大5MB)</p>
                        </div>
                    </div>

                    {/* 입력 필드 */}
                    <div>
                        {/* 닉네임 변경 + 중복확인 */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>ニックネーム変更</label>
                            <div style={{ display: "flex", gap: 8 }}>
                                <input
                                    type="text"
                                    value={newNickname}
                                    onChange={(e) => {
                                        setNewNickname(e.target.value);
                                        setNickCheck(null);
                                    }}
                                    placeholder="新しいニックネームを入力"
                                    style={{
                                        flex: 1,
                                        border: `1.2px solid ${nickCheck === "ok" ? "#16a34a" : nickCheck === "dup" ? "#dc2626" : C.border}`,
                                        borderRadius: 13,
                                        padding: "12px 16px",
                                        fontSize: 14,
                                        fontFamily: font,
                                        outline: "none",
                                        color: "#0a0a0a",
                                        transition: "border-color 0.2s",
                                    }}
                                    onFocus={(e) => {
                                        if (!nickCheck) e.target.style.borderColor = C.navy;
                                    }}
                                    onBlur={(e) => {
                                        if (!nickCheck) e.target.style.borderColor = C.border;
                                    }}
                                />
                                <button
                                    onClick={handleNicknameCheck}
                                    onMouseEnter={() => setHoverCheck(true)}
                                    onMouseLeave={() => setHoverCheck(false)}
                                    style={{
                                        padding: "0 10px",
                                        borderRadius: 8,
                                        fontSize: 12,
                                        fontWeight: 500,
                                        border: `1px solid ${C.border}`,
                                        background: hoverCheck ? "#e5e7eb" : "#f3f4f6",
                                        color: C.gray,
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        whiteSpace: "nowrap",
                                        fontFamily: font,
                                    }}
                                >
                                    重複確認
                                </button>
                            </div>
                            {/* 중복확인 결과 메시지 */}
                            {nickCheck === "ok" && <p style={{ fontSize: 12, color: "#16a34a", margin: 0, fontFamily: font }}>✓ 使用可能なニックネームです。</p>}
                            {nickCheck === "dup" && <p style={{ fontSize: 12, color: "#dc2626", margin: 0, fontFamily: font }}>✗ すでに使用されているニックネームです。</p>}
                        </div>
                    </div>

                    {/* 버튼 */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <button
                            onClick={() => navigate("/mypage")}
                            onMouseEnter={() => setHoverCancel(true)}
                            onMouseLeave={() => setHoverCancel(false)}
                            style={{
                                border: `1.2px solid ${C.border}`,
                                borderRadius: 13,
                                padding: "16px",
                                fontSize: 15,
                                fontWeight: 700,
                                fontFamily: font,
                                background: hoverCancel ? "#f3f4f6" : C.white,
                                color: C.gray,
                                cursor: "pointer",
                                transition: "background 0.2s",
                            }}
                        >
                            キャンセル
                        </button>
                        <button
                            onClick={handleSave}
                            onMouseEnter={() => setHoverSave(true)}
                            onMouseLeave={() => setHoverSave(false)}
                            style={{
                                border: "none",
                                borderRadius: 13,
                                padding: "16px",
                                fontSize: 15,
                                fontWeight: 700,
                                fontFamily: font,
                                background: hoverSave ? "#001070" : C.navy,
                                color: C.white,
                                cursor: "pointer",
                                transition: "background 0.2s, transform 0.2s",
                                transform: hoverSave ? "translateY(-2px)" : "none",
                            }}
                        >
                            変更を保存
                        </button>
                    </div>

                    {/* 안내 배너 */}
                    <div
                        style={{
                            background: "#fff9e6",
                            border: "1.2px solid rgba(202,202,0,0.3)",
                            borderRadius: 13,
                            padding: "16px",
                            fontSize: 12,
                            color: C.gray,
                            textAlign: "center",
                        }}
                    >
                        ✏️ ニックネームは重複確認後に変更を保存してください。
                    </div>
                </div>

                {/* ── 계정 설정 카드 ── */}
                <div
                    style={{
                        background: C.white,
                        borderRadius: 15,
                        padding: "32px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 24,
                    }}
                >
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: C.navy, margin: 0 }}>アカウント設定</h2>

                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {/* 비밀번호 변경 */}
                        <button
                            onClick={() => navigate("/mypage/password")}
                            onMouseEnter={() => setHoverPw(true)}
                            onMouseLeave={() => setHoverPw(false)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                border: `1.2px solid ${C.border}`,
                                borderRadius: 13,
                                padding: "16px 18px",
                                background: hoverPw ? "#f9fafb" : C.white,
                                cursor: "pointer",
                                transition: "background 0.2s",
                                width: "100%",
                            }}
                        >
                            <span style={{ fontSize: 14, fontWeight: 600, color: C.navy, fontFamily: font }}>パスワード変更</span>
                            <IconChevronRight />
                        </button>

                        {/* 계정 삭제 */}
                        <button
                            onClick={deleteModal.open}
                            onMouseEnter={() => setHoverDel(true)}
                            onMouseLeave={() => setHoverDel(false)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                border: "1.2px solid #fee2e2",
                                borderRadius: 13,
                                padding: "16px 18px",
                                background: hoverDel ? "#fee2e2" : "#fef2f2",
                                cursor: "pointer",
                                transition: "background 0.2s",
                                width: "100%",
                            }}
                        >
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#dc2626", fontFamily: font }}>アカウント削除</span>
                            <IconChevronRightRed />
                        </button>
                    </div>
                </div>
            </div>

            {/* 계정 탈퇴 확인 모달 */}
            <TopaModal
                {...DELETE_ACCOUNT}
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.close}
                onConfirm={() => {
                    // TODO: DELETE /api/users/me
                    deleteModal.close();
                    navigate("/");
                }}
            />
        </div>
    );
}
