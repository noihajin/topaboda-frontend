import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MainHome from "./pages/MainHome"; 
import Community from "./pages/Community"; // 파일명을 Community로 바꾸셨다면 확인!

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        {/* 모든 페이지에서 공통으로 보이는 네비바 */}
        <Navbar />

        {/* 페이지 본문: 주소에 따라 MainHome 또는 Community가 교체되어 나타남 */}
        <main className="flex-grow pt-[11.9rem]"> {/* 네비바 높이만큼 상단 여백 보정 */}
          <Routes>
            {/* 메인 화면: 지도와 인기유산이 들어있는 MainHome 렌더링 */}
            <Route path="/" element={<MainHome />} /> 
            
            {/* 커뮤니티 화면: 게시판 리스트 렌더링 */}
            <Route path="/community" element={<Community />} />
          </Routes>
        </main>

        {/* 모든 페이지에서 공통으로 보이는 푸터 */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;