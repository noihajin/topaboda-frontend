import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// 컴포넌트 임포트
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
import SectionNavButton from "./components/SectionNavButton";

// 페이지 임포트
import MainHome from "./pages/MainHome";
import Community from "./pages/Community";
import WritePost from "./pages/WritePost";
import Login from "./pages/Login";
import RegisterSelect from "./pages/RegisterSelect";
import Register from "./pages/Register";
import HeritageDetail from "./pages/HeritageDetail";
import HeritageList from "./pages/HeritageList";
import MyPage from "./pages/Mypage";
import Achievement from "./pages/Achievement";
import RouteCreate from "./pages/RouteCreate";
import PostDetail from "./pages/PostDetail";
import EditProfile from "./pages/EditProfile";

// ── [인증 가드 컴포넌트] ───────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  if (!isAuthenticated) {
    alert("ログインが必要です。");
    return <Navigate to="/login" replace />;
  }
  return children;
};

// 마이페이지 편집(임시)

// ── Navbar/Footer를 조건부로 렌더하는 레이아웃 ───────────────────
const HIDE_NAV_PATHS = ["/route/create"];

function AppLayout() {
  const location = useLocation();
  const hideNav = HIDE_NAV_PATHS.includes(location.pathname);

  return (
    <>
    <ScrollToTop />
    <div className="min-h-screen flex flex-col font-sans">
      {!hideNav && <Navbar />}

      <main className="flex-grow">
        <Routes>
          {/* 1. 메인 홈 */}
          <Route path="/" element={<MainHome />} />

          {/* 2. 커뮤니티 리스트 */}
          <Route path="/community" element={<Community />} />

          {/* 2-1. 커뮤니티 게시글 상세 */}
          <Route path="/community/:postId" element={<PostDetail />} />

          {/* 3. 로그인 */}
          <Route path="/login" element={<Login />} />

          {/* 4. 회원가입 선택 */}
          <Route path="/register" element={<RegisterSelect />} />

          {/* 5. 이메일 회원가입 폼 */}
          <Route path="/register/form" element={<Register />} />

          {/* 6. 마이페이지 */}
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mypage/edit" element={<EditProfile />} />

          {/* 7. 업적 페이지 */}
          <Route path="/achievements" element={<Achievement />} />

          {/* 8. 문화유산 목록 */}
          <Route path="/heritage" element={<HeritageList />} />

          {/* 9. 문화유산 상세 */}
          <Route path="/heritage/:heritageId" element={<HeritageDetail />} />

          {/* 10. 탐방로 만들기 (로그인 필요 · 전체화면 - Navbar/Footer 숨김) */}
          <Route
            path="/route/create"
            element={
              <ProtectedRoute>
                <RouteCreate />
              </ProtectedRoute>
            }
          />

          {/* 11. 커뮤니티 글쓰기 (보호된 경로) */}
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

      {!hideNav && <Footer />}
      <SectionNavButton />
      <ScrollToTopButton />
    </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
