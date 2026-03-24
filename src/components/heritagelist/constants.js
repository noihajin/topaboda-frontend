// ── 디자인 토큰 ──
export const C = {
  navy:    "#000d57",
  red:     "#6e0000",
  gold:    "#caca00",
  bg:      "#f3f3f5",
  white:   "#ffffff",
  border:  "rgba(0,13,87,0.1)",
  textSub: "rgba(0,13,87,0.5)",
  textBody:"rgba(0,13,87,0.7)",
};

export const font      = "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'sans-serif'";
export const fontSerif = "'Noto Serif JP', 'Shippori Mincho', 'serif'";

// ── 카테고리 배지 색상 ──
export const BADGE_STYLE = {
  "国宝":      { bg: C.gold,    color: C.navy  },
  "宝物":      { bg: C.red,     color: "white" },
  "史跡":      { bg: C.navy,    color: "white" },
  "天然記念物": { bg: "#1a4c7c", color: "white" },
  "無形遺産":  { bg: "#2d6a4f", color: "white" },
  "民俗文化財": { bg: "#3d005c", color: "white" },
};

export const CATEGORIES = ["すべて", "国宝", "宝物", "史跡", "天然記念物", "無形遺産", "民俗文化財"];
export const REGIONS = [
  "すべての地域",
  "ソウル",
  "プサン",
  "テグ",
  "インチョン",
  "クァンジュ",
  "テジョン",
  "ウルサン",
  "キョンギ",
  "カンウォン",
  "チュンブク",
  "チュンナム",
  "チョンブク",
  "チョンナム",
  "キョンブク",
  "キョンナム",
  "セジョン",
  "チェジュ",
];
export const PAGE_SIZE  = 9;

// ── 히어로 통계 수치 ──
export const HERO_STATS = [
  { num: "349",    label: "国宝" },
  { num: "2,220",  label: "宝物" },
  { num: "536",    label: "史跡" },
  { num: "473",    label: "天然記念物" },
  { num: "4,000+", label: "全遺産" },
];

// ── 목 데이터 (API 연동 전 임시) ──
export const MOCK_HERITAGES = [
  { id:1,  nameKo:"独島",            nameKr:"독도",            nameEn:"Dokdo",                    region:"慶北",  category:"天然記念物", img:"https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=600" },
  { id:2,  nameKo:"済州 漢拏山",     nameKr:"제주 한라산",     nameEn:"Hallasan Mountain",         region:"済州",  category:"天然記念物", img:"https://images.unsplash.com/photo-1570092640903-9f959e3f4456?q=80&w=600" },
  { id:3,  nameKo:"訓民正音 解例本", nameKr:"훈민정음 해례본", nameEn:"Hunminjeongeum Haerye",     region:"ソウル", category:"国宝",      img:"https://images.unsplash.com/photo-1618176729090-253077a8f948?q=80&w=600" },
  { id:4,  nameKo:"景福宮",         nameKr:"경복궁",          nameEn:"Gyeongbokgung Palace",      region:"ソウル", category:"史跡",      img:"https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=600" },
  { id:5,  nameKo:"昌徳宮",         nameKr:"창덕궁",          nameEn:"Changdeokgung Palace",      region:"ソウル", category:"史跡",      img:"https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?q=80&w=600" },
  { id:6,  nameKo:"水原 華城",       nameKr:"수원 화성",       nameEn:"Hwaseong Fortress",         region:"京畿",  category:"史跡",      img:"https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=600" },
  { id:7,  nameKo:"海印寺 八万大蔵経",nameKr:"해인사 팔만대장경",nameEn:"Haeinsa Tripitaka Koreana",region:"慶南",  category:"国宝",      img:"https://images.unsplash.com/photo-1590603740183-980e7f6920eb?q=80&w=600" },
  { id:8,  nameKo:"石窟庵",         nameKr:"석굴암",          nameEn:"Seokguram Grotto",          region:"慶北",  category:"国宝",      img:"https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=600" },
  { id:9,  nameKo:"宗廟",           nameKr:"종묘",            nameEn:"Jongmyo Shrine",            region:"ソウル", category:"史跡",      img:"https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=600" },
  { id:10, nameKo:"仏国寺",         nameKr:"불국사",          nameEn:"Bulguksa Temple",           region:"慶北",  category:"国宝",      img:"https://images.unsplash.com/photo-1590603740183-980e7f6920eb?q=80&w=600" },
  { id:11, nameKo:"安東 河回村",     nameKr:"안동 하회마을",   nameEn:"Hahoe Folk Village",        region:"慶北",  category:"民俗文化財", img:"https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=600" },
  { id:12, nameKo:"南漢山城",       nameKr:"남한산성",        nameEn:"Namhansanseong Fortress",   region:"京畿",  category:"史跡",      img:"https://images.unsplash.com/photo-1598935888738-cd2622bcd437?q=80&w=600" },
];
