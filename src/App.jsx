import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// 컴포넌트 임포트
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// 페이지 임포트
import MainHome from "./pages/MainHome";
import Community from "./pages/Community";
import WritePost from "./pages/WritePost";
import Login from "./pages/Login";
import RegisterSelect from "./pages/RegisterSelect"; // ★ 추가됨
import Register from "./pages/Register"; // ★ 추가됨

// ── [인증 가드 컴포넌트] ───────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");

  if (!isAuthenticated) {
    alert("ログインが必要です。");
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />

        <main className="flex-grow">
          {/* ✅ 모든 Route는 이 Routes 태그 안에 있어야 합니다 */}
          <Routes>
            {/* 1. 메인 홈 */}
            <Route path="/" element={<MainHome />} />

            {/* 2. 커뮤니티 리스트 */}
            <Route path="/community" element={<Community />} />

            {/* 3. 로그인 페이지 */}
            <Route path="/login" element={<Login />} />

            {/* 4. 회원가입 선택창 (소셜 vs 이메일) */}
            <Route path="/register" element={<RegisterSelect />} />

            {/* 5. 이메일 회원가입 상세 폼 */}
            <Route path="/register/form" element={<Register />} />

            {/* 6. 커뮤니티 글쓰기 (보호된 경로) */}
            <Route
              path="/community/write"
              element={
                <ProtectedRoute>
                  <WritePost />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;