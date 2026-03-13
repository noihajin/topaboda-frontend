import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MainHome from "./pages/MainHome";
import Community from "./pages/Community";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">

        {/* 네비바: 모든 페이지 공통, fixed라서 pt 필요 없음 */}
        <Navbar />

        {/* ✅ pt 제거: 메인홈 히어로 이미지가 네비바 뒤까지 올라와야 투명 효과가 보임
               서브페이지는 각자 컴포넌트 내부에서 pt를 처리함 */}
        <main className="flex-grow">
          <Routes>
            <Route path="/"          element={<MainHome />} />
            <Route path="/community" element={<Community />} />
          </Routes>
        </main>

        <Footer />

      </div>
    </Router>
  );
}

export default App;