import { useNavigate } from "react-router-dom";
import { C, font, fontSerif } from "./constants";
import { IconClock, IconTag, IconMapPinSmall, IconPlus, IconExternalLink, IconAward, IconCheck, InfoRow } from "./DetailUI";

export default function HeritageSidebar({ data, heritageId: heritageIdParam }) {
    const navigate = useNavigate();

    const goToRouteCreate = () => {
        const id = data?.id ?? heritageIdParam;
        if (id == null || String(id).trim() === "") return;
        const name = (data?.nameJa || data?.nameKo || "").trim();
        const params = new URLSearchParams();
        params.set("heritageId", String(id));
        if (name) params.set("heritageName", name);
        navigate(`/route/create?${params.toString()}`);
    };

    return (
        <div style={{ width: 360, flexShrink: 0 }}>
            <div
                style={{
                    position: "sticky",
                    top: 96,
                    display: "flex",
                    flexDirection: "column",
                    gap: 24,
                    maxHeight: "calc(100vh - 116px)",
                    overflowY: "auto",
                    paddingRight: 2,
                }}
            >
                {/* 기본 정보 카드 (navy 그라디언트) */}
                <div
                    style={{
                        background: C.navyGrad,
                        borderRadius: 18,
                        padding: "36px",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 24,
                    }}
                >
                    <h3 style={{ fontFamily: fontSerif, fontSize: 22, color: "white", margin: 0 }}>基本情報</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <InfoRow icon={<IconClock />} label="時代" value={data.era} />
                        <InfoRow icon={<IconTag />} label="分類" value={data.type} />
                        <InfoRow icon={<IconMapPinSmall />} label="所在地" value={data.location} />
                    </div>

                    {/* 버튼 */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 4 }}>
                        <button
                            type="button"
                            onClick={goToRouteCreate}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 10,
                                background: "white",
                                border: "none",
                                borderRadius: 14,
                                padding: "16px",
                                cursor: "pointer",
                                fontFamily: font,
                                fontSize: 15,
                                fontWeight: 700,
                                color: C.navy,
                                transition: "transform 0.2s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
                        >
                            <IconPlus /> 新しい探訪路を作る
                        </button>
                        <button
                            onClick={() => {
                                const lat = data?.latitude || 37.5665;
                                const lng = data?.longitude || 126.978;
                                const googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

                                window.open(googleMapUrl, "_blank", "noopener,noreferrer");
                            }}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 10,
                                background: "rgba(255,255,255,0.12)",
                                border: "1.5px solid rgba(255,255,255,0.2)",
                                borderRadius: 14,
                                padding: "16px",
                                cursor: "pointer",
                                fontFamily: font,
                                fontSize: 15,
                                fontWeight: 700,
                                color: "white",
                                transition: "background 0.2s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
                        >
                            <IconExternalLink /> Googleマップでナビ
                        </button>
                    </div>
                </div>

                {/* 업적 카드 (yellow 그라디언트) */}
                <div
                    onClick={() => navigate("/achievements")}
                    style={{
                        background: C.yellowGrad,
                        borderRadius: 18,
                        padding: "36px",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                        cursor: "pointer",
                        transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease",
                        border: "none",
                        outline: "none",
                        willChange: "transform",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 30px 60px rgba(0,0,0,0.18)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.12)";
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <IconAward />
                        <h3 style={{ fontFamily: fontSerif, fontSize: 20, color: C.navy, margin: 0 }}>実績を解除</h3>
                    </div>
                    <p style={{ fontSize: 15, color: C.navy, margin: 0, fontFamily: font, lineHeight: 1.7 }}>この遺産を訪問してバッジを獲得しましょう</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <IconCheck />
                        <span style={{ fontSize: 13, color: "rgba(0,13,87,0.8)", fontFamily: font }}>訪問認証で特別なバッジを獲得</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
