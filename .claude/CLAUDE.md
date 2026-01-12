# The Vertical Breath - 프로젝트 룰

## 프로젝트 개요
부르즈 할리파의 건축 철학을 모티브로 한 인터랙티브 3D 웹 시각화 프로젝트.
스크롤 기반으로 5단계 건축 공정을 시각화합니다.

## 기술 스택
- **Runtime**: React 18, TypeScript (strict mode)
- **3D Engine**: Three.js, @react-three/fiber
- **Utilities**: @react-three/drei (ScrollControls, RoundedBox)
- **Animation**: @react-spring/three
- **Styling**: Tailwind CSS

## 핵심 원칙

### 성능 최우선
- Three.js 오브젝트는 반드시 `useMemo`로 메모이제이션
- geometry와 material은 재사용하여 GPU 메모리 절약
- `useFrame` 내부에서 상태 업데이트 최소화
- `dispose()` 호출로 메모리 누수 방지

### Bruno Simon 스타일 준수
- 모든 3D 오브젝트는 `RoundedBox` 또는 둥근 모서리 geometry 사용
- 파스텔 톤 컬러 팔레트 엄격 준수
- '고급 장난감' 같은 미니멀한 미학 유지

### 스크롤 기반 아키텍처
- 5단계 공정을 0-100% 스크롤 범위로 매핑
- `@react-three/drei`의 `ScrollControls` 사용
- 스크롤 진행도는 `useScroll` hook으로 관리

## 디렉토리 구조 규칙
```
src/
├── components/       # React 컴포넌트
│   └── three/        # R3F 전용 3D 컴포넌트
├── hooks/            # 커스텀 훅
├── constants/        # 상수 정의 (색상, 스테이지 데이터)
├── types/            # TypeScript 타입 정의
└── utils/            # 유틸리티 함수
```

## 파일 참조
- @PRD.md - 상세 기획 문서
- @.claude/rules/ - 세부 규칙들

## 빌드 & 테스트 명령어
- 개발 서버: `npm run dev`
- 빌드: `npm run build`
- 타입 체크: `npm run typecheck`
- 린트: `npm run lint`
