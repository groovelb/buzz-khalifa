
# PRD: The Vertical Breath (초고층 빌딩 공정 시각화)

## 1. 프로젝트 개요
'The Vertical Breath'는 세계 최고층 빌딩인 부르즈 할리파의 건축 철학과 공정을 모티브로 한 인터랙티브 웹 시각화 프로젝트입니다. 사용자의 스크롤에 따라 건물이 지면에서부터 하늘 끝까지 솟아오르는 과정을 5단계의 핵심 공정으로 나누어 보여줍니다.

## 2. 핵심 목표
- **교육적 가치**: 초고층 빌딩의 복잡한 공정(기초, 코어, 후퇴구조 등)을 직관적으로 이해.
- **시각적 경험**: '고급 장난감' 같은 미니멀하고 따뜻한 파스텔 톤의 3D 디자인 제공.
- **인터랙션**: 사용자의 스크롤 속도와 위치에 반응하는 유연한 애니메이션 구현.

## 3. 디자인 가이드 (Bruno Simon Style)
- **Geometry**: 모든 모서리는 `RoundedBoxGeometry`를 사용하여 부드러운 질감을 구현.
- **Palette**: 
  - 지면: 연한 샌드/그레이 (#e5e5e5)
  - 구조물: 웜 화이트 (#ffffff)
  - 유리/외벽: 파스텔 블루 (#a2d2ff)
- **Lighting**: `Environment(city)`와 `ContactShadows`를 조합하여 부드럽고 사실적인 그림자 연출.
- **Camera**: Orthographic Camera를 사용하여 원근감이 제거된 아이소메트릭 뷰 제공.

## 4. 공정 데이터 정의 (5 Pages)
1.  **Stage 1: Foundation (스크롤 0% ~ 20%)**
    - 지반 매트(Mat) 형성 및 파일(Piling) 박기 공정.
2.  **Stage 2: Core (스크롤 20% ~ 40%)**
    - 건물의 중심축인 콘크리트 코어 구조물 상승.
3.  **Stage 3: Setbacks (스크롤 40% ~ 60%)**
    - 바람의 저항을 줄이기 위한 나선형 후퇴 구조(Y-shape) 형성.
4.  **Stage 4: Cladding (스크롤 60% ~ 80%)**
    - 반짝이는 커튼월 외벽 유리 부착.
5.  **Stage 5: Spire (스크롤 80% ~ 100%)**
    - 최상단 첨탑 완성 및 안테나 설치.

## 5. 기술 스택
- **Runtime**: React 18, TypeScript
- **3D Engine**: Three.js, @react-three/fiber
- **Utilities**: @react-three/drei (ScrollControls, RoundedBox)
- **Animation**: @react-spring/three (물리 기반 보간)
- **Styling**: Tailwind CSS
