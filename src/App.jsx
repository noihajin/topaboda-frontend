import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// 컴포넌트 임포트
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// 페이지 임포트
import MainHome from "./pages/MainHome";
import Community from "./pages/Community";
import WritePost from "./pages/WritePost";
import Login from "./pages/Login"; // ★ 로그인 페이지 임포트

// ── [인증 가드 컴포넌트] ───────────────────────────────────────────
// 로그인 상태가 아니면 글쓰기 페이지 진입을 막고 로그인으로 보냅니다.
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // 로컬스토리지 토큰 확인
  
  if (!isAuthenticated) {
    alert("ログインが必要です。"); // 로그인 필요 알림
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        
        {/* 네비바: 모든 페이지 공통 */}
        <Navbar />

        {/* 메인 콘텐츠 영역 */}
        <main className="flex-grow">
          <Routes>
            {/* 1. 메인 홈 */}
            <Route path="/" element={<MainHome />} />
            
            {/* 2. 커뮤니티 리스트 */}
            <Route path="/community" element={<Community />} />
            
            {/* 3. 로그인 페이지 */}
            <Route path="/login" element={<Login />} />

            {/* 4. 커뮤니티 글쓰기 (보호된 경로) */}
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