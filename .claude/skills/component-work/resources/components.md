# Buzz Khalifa Components

이 목록은 이 저장소에 실제 존재하는 컴포넌트만 기록한다.
스타터키트 분류를 사용하며 제품은 TSX와 R3F, 문서는 MUI 기반이다.

## 4. Media

| 컴포넌트 | 경로 (`src/` 기준) | 책임 |
|---|---|---|
| ImageReveal | components/media/ImageReveal.tsx | 공정 사진 진입 효과 |

## 8. Layout

| 컴포넌트 | 경로 (`src/` 기준) | 책임 |
|---|---|---|
| Header | components/layout/Header.tsx | 고정 제호·간행 정보 |
| Footer | components/layout/Footer.tsx | 고정 출처·인용 |

## 11. Kinetic Typography

| 컴포넌트 | 경로 (`src/` 기준) | 책임 |
|---|---|---|
| TextReveal | components/kinetic-typography/TextReveal.tsx | 글자 단위 등장 |

## 12. Scroll

| 컴포넌트 | 경로 (`src/` 기준) | 책임 |
|---|---|---|
| ConstructionOverlay | components/scroll/ConstructionOverlay.tsx | 데이터로 여섯 공정 조합 |
| ConstructionSection | components/scroll/ConstructionSection.tsx | 한 공정의 해설·사진 지면 |

## Three (R3F 전용, Scroll3DEffect)

| 컴포넌트 | 경로 (`src/components/three/` 기준) | 책임 |
|---|---|---|
| ConstructionExperience | ConstructionExperience.tsx | Canvas·스크롤·Bloom 경계 |
| ConstructionScene | ConstructionScene.tsx | 조명·카메라·건물 연결 |
| Building | Building.tsx | 공정별 건물 조합 |
| CinematicCamera | CinematicCamera.tsx | 기존 카메라 유틸리티 |
| DayNightCycle | environment/DayNightCycle.tsx | 하늘·태양·달 |
| Foundation | stages/Foundation.tsx | 기초와 파일 |
| Core | stages/Core.tsx | 중앙 코어 |
| Setbacks | stages/Setbacks.tsx | 하부 티어 |
| Cladding | stages/Cladding.tsx | 중부 티어와 외피 |
| Illumination | stages/Illumination.tsx | 상부 티어와 야간 발광 |
| Spire | stages/Spire.tsx | 첨탑과 장애등 |

R3F 하위 컴포넌트는 Canvas와 ScrollControls 안에서만 렌더한다.
개별 공정은 제품용 공개 props 없이 스크롤에서 상태를 읽는다.
전체 조합 스토리에서 실제 문맥을 제공한다.

## Storybook Documentation

`src/components/storybookDocumentation/`에 스타터키트 문서 도구를 재사용한다.

- EditorialDocument: Markdown 원본과 GFM 표 렌더링.
- DocumentTitle: 문서 메타 정보.
- PageContainer: 문서 폭.
- SectionTitle: 문서 섹션 제목.
- documentTheme.js: 문서 전용 중립 테마.

## 스토리

- `src/stories/components/TextReveal.stories.tsx`: 모든 등장 props.
- `src/stories/components/ImageReveal.stories.tsx`: 사진·방향·타이밍.
- `src/stories/components/ConstructionSection.stories.tsx`: 데이터·좌우·높이.
- `src/stories/components/ConstructionExperience.stories.tsx`: 3D 전체 조합.
- `src/stories/page/BuzzKhalifa.stories.tsx`: 전체 제품 페이지.
- `src/stories/overview/*.mdx`: 기획 문서 원본의 raw import.

## 데이터와 훅

- `src/data/constructionStages.ts`: 공정 콘텐츠·이미지.
- `src/data/scrollConfig.ts`: 6개 구간·7페이지·타이밍.
- `src/data/burjKhalifaData.ts`: 모델 치수·티어·재질 색상.
- `src/hooks/useDayNight.ts`: 낮과 밤의 파생 조명값.
- `src/hooks/useTheme.ts`: DOM의 낮과 밤 테마.
- 추가 훅은 `src/hooks/`와 구현 부록을 확인한다.
