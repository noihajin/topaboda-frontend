import { useState, useRef, useCallback } from "react";

const C = {
  navy:   "#000d57",
  red:    "#6e0000",
  gold:   "#caca00",
  goldD:  "#a0a000",
  white:  "#ffffff",
  gray1:  "#364153",
  gray2:  "#4a5565",
  gray3:  "#6a7282",
  gray4:  "#99a1af",
  border: "#e5e7eb",
  bg:     "#f3f4f6",
};
const font      = "'Noto Sans KR', 'Noto Sans JP', sans-serif";
const fontSerif = "'Shippori Mincho', serif";

const TAGS = [
  { id:"all",        label:"すべて",        color:"#000d57" },
  { id:"night",      label:"夜間開放",      color:"#1a1a6e" },
  { id:"hands-on",   label:"体験",          color:"#6e3000" },
  { id:"drive",      label:"ドライブ",      color:"#006e1a" },
  { id:"photo",      label:"フォトスポット", color:"#6e006e" },
  { id:"healing",    label:"癒し",          color:"#00566e" },
  { id:"history",    label:"歴史探訪",      color:"#5c4000" },
  { id:"family",     label:"家族向け",      color:"#006e56" },
  { id:"walk",       label:"散策",          color:"#3d006e" },
  { id:"season",     label:"季節限定",      color:"#6e0038" },
  { id:"free",       label:"入場無料",      color:"#006e6e" },
  { id:"together",   label:"デートに",      color:"#6e0020" },
];

const PINS = [
  {
    id:1, x:430, y:310,
    name:"崇礼門（南大門）", nameKr:"숭례문 (남대문)",
    category:"建造物", badge:"国宝第1号",
    count:12, likeCount:248,
    address:"ソウル特別市中区南大門路4街29",
    era:"朝鮮時代（1398年）", type:"史跡・城郭",
    tags:["night","photo","history","walk","together"],
    image:"https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=800&auto=format&fit=crop",
    reviews:[
      { id:1, initial:"田", name:"田中太郎", stars:4, date:"2024.02.28", helpful:24,
        text:"ソウル駅からすぐの場所にあり、アクセスが非常に便利です。夜のライトアップも美しく、写真撮影にも最適でした。" },
      { id:2, initial:"鈴", name:"鈴木美咲", stars:5, date:"2024.02.15", helpful:15,
        text:"韓国の象徴的な文化財として、一度は訪れるべき場所だと思います。近くの南大門市場と合わせて訪問するのがおすすめです。" },
    ],
  },
  {
    id:2, x:820, y:580,
    name:"慶州 仏国寺", nameKr:"불국사",
    category:"寺院", badge:"ユネスコ世界遺産",
    count:8, likeCount:189,
    address:"慶尚北道慶州市仏国路385",
    era:"新羅時代（528年）", type:"寺院・仏教建築",
    tags:["healing","history","photo","season","walk"],
    image:"https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=800&auto=format&fit=crop",
    reviews:[
      { id:1, initial:"佐", name:"佐藤健一", stars:5, date:"2026.03.10", helpful:31,
        text:"多宝塔の繊細な彫刻には圧倒されました。朝早く訪問すると観光客が少なく、静かに参拝できます。" },
      { id:2, initial:"山", name:"山田花子", stars:4, date:"2026.02.20", helpful:18,
        text:"世界遺産に登録されるだけあって、歴史的価値の高いスポットです。石窟庵とセットで訪問することをお勧めします。" },
    ],
  },
  {
    id:3, x:260, y:520,
    name:"水原 華城", nameKr:"수원화성",
    category:"城郭", badge:"国宝第3号",
    count:6, likeCount:134,
    address:"京畿道水原市八達区行宮路105",
    era:"朝鮮時代（1796年）", type:"城郭・軍事建築",
    tags:["drive","walk","history","photo","night","hands-on"],
    image:"https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=800&auto=format&fit=crop",
    reviews:[
      { id:1, initial:"中", name:"中村義雄", stars:4, date:"2026.01.15", helpful:22,
        text:"城壁沿いに歩くと2時間ほどかかりますが、各ポイントからの眺めが素晴らしい。" },
      { id:2, initial:"小", name:"小林直子", stars:5, date:"2025.12.28", helpful:9,
        text:"ライトアップされた夜の華城は格別の美しさです。週末は伝統芸能の公演もあり、とても楽しめました。" },
    ],
  },
  {
    id:4, x:610, y:200,
    name:"昌德宮", nameKr:"창덕궁",
    category:"宮殿", badge:"国宝第122号",
    count:15, likeCount:312,
    address:"ソウル特別市鍾路区律谷路99",
    era:"朝鮮時代（1405年）", type:"宮殿・王室建築",
    tags:["healing","season","history","family","together","photo","hands-on","free"],
    image:"https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?q=80&w=800&auto=format&fit=crop",
    reviews:[
      { id:1, initial:"伊", name:"伊藤誠", stars:5, date:"2026.03.05", helpful:44,
        text:"後苑（秘苑）のガイドツアーは必須です！予約が必要ですが、自然と建築が調和した空間は他では見られない美しさ。" },
      { id:2, initial:"渡", name:"渡辺さくら", stars:4, date:"2026.02.10", helpful:27,
        text:"四季それぞれの景色が楽しめる宮殿です。秋の紅葉シーズンは特に混雑しますが、その美しさは格別でした。" },
    ],
  },
  {
    id:5, x:700, y:420,
    name:"石窟庵", nameKr:"석굴암",
    category:"石窟", badge:"世界遺産",
    count:5, likeCount:97,
    address:"慶尚北道慶州市仏国路873-243",
    era:"統一新羅（751年）", type:"石窟・彫刻",
    tags:["healing","history","drive","season"],
    image:"https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=800&auto=format&fit=crop",
    reviews:[
      { id:1, initial:"加", name:"加藤浩二", stars:5, date:"2026.02.25", helpful:38,
        text:"本尊仏の完璧な均整美は写真では伝わりません。実際に対面すると神聖な気持ちになります。" },
      { id:2, initial:"吉", name:"吉田真理", stars:4, date:"2026.01.30", helpful:16,
        text:"仏国寺とセットで巡るのがおすすめ。山道を登る必要がありますが、その価値は十分あります。" },
    ],
  },
];

// ── 별점 ─────────────────────────────────────────────────────────
function Stars({ score }) {
  return (
    <div style={{ display:"flex", gap:2 }}>
      {[1,2,3,4,5].map(i => {
        const f = score>=i ? 1 : score>=i-0.5 ? 0.5 : 0;
        return (
          <div key={i} style={{ position:"relative", width:12, height:12 }}>
            <svg viewBox="0 0 12 12" width="12" height="12" style={{ position:"absolute" }}>
              <path d="M6 1l1.3 2.7 3 .4-2.2 2.1.5 3L6 7.8 3.4 9.2l.5-3L1.7 4.1l3-.4z" fill="#e5e7eb"/>
            </svg>
            <div style={{ position:"absolute", width:`${f*100}%`, overflow:"hidden" }}>
              <svg viewBox="0 0 12 12" width="12" height="12">
                <path d="M6 1l1.3 2.7 3 .4-2.2 2.1.5 3L6 7.8 3.4 9.2l.5-3L1.7 4.1l3-.4z" fill="#f59e0b"/>
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── 해시태그 필터 바 — sticky, 이모지·숫자 제거 ──────────────────
// ✅ position:"sticky" + top:0 으로 변경, 이모지·카운트 뱃지 삭제
function HashtagBar({ activeTag, onSelect, filteredCount }) {
  const scrollRef = useRef(null);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  const scroll = dir => {
    scrollRef.current?.scrollBy({ left: dir * 200, behavior:"smooth" });
  };

  return (
    // ✅ position sticky: 박스 내 스크롤 시 상단에 고정
    <div style={{
      position:"sticky",
      top:0,
      zIndex:40,
      padding:"12px 16px 10px",
      background:"#f0f1f4", // ✅ 섹션 배경색과 맞춤
    }}>
      <div style={{
        background:"rgba(255,255,255,0.92)",
        backdropFilter:"blur(16px)",
        WebkitBackdropFilter:"blur(16px)",
        borderRadius:14,
        boxShadow:"0 2px 12px rgba(0,13,87,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
        border:"1px solid rgba(0,13,87,0.08)",
        padding:"8px 44px 8px 12px",
        position:"relative",
        overflow:"hidden",
      }}>
        {/* 좌측 페이드 */}
        {canScrollLeft && (
          <div style={{
            position:"absolute", left:44, top:0, bottom:0, width:36, zIndex:2,
            background:"linear-gradient(to right, rgba(255,255,255,0.92), transparent)",
            pointerEvents:"none",
          }}/>
        )}
        {/* 우측 페이드 */}
        {canScrollRight && (
          <div style={{
            position:"absolute", right:44, top:0, bottom:0, width:36, zIndex:2,
            background:"linear-gradient(to left, rgba(255,255,255,0.92), transparent)",
            pointerEvents:"none",
          }}/>
        )}

        {/* 좌 화살표 */}
        {canScrollLeft && (
          <button onClick={()=>scroll(-1)} style={{
            position:"absolute", left:6, top:"50%", transform:"translateY(-50%)",
            width:28, height:28, borderRadius:"50%",
            background:"white", border:`1px solid ${C.border}`,
            boxShadow:"0 1px 4px",
            cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
            zIndex:3, color:C.navy, fontSize:14, fontWeight:700,
          }}>‹</button>
        )}

        {/* 태그 스크롤 */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          style={{
            display:"flex", gap:6, overflowX:"auto", scrollbarWidth:"none",
            alignItems:"center",
          }}
        >
          <style>{`::-webkit-scrollbar{display:none}`}</style>

          {TAGS.map(tag => {
            const isActive = activeTag === tag.id;
            return (
              <button
                key={tag.id}
                onClick={() => onSelect(tag.id)}
                style={{
                  flexShrink:0,
                  display:"flex", alignItems:"center",
                  height:32,
                  // ✅ 이모지·숫자 없으므로 패딩 균일하게
                  padding:"0 14px",
                  borderRadius:99,
                  border: isActive ? "none" : `1.5px solid ${C.border}`,
                  background: isActive ? tag.color : "white",
                  color: isActive ? "white" : C.gray2,
                  // ✅ "#라벨" 형태만 표시
                  fontSize:12, fontWeight: isActive ? 700 : 500,
                  cursor:"pointer", fontFamily:font,
                  boxShadow: isActive
                    ? `0 4px 12px ${tag.color}44`
                    : "0 1px 3px rgba(0,0,0,0.06)",
                  transition:"all 0.18s cubic-bezier(0.34,1.56,0.64,1)",
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                  whiteSpace:"nowrap",
                }}
              >
                #{tag.label}
              </button>
            );
          })}
        </div>

        {/* 우 화살표 */}
        {canScrollRight && (
          <button onClick={()=>scroll(1)} style={{
            position:"absolute", right:6, top:"50%", transform:"translateY(-50%)",
            width:28, height:28, borderRadius:"50%",
            background:"white", border:`1px solid ${C.border}`,
            boxShadow:"0 1px 4px rgba(0,0,0,0.12)",
            cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
            zIndex:3, color:C.navy, fontSize:14, fontWeight:700,
          }}>›</button>
        )}
      </div>

      {/* 필터 결과 알림 — 이모지 유지(결과 알림에는 맥락상 자연스러움) */}
      {activeTag !== "all" && (
        <div style={{
          marginTop:8, display:"flex", alignItems:"center", gap:8,
          animation:"fadeDown 0.2s ease",
        }}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:6,
            background:"rgba(0,13,87,0.85)",
            backdropFilter:"blur(8px)",
            borderRadius:99, padding:"5px 14px",
            color:"white", fontSize:11, fontWeight:600, fontFamily:font,
          }}>
            <span style={{ opacity:0.7 }}>フィルター中:</span>
            <span style={{ color:C.gold }}>#{TAGS.find(t=>t.id===activeTag)?.label}</span>
            <span style={{ opacity:0.7 }}>→</span>
            <span style={{ fontWeight:800 }}>{filteredCount}件</span>
            <button onClick={()=>onSelect("all")} style={{
              marginLeft:4, background:"rgba(255,255,255,0.15)",
              border:"none", color:"white", borderRadius:99,
              padding:"1px 8px", fontSize:11, cursor:"pointer",
              fontFamily:font,
            }}>✕ 解除</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── 지도 배경 ─────────────────────────────────────────────────────
function MapBackground() {
  return (
    <svg width="1100" height="800" viewBox="0 0 1100 800"
      style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}>
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d8dde6" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="1100" height="800" fill="#e8edf4"/>
      <rect width="1100" height="800" fill="url(#grid)" opacity="0.5"/>
      <path d="M 0 380 Q 200 350 350 390 Q 500 430 650 400 Q 800 370 1100 410"
        fill="none" stroke="#b8cfe8" strokeWidth="28" opacity="0.6"/>
      <path d="M 0 380 Q 200 350 350 390 Q 500 430 650 400 Q 800 370 1100 410"
        fill="none" stroke="#c8daf0" strokeWidth="22" opacity="0.8"/>
      <text x="280" y="378" fill="#8aadcc" fontSize="10" fontFamily={font} opacity="0.9">漢江</text>
      <ellipse cx="180" cy="220" rx="100" ry="70" fill="#c8dab8" opacity="0.5"/>
      <ellipse cx="900" cy="650" rx="130" ry="80" fill="#c8dab8" opacity="0.45"/>
      <ellipse cx="550" cy="120" rx="90" ry="55" fill="#d0e0c0" opacity="0.4"/>
      <text x="148" y="224" fill="#7a9a68" fontSize="9" fontFamily={font} opacity="0.8">北漢山</text>
      {[[60,60,80,50],[160,60,60,40],[240,80,70,35],[330,55,50,45],[60,130,90,40],[170,120,55,50],[240,140,75,30],[60,200,50,40],[120,190,70,45],[200,200,60,35],[750,80,80,50],[850,70,60,45],[930,90,70,40],[1010,75,60,50],[750,150,90,40],[860,145,55,45],[930,155,70,35],[750,480,80,50],[850,470,60,45],[930,490,75,40],[60,450,70,50],[150,460,60,40],[230,445,80,45],[60,530,65,40],[140,520,75,50],[230,535,60,35],[500,500,70,45],[590,490,60,50],[670,510,75,40],[500,570,80,40],[600,560,55,45],[670,575,70,40]].map(([x,y,w,h],i)=>(
        <rect key={i} x={x} y={y} width={w} height={h} rx="3" fill="#d2d8e4" opacity="0.55"/>
      ))}
      <path d="M 0 280 L 1100 280" stroke="#f5f5f0" strokeWidth="10" opacity="0.9"/>
      <path d="M 0 500 L 1100 500" stroke="#f5f5f0" strokeWidth="8" opacity="0.8"/>
      <path d="M 320 0 L 320 800" stroke="#f5f5f0" strokeWidth="10" opacity="0.9"/>
      <path d="M 700 0 L 700 800" stroke="#f5f5f0" strokeWidth="8" opacity="0.8"/>
      <path d="M 550 0 L 550 800" stroke="#f5f5f0" strokeWidth="6" opacity="0.7"/>
      {["M 0 160 L 1100 160","M 0 440 L 1100 440","M 0 620 L 1100 620","M 140 0 L 140 800","M 460 0 L 460 800","M 870 0 L 870 800"].map((d,i)=>(
        <path key={i} d={d} stroke="#ede9e0" strokeWidth="4" opacity="0.7"/>
      ))}
      {["M 0 90 L 1100 90","M 0 360 L 1100 360","M 0 680 L 1100 680","M 60 0 L 60 800","M 220 0 L 220 800","M 590 0 L 590 800","M 780 0 L 780 800"].map((d,i)=>(
        <path key={i} d={d} stroke="#e8e4da" strokeWidth="2" opacity="0.6"/>
      ))}
      {[{x:90,y:320,text:"종로구"},{x:400,y:200,text:"은평구"},{x:750,y:320,text:"성동구"},{x:200,y:600,text:"관악구"},{x:600,y:650,text:"강남구"},{x:950,y:200,text:"노원구"}].map((l,i)=>(
        <text key={i} x={l.x} y={l.y} fill="#a0a8bc" fontSize="11" fontFamily={font} fontWeight="600" opacity="0.7" textAnchor="middle">{l.text}</text>
      ))}
    </svg>
  );
}

// ── 핀 ───────────────────────────────────────────────────────────
function MapPin({ pin, isSelected, isFiltered, onClick, zoom }) {
  const opacity = isFiltered ? 0.18 : 1;
  return (
    <div onClick={isFiltered ? undefined : onClick} style={{
      position:"absolute", left:pin.x, top:pin.y,
      transform:`translate(-50%,-100%) scale(${(isSelected?1.3:1)/zoom})`,
      transformOrigin:"bottom center",
      cursor: isFiltered ? "default" : "pointer",
      transition:"transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease",
      zIndex: isSelected ? 30 : isFiltered ? 5 : 20,
      opacity,
    }}>
      {!isSelected && !isFiltered && (
        <>
          <div style={{ position:"absolute", bottom:-4, left:"50%", transform:"translateX(-50%)", width:48, height:48, borderRadius:"50%", background:"rgba(0,13,87,0.12)", animation:"pulse1 2s ease-out infinite" }}/>
          <div style={{ position:"absolute", bottom:-4, left:"50%", transform:"translateX(-50%)", width:36, height:36, borderRadius:"50%", background:"rgba(0,13,87,0.18)", animation:"pulse1 2s ease-out infinite 0.4s" }}/>
        </>
      )}
      <div style={{
        background: isSelected
          ? `linear-gradient(135deg,${C.red},#a00000)`
          : isFiltered ? "#b0b8c8"
          : `linear-gradient(135deg,${C.navy},#001a8c)`,
        borderRadius:"50% 50% 50% 0", transform:"rotate(-45deg)",
        width:42, height:42,
        display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow: isFiltered ? "none" : isSelected ? "0 6px 20px rgba(110,0,0,0.45)" : "0 6px 18px rgba(0,13,87,0.35)",
        border:"2.5px solid white",
        transition:"background 0.25s, box-shadow 0.25s",
      }}>
        <span style={{ transform:"rotate(45deg)", fontSize:13, fontWeight:900, color:"white", fontFamily:font }}>{pin.count}</span>
      </div>
      {zoom >= 1.5 && !isFiltered && (
        <div style={{
          position:"absolute", bottom:"100%", left:"50%",
          transform:"translateX(-50%) translateY(-8px)",
          background:"white", borderRadius:8, padding:"4px 10px",
          fontSize:11, fontWeight:700, color:C.navy, whiteSpace:"nowrap",
          boxShadow:"0 2px 8px rgba(0,0,0,0.15)", border:`1px solid ${C.border}`,
          pointerEvents:"none",
        }}>{pin.name}</div>
      )}
    </div>
  );
}

// ── 리뷰 카드 ─────────────────────────────────────────────────────
function ReviewCard({ review }) {
  const [helpful, setHelpful] = useState(review.helpful);
  const [voted,   setVoted]   = useState(false);
  return (
    <div style={{ background:C.white, borderRadius:10, padding:"16px 18px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", flexShrink:0 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
        <div style={{ width:34, height:34, borderRadius:"50%", background:C.navy, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ color:"white", fontWeight:700, fontSize:14, fontFamily:font }}>{review.initial}</span>
        </div>
        <div style={{ flex:1 }}>
          <p style={{ fontWeight:700, fontSize:13, color:C.navy, margin:"0 0 2px", fontFamily:font }}>{review.name}</p>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <Stars score={review.stars}/>
            <span style={{ fontSize:10, color:C.gray3, fontFamily:font }}>{review.date}</span>
          </div>
        </div>
      </div>
      <p style={{ fontSize:12, color:C.gray1, lineHeight:1.65, margin:"0 0 10px", fontFamily:font }}>{review.text}</p>
      <button onClick={()=>{ if(!voted){ setHelpful(h=>h+1); setVoted(true); } }}
        style={{ background:"none", border:"none", cursor:voted?"default":"pointer", fontSize:11, color:voted?C.navy:C.gray3, fontFamily:font, padding:0, fontWeight:voted?700:400 }}>
        役に立った ({helpful})
      </button>
    </div>
  );
}

// ── 상세 패널 — 태그 섹션 삭제 ────────────────────────────────────
function DetailPanel({ pin, onClose, onLike, onSave, likedIds, savedIds }) {
  const liked = likedIds.has(pin.id);
  const saved = savedIds.has(pin.id);
  const [likeCount, setLikeCount] = useState(pin.likeCount);
  const handleLike = () => { onLike(pin.id); setLikeCount(c=>liked?c-1:c+1); };

  return (
    <div style={{
      position:"absolute", right:0, top:0, bottom:0, width:400,
      background:"#f8f9fc",
      boxShadow:"-12px 0 40px rgba(0,0,0,0.10)", zIndex:50,
      display:"flex", flexDirection:"column",
      borderLeft:`1px solid ${C.border}`,
      animation:"slideIn 0.32s cubic-bezier(0.23,1,0.32,1)",
      overflow:"hidden",
    }}>
      <div className="panel-scroll" style={{ flex:1, overflowY:"auto" }}>
        {/* 히어로 */}
        <div style={{ position:"relative", height:220, background:"#101828", flexShrink:0 }}>
          <img src={pin.image} alt={pin.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 50%)" }}/>
          <button onClick={onClose} style={{ position:"absolute", top:12, left:12, width:34, height:34, borderRadius:"50%", background:"rgba(0,0,0,0.45)", border:"none", color:"white", fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(4px)" }}>✕</button>
          <div style={{ position:"absolute", top:12, right:12, display:"flex", gap:8 }}>
            <button onClick={()=>onSave(pin.id)} style={{ width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,0.9)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 3px 10px rgba(0,0,0,0.15)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={saved?C.navy:"none"} stroke={C.navy} strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            </button>
            <button onClick={handleLike} style={{ height:36, padding:"0 12px", borderRadius:18, background:"rgba(255,255,255,0.9)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:6, boxShadow:"0 3px 10px rgba(0,0,0,0.15)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill={liked?"#e11d48":"none"} stroke={liked?"#e11d48":C.gray3} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <span style={{ fontSize:12, fontWeight:700, color:C.gray1, fontFamily:font }}>{likeCount}</span>
            </button>
          </div>
          <div style={{ position:"absolute", bottom:14, left:14, background:`linear-gradient(to bottom,${C.gold},${C.goldD})`, borderRadius:8, padding:"5px 14px", boxShadow:"0 4px 12px rgba(0,0,0,0.2)" }}>
            <span style={{ fontSize:11, fontWeight:700, color:C.navy, fontFamily:font }}>国宝</span>
          </div>
        </div>

        {/* 본문 — ✅ 태그 섹션 블록 삭제 */}
        <div style={{ padding:"20px 22px", background:"#f8f9fc" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <span style={{ background:C.red, color:"white", borderRadius:99, padding:"3px 12px", fontSize:11, fontWeight:700, fontFamily:font }}>{pin.category}</span>
            <span style={{ fontSize:12, fontWeight:700, color:C.gold, fontFamily:font }}>{pin.badge}</span>
          </div>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8, marginBottom:4 }}>
            <h2 style={{ fontSize:22, fontWeight:700, color:C.navy, margin:0, fontFamily:fontSerif, lineHeight:1.3, flex:1 }}>{pin.name}</h2>
            <button style={{ flexShrink:0, background:"rgba(255,255,255,0.14)", border:`1px solid ${C.red}`, borderRadius:7, padding:"5px 10px", color:C.red, fontSize:11, fontWeight:500, cursor:"pointer", fontFamily:font, whiteSpace:"nowrap" }}>자세히 보기 →</button>
          </div>
          <p style={{ fontSize:13, color:C.gray3, margin:"0 0 16px", fontFamily:font }}>{pin.nameKr}</p>

          {/* ✅ 태그 블록 완전 삭제 */}

          {/* 정보 카드 */}
          <div style={{ background:C.white, borderRadius:10, padding:"14px 16px", marginBottom:16, display:"grid", gridTemplateColumns:"1fr 1fr 1fr", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
            {[{icon:"📍",label:"所在地",value:pin.address},{icon:"🕐",label:"時代",value:pin.era},{icon:"🏷",label:"分類",value:pin.type}].map((item,i)=>(
              <div key={i} style={{ display:"flex", gap:6, alignItems:"flex-start", paddingRight:i<2?10:0, paddingLeft:i>0?10:0, borderRight:i<2?`1px solid ${C.border}`:"none" }}>
                <div style={{ width:28, height:28, borderRadius:6, background:"#f3f4f6", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0 }}>{item.icon}</div>
                <div>
                  <p style={{ fontSize:9, color:C.gray3, margin:"0 0 2px", fontFamily:font }}>{item.label}</p>
                  <p style={{ fontSize:10, fontWeight:700, color:C.navy, margin:0, fontFamily:font, lineHeight:1.4 }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 버튼 */}
          <div style={{ display:"flex", gap:10, marginBottom:20 }}>
            <button style={{ flex:1, height:40, background:C.navy, color:"white", border:"none", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", gap:6, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:font }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>ルートに追加
            </button>
            <button style={{ flex:1, height:40, background:C.navy, color:"white", border:"none", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", gap:6, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:font }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>Googleマップで開く
            </button>
          </div>

          {/* 리뷰 */}
          <div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <h3 style={{ fontSize:17, fontWeight:700, color:C.navy, margin:0, fontFamily:fontSerif }}>口コミ</h3>
              <button style={{ background:C.red, color:"white", border:"none", borderRadius:7, padding:"6px 12px", fontSize:11, fontWeight:500, cursor:"pointer", fontFamily:font }}>口コミを書く</button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {pin.reviews.map(r=><ReviewCard key={r.id} review={r}/>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 메인 ─────────────────────────────────────────────────────────
export default function MapSection() {
  const mapRef     = useRef(null);
  const isDragging = useRef(false);
  const lastPos    = useRef({ x:0, y:0 });

  const [offset,    setOffset]    = useState({ x:0, y:0 });
  const [zoom,      setZoom]      = useState(1);
  const [selected,  setSelected]  = useState(null);
  const [likedIds,  setLikedIds]  = useState(new Set());
  const [savedIds,  setSavedIds]  = useState(new Set());
  const [activeTag, setActiveTag] = useState("all");

  const filteredPins = activeTag === "all"
    ? PINS
    : PINS.filter(p => p.tags.includes(activeTag));
  const filteredIds = new Set(filteredPins.map(p=>p.id));

  const handleTagSelect = (tagId) => {
    setActiveTag(tagId);
    if (selected && tagId !== "all" && !selected.tags.includes(tagId)) {
      setSelected(null);
    }
  };

  const onMouseDown = e => { isDragging.current=true; lastPos.current={x:e.clientX,y:e.clientY}; };
  const onMouseMove = e => {
    if (!isDragging.current) return;
    const dx=e.clientX-lastPos.current.x, dy=e.clientY-lastPos.current.y;
    lastPos.current={x:e.clientX,y:e.clientY};
    setOffset(p=>({x:p.x+dx,y:p.y+dy}));
  };
  const onMouseUp = () => { isDragging.current=false; };
  const onWheel = useCallback(e=>{ e.preventDefault(); setZoom(z=>Math.min(Math.max(z+(e.deltaY>0?-0.08:0.08),0.5),3)); },[]);

  const handlePinClick = pin => {
    const isToggle = selected?.id===pin.id;
    setSelected(isToggle ? null : pin);
    if (!isToggle && mapRef.current) {
      const rect=mapRef.current.getBoundingClientRect();
      setOffset({ x:rect.width/2-200-pin.x*zoom, y:rect.height/2-pin.y*zoom });
    }
  };

  const toggleLike = id => setLikedIds(s=>{const n=new Set(s);n.has(id)?n.delete(id):n.add(id);return n;});
  const toggleSave = id => setSavedIds(s=>{const n=new Set(s);n.has(id)?n.delete(id):n.add(id);return n;});

  return (
    // ✅ 전체화면 → 섹션 래퍼: 연한 회색 배경, max-width 박스, 패딩
    <section style={{
      background:"#f0f1f4",
      padding:"80px 0 100px",
      fontFamily:font,
    }}>
      {/* ✅ 중앙 정렬 컨테이너 */}
      <div style={{
        maxWidth:1400,
        margin:"0 auto",
        padding:"0 1.5rem",
      }}>
        {/* ✅ 섹션 타이틀 */}
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <h1 style={{
            fontFamily:fontSerif,
            fontSize:"clamp(28px, 3vw, 42px)",
            fontWeight:600,
            color:C.navy,
            margin:"0 0 12px",
            letterSpacing:"0.02em",
          }}>
            地域別の国宝探索
          </h1>
          <p style={{
            fontSize:16,
            color:C.gray3,
            fontFamily:font,
            margin:0,
          }}>
            地図上で地域を選択し、その地域の国宝を確認してください。
          </p>
        </div>

        {/* ✅ 지도 박스: 둥근 모서리 + 그림자로 구역 시각적 구분 */}
        <div style={{
          borderRadius:20,
          overflow:"hidden",
          boxShadow:"0 8px 40px rgba(0,13,87,0.12), 0 2px 8px rgba(0,13,87,0.06)",
          border:"1px solid rgba(0,13,87,0.08)",
          // ✅ 내부 스크롤을 위해 높이 고정 + overflow hidden
          height:"75vh",
          minHeight:560,
          position:"relative",
          // sticky가 동작하려면 overflow-y: auto 가 필요
          overflowY:"auto",
        }}>
          {/* ✅ HashtagBar: sticky top:0, 박스 내에서 고정 */}
          <HashtagBar
            activeTag={activeTag}
            onSelect={handleTagSelect}
            filteredCount={filteredPins.length}
          />

          {/* 지도 캔버스 영역 */}
          <div
            ref={mapRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onWheel={onWheel}
            style={{
              position:"relative",
              // 태그바 높이(약 64px)를 뺀 나머지를 지도가 채움
              height:"calc(100% - 64px)",
              cursor:"grab",
              overflow:"hidden",
              userSelect:"none",
            }}
          >
            <style>{`
              @keyframes pulse1{0%{transform:translateX(-50%) scale(.8);opacity:.8}100%{transform:translateX(-50%) scale(2.2);opacity:0}}
              @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
              @keyframes fadeDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
              .panel-scroll::-webkit-scrollbar{width:3px}
              .panel-scroll::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:2px}
            `}</style>

            {/* 지도 내용 */}
            <div style={{
              position:"absolute",
              transform:`translate(${offset.x}px,${offset.y}px) scale(${zoom})`,
              transformOrigin:"0 0",
              transition:selected?"transform 0.5s cubic-bezier(0.23,1,0.32,1)":"none",
              width:1100, height:800,
            }}>
              <MapBackground/>
              {PINS.map(pin=>(
                <MapPin key={pin.id} pin={pin}
                  isSelected={selected?.id===pin.id}
                  isFiltered={!filteredIds.has(pin.id)}
                  onClick={()=>handlePinClick(pin)} zoom={zoom}/>
              ))}
            </div>

            {/* 좌측 하단 컨트롤 */}
            <div style={{ position:"absolute", bottom:24, left:20, zIndex:40, display:"flex", flexDirection:"column", gap:4 }}>
              {["+","−"].map((lbl,i)=>(
                <button key={i} onClick={()=>setZoom(z=>Math.min(Math.max(z+(i===0?.2:-.2),.5),3))}
                  style={{ width:44, height:44, background:"rgba(255,255,255,0.95)", border:`1px solid ${C.border}`, borderRadius:i===0?"10px 10px 0 0":"0 0 10px 10px", fontSize:20, fontWeight:700, color:C.navy, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.12)" }}>{lbl}</button>
              ))}
              <div style={{ marginTop:6, background:"rgba(255,255,255,0.85)", borderRadius:8, padding:"4px 8px", textAlign:"center", fontSize:11, fontWeight:700, color:C.gray3 }}>{Math.round(zoom*100)}%</div>
            </div>

            {/* 나침반 */}
            <div style={{ position:"absolute", bottom:24, left:72, zIndex:40, width:44, height:44, background:"rgba(255,255,255,0.95)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.12)", border:`1px solid ${C.border}` }}>
              <svg width="22" height="22" viewBox="0 0 22 22">
                <polygon points="11,2 13.5,11 11,9 8.5,11" fill={C.red}/>
                <polygon points="11,20 8.5,11 11,13 13.5,11" fill="#aaa"/>
                <circle cx="11" cy="11" r="2" fill={C.navy}/>
              </svg>
            </div>

            {/* 리셋 */}
            <button onClick={()=>{setOffset({x:0,y:0});setZoom(1);}}
              style={{ position:"absolute", bottom:24, left:124, zIndex:40, width:44, height:44, background:"rgba(255,255,255,0.95)", border:`1px solid ${C.border}`, borderRadius:10, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.12)", color:C.navy }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>
            </button>

            {/* 스팟 카운트 */}
            <div style={{ position:"absolute", bottom:24, right:selected?408:16, zIndex:40, transition:"right 0.3s ease", background:"rgba(255,255,255,0.92)", borderRadius:12, padding:"10px 16px", boxShadow:"0 2px 12px rgba(0,0,0,0.1)", border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:10, color:C.gray3, fontWeight:600, marginBottom:2 }}>
                {activeTag==="all" ? "表示中のスポット" : `#${TAGS.find(t=>t.id===activeTag)?.label}`}
              </div>
              <div style={{ fontSize:18, fontWeight:900, color:C.navy }}>
                {filteredPins.length}
                <span style={{ fontSize:11, fontWeight:500, color:C.gray3, marginLeft:4 }}>件</span>
              </div>
            </div>

            {/* 상세 패널 */}
            {selected && (
              <DetailPanel pin={selected} onClose={()=>setSelected(null)}
                onLike={toggleLike} onSave={toggleSave}
                likedIds={likedIds} savedIds={savedIds}/>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 