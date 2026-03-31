import { C, font, fontSerif, MEDAL_INFO } from "./constants";
import { ProgressBar } from "./AchievementUI";

export default function AchievementCard({ item }) {
  const { img: medalImg, color: medalColor, emoji: medalEmoji } = MEDAL_INFO[item.grade];

  const cardBg      = item.achieved
    ? "linear-gradient(90deg, #FFFEF5 0%, #FFFEF8 33%, #FFFFFA 66%, #FFFFFF 100%)"
    : C.white;
  const borderColor = item.achieved ? C.gold : C.border;

  return (
    <div
      style={{
        background: cardBg,
        border: `1.5px solid ${borderColor}`,
        borderRadius: 16,
        padding: "26px 28px",
        display: "flex", gap: 28, alignItems: "flex-start",
        boxShadow: item.achieved
          ? "0 8px 16px rgba(0,0,0,0.08), 0 3px 6px rgba(0,0,0,0.06)"
          : "none",
        transition: "transform 0.25s, box-shadow 0.25s",
        cursor: "default",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = item.achieved
          ? "0 14px 28px rgba(202,202,0,0.18), 0 6px 12px rgba(0,0,0,0.08)"
          : "0 6px 18px rgba(0,0,0,0.09)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = item.achieved
          ? "0 8px 16px rgba(0,0,0,0.08), 0 3px 6px rgba(0,0,0,0.06)"
          : "none";
      }}
    >
      {/* メダル画像 */}
      <div style={{
        width: 140, height: 140, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: item.achieved ? 1 : 0.5,
      }}>
        <img
          src={medalImg}
          alt={`${item.grade}メダル`}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>

      {/* コンテンツ */}
      <div style={{ flex: 1, minWidth: 0, maxWidth: 820 }}>
        {/* タイトル行 */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
          <h3 style={{
            margin: 0, fontSize: 18, fontWeight: 900,
            fontFamily: fontSerif,
            color: item.achieved ? C.navy : C.sub,
          }}>
            {item.title}
          </h3>
          {item.achieved && (
            <span style={{
              background: C.gold, color: C.navy,
              fontSize: 11, fontWeight: 900,
              padding: "3px 11px", borderRadius: 99, fontFamily: font,
            }}>
              獲得済み
            </span>
          )}
        </div>

        {/* メダル種別 + 日付 */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 13, fontWeight: 700, fontFamily: font,
            color: item.achieved ? medalColor : "#B0B0B0",
          }}>
            {medalEmoji} {item.grade}メダル
          </span>
          {item.achieved && item.date && (
            <span style={{ fontSize: 12, color: C.sub, fontFamily: font }}>
              📅 {item.date} 獲得
            </span>
          )}
        </div>

        {/* 説明文 */}
        <p style={{
          margin: "0 0 14px", fontSize: 13.5, lineHeight: 1.7,
          color: item.achieved ? "#4A5565" : C.sub,
          fontFamily: font,
        }}>
          {item.description}
        </p>

        {/* 進捗バー */}
        <ProgressBar current={item.current} total={item.total} />
      </div>
    </div>
  );
}
