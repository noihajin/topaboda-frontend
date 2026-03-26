// 애니메이션 Variants
export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
    },
};
export const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

export const MOCK_DATA = [
    {
        id: 1,
        name: "仏国寺",
        nameKr: "불국사",
        location: "慶州, 慶尚北道",
        likes: 1234,
        badge: "国宝",
        imageUrl: "https://images.unsplash.com/photo-1590603740183-980e7f6920eb?q=80&w=600",
    },
    {
        id: 2,
        name: "景福宮",
        nameKr: "경복궁",
        location: "ソウル",
        likes: 2567,
        badge: "国宝",
        imageUrl: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=600",
    },
    {
        id: 3,
        name: "韓屋村",
        nameKr: "전주 한옥마을",
        location: "全州, 全羅北道",
        likes: 987,
        badge: "史跡",
        imageUrl: "https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=600",
    },
    {
        id: 4,
        name: "石窟庵",
        nameKr: "석굴암",
        location: "慶州, 慶尚北道",
        likes: 1456,
        badge: "国宝",
        imageUrl: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=600",
    },
    {
        id: 5,
        name: "青磁 象嵌",
        nameKr: "청자 상감",
        location: "国立中央博物館",
        likes: 678,
        badge: "宝物",
        imageUrl: "https://images.unsplash.com/photo-1618176729090-253077a8f948?q=80&w=600",
    },
    {
        id: 6,
        name: "水原華城",
        nameKr: "수원 화성",
        location: "水原, 京畿道",
        likes: 1823,
        badge: "史跡",
        imageUrl: "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=600",
    },
];
