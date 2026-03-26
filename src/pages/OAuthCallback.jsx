// OAuthCallback.jsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const OAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
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
                alert("가입을 축하합니다! 자동으로 로그인되었습니다.");
            } else if (status === "login_success") {
                console.log("로그인 성공");
            }

            // 4. 메인 페이지로 이동 (URL에서 토큰이 사라짐)
            navigate("/", { replace: true });
        } else {
            // 에러 처리
            if (status === "already_exists") {
                alert("이미 가입된 계정입니다. 로그인을 시도해주세요.");
            } else if (status === "user_not_found") {
                alert("등록된 정보가 없습니다. 회원가입을 먼저 진행해주세요.");
            } else {
                alert("로그인 중 오류가 발생했습니다.");
            }
            navigate("/login", { replace: true });
        }
    }, [searchParams, navigate]);

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <p>인증 처리 중입니다. 잠시만 기다려주세요...</p>
        </div>
    );
};

export default OAuthCallback;
