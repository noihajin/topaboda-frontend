톺아보다 (トパボダ) - Frontend

한국의 국가유산을 탐색하고 업적을 쌓는 지도 기반 서비스입니다.
韓国の国家遺産を探索し、実績을 쌓는 地図ベースのサービスです。

🚀 Getting Started (インストールと実行)

1. Clone the repository
```bash
git clone [https://github.com/noihajin/topaboda-frontend.git](https://github.com/noihajin/topaboda-frontend.git)
cd topaboda-frontend

✨ 핵심 기능 (Key Features)

- 인터랙티브 줌 & 드래그: 
  - `Framer Motion`을 활용한 부드러운 지도 이동 및 확대/축소 기능을 지원합니다.
  
- 스마트 클러스터링 (Smart Clustering):
  - 축소 시: 지역별 유산 개수를 보여주는 핀 노출.
  - 확대 시 (1.5x 이상): 개별 유산의 위치를 가리키는 정교한 마커와 이름표로 자동 전환.
  
- 논블로킹(Non-blocking) 상세 사이드바:
  - 핀 클릭 시 우측에서 상세 정보 패널이 등장하며, 사이드바가 열린 상태에서도 지도를 실시간으로 조작할 수 있습니다.

- 미리보기 툴팁: 
  - 마커 호버 시 유산의 대표 이미지와 명칭을 팝업 형태로 미리 보여줍니다.

🎮 조작 가이드 (Interaction Guide)

1. 지도 이동: 마우스를 클릭한 채 드래그하여 대한민국 전역을 탐색할 수 있습니다.
2. 확대/축소: 
3. 상세 정보: 핀을 클릭하면 우측에서 상세 설명, 위치 정보, 사용자 리뷰를 확인할 수 있습니다.
4. 좋아요/저장: 사이드바 및 카드 상단에서 실시간 하트와 북마크 표시가 가능합니다. (자주색 & 골드 브랜드 컬러 적용)

🛠️ 사용 기술 (Tech Stack)

- React / Tailwind CSS**: 레이아웃 및 스타일링
- Framer Motion: 드래그, 줌, 레이아웃 전환 애니메이션
- Lucide React / SVG: 커스텀 마커 및 인터랙티브 아이콘


https://github.com/user-attachments/assets/ccb3e3b6-cf17-4c1d-8670-8866c4ba3f23



