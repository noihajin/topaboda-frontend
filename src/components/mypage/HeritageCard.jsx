import { Link } from "react-router-dom";

export default function HeritageCard({ item }) {
    return (
        <Link to={`/heritage/${item.heritageId}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div
                className="ht-card"
                style={{
                    position: "relative",
                    borderRadius: 16,
                    overflow: "hidden",
                    height: 140,
                    cursor: "pointer",
                }}
            >
                <img src={item.image} alt={item.heritageName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />

                <div
                    className="overlay"
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "white",
                        textAlign: "center",
                        padding: "10px",
                    }}
                >
                    <p style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{item.heritageName}</p>
                    <p style={{ fontSize: 12, opacity: 0.8 }}>{item.region}</p>
                </div>
            </div>
        </Link>
    );
}
