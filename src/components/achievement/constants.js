// ── カラートークン ──
export const C = {
  navy:    "#000D57",
  red:     "#6E0000",
  gold:    "#CACA00",
  goldDark:"#DAA520",
  silver:  "#C0C0C0",
  bronze:  "#CD7F32",
  bg:      "#F3F3F5",
  white:   "#FFFFFF",
  border:  "#E5E7EB",
  text:    "#1A1A2E",
  sub:     "#6B7280",
};

export const font      = "'Noto Sans JP', 'Roboto', sans-serif";
export const fontSerif = "'Noto Serif JP', serif";

// ── メダル情報マップ ──
export const MEDAL_INFO = {
  金: {
    img:   "https://www.figma.com/api/mcp/asset/957a3774-c31f-43e0-954d-aab098bc294c",
    color: C.gold,
    emoji: "🥇",
  },
  銀: {
    img:   "https://www.figma.com/api/mcp/asset/701eea58-d86c-4cc1-b8da-deb09d7d608a",
    color: C.silver,
    emoji: "🥈",
  },
  銅: {
    img:   "https://www.figma.com/api/mcp/asset/6001625a-0a5c-44ae-908d-a9f8aa3bdb36",
    color: C.bronze,
    emoji: "🥉",
  },
};

export const ITEMS_PER_PAGE = 4;

// ── モックデータ 16件 (API연동 전 임시) ──
export const MOCK_ACHIEVEMENTS = [
  { id:1,  title:"国宝探訪者",       description:"国宝に指定された文化遺産を50か所訪問した達成者に贈られる称号です。",               grade:"金", criteriaLabel:"国宝訪問",      current:50, total:50,  achieved:true,  date:"2024.08.15" },
  { id:2,  title:"遺産の守護者",     description:"ユネスコ世界遺産に登録された韓国の遺産をすべて訪問した方に授与されます。",           grade:"金", criteriaLabel:"世界遺産訪問",  current:16, total:16,  achieved:true,  date:"2024.06.03" },
  { id:3,  title:"文化探求者",       description:"宝物に指定された文化遺産を30か所訪問した達成者に贈られる称号です。",               grade:"銀", criteriaLabel:"宝物訪問",      current:30, total:30,  achieved:true,  date:"2024.05.20" },
  { id:4,  title:"首都の歴史人",     description:"ソウルにある主要な文化遺産を20か所訪問した達成者に贈られます。",                   grade:"銀", criteriaLabel:"ソウル遺産訪問",current:20, total:20,  achieved:true,  date:"2024.04.11" },
  { id:5,  title:"慶州の旅人",       description:"慶州にある文化遺産を15か所以上訪問した達成者に贈られる称号です。",                 grade:"銀", criteriaLabel:"慶州遺産訪問",  current:15, total:15,  achieved:true,  date:"2024.03.29" },
  { id:6,  title:"自然の守り人",     description:"天然記念物に指定された自然遺産を10か所訪問した達成者に授与されます。",             grade:"銀", criteriaLabel:"天然記念物訪問",current:10, total:10,  achieved:true,  date:"2024.02.14" },
  { id:7,  title:"朝鮮王朝の探検家", description:"朝鮮時代の宮殿と王陵をすべて訪問した達成者に贈られる称号です。",                   grade:"銀", criteriaLabel:"朝鮮遺産訪問",  current:25, total:25,  achieved:true,  date:"2024.01.07" },
  { id:8,  title:"初めての一歩",     description:"初めて文化遺産を訪問した全てのユーザーに贈られる記念バッジです。",                   grade:"銅", criteriaLabel:"初回訪問",      current:1,  total:1,   achieved:true,  date:"2023.11.02" },
  { id:9,  title:"無形文化の継承者", description:"無形文化遺産を20か所訪問すると獲得できます。まだ道半ばです。",                     grade:"金", criteriaLabel:"無形遺産訪問",  current:12, total:20,  achieved:false, date:null },
  { id:10, title:"全国制覇の旅人",   description:"韓国全17の広域市・道の文化遺産を訪問した達成者に授与される最高の称号。",           grade:"金", criteriaLabel:"全地域訪問",    current:9,  total:17,  achieved:false, date:null },
  { id:11, title:"コミュニティリーダー", description:"コミュニティ投稿を100件以上作成した達成者に贈られるバッジです。",               grade:"金", criteriaLabel:"投稿作成",      current:32, total:100, achieved:false, date:null },
  { id:12, title:"民俗文化の探求者", description:"民俗文化財に指定された遺産を15か所訪問すると獲得できます。",                       grade:"銀", criteriaLabel:"民俗文化財訪問",current:7,  total:15,  achieved:false, date:null },
  { id:13, title:"史跡踏破者",       description:"史跡に指定された遺産を40か所訪問した達成者に贈られます。",                         grade:"銀", criteriaLabel:"史跡訪問",      current:18, total:40,  achieved:false, date:null },
  { id:14, title:"週末の冒険家",     description:"週末に10回以上文化遺産を訪問した達成者に贈られる称号です。",                       grade:"銅", criteriaLabel:"週末訪問",      current:6,  total:10,  achieved:false, date:null },
  { id:15, title:"写真記録者",       description:"訪問した文化遺産の写真を30枚以上投稿した達成者に贈られます。",                     grade:"銅", criteriaLabel:"写真投稿",      current:15, total:30,  achieved:false, date:null },
  { id:16, title:"レビュー貢献者",   description:"文化遺産のレビューを20件以上投稿した達成者に贈られる称号です。",                   grade:"銅", criteriaLabel:"レビュー投稿",  current:8,  total:20,  achieved:false, date:null },
];
